import { GoogleGenAI, Type, GenerateContentResponse, Chat, Part } from '@google/genai';
import { ExternalArticle, AiSearchResult, GroundingChunk, AiAnalysisResult, Article } from '../types';
import { newsSourcesData } from '../data/newsSources';
import { CountryMappings } from './countryDataService';
import { getFromCache, setInCache } from '../utils/cache';

export async function fetchNationalPress(countryName: string, countryMappings: CountryMappings): Promise<ExternalArticle[]> {
    const lang = 'en';
    const cacheKey = `gemini-press-${countryName}-${lang}`;
    const cachedData = getFromCache<ExternalArticle[]>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const sourcesForCountry = newsSourcesData[countryName];
    if (!sourcesForCountry || sourcesForCountry.length === 0) {
        console.warn(`No news sources defined for ${countryName}`);
        return [];
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const sourceNames = sourcesForCountry.map(s => s.name).join(', ');
        const englishCountryName = countryMappings.turkishToEnglish.get(countryName) || countryName;
        const prompt = `Find the 5 most recent and important news articles about ${englishCountryName} from any of the following news sources: ${sourceNames}. Only use these sources. For each article, provide the title, the direct URL to the article, the source name, the publication date in YYYY-MM-DD format, and a one or two-sentence summary. The news should be as recent as possible. Respond in English.`;

        const responseSchema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: 'The headline of the article.' },
                    url: { type: Type.STRING, description: 'The direct URL to the article.' },
                    source: { type: Type.STRING, description: 'The name of the news source from the provided list.' },
                    publishedDate: { type: Type.STRING, description: 'The publication date in ISO 8601 format (YYYY-MM-DD).' },
                    summary: { type: Type.STRING, description: 'A brief one or two sentence summary of the article.' },
                },
                required: ['title', 'url', 'source', 'publishedDate', 'summary'],
            },
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonStr = response.text.trim();
        const articles: ExternalArticle[] = JSON.parse(jsonStr);

        if (articles) {
            setInCache(cacheKey, articles);
        }

        return articles || [];

    } catch (error) {
        console.error(`Failed to fetch national press data from Gemini for ${countryName}:`, error);
        throw error; // Re-throw to be caught by the calling function
    }
}

export async function summarizeArticle(articleBody: string): Promise<string> {
    const lang = 'en';
    const bodyKey = articleBody.slice(0, 500); // Use a portion of the body as a key
    const cacheKey = `gemini-summary-${bodyKey}-${lang}`;
    const cachedData = getFromCache<string>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    if (!articleBody || articleBody.trim().length < 100) {
        return "Article content is too short to summarize.";
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Please provide a concise but comprehensive summary of the following news article. Structure the summary into 2-3 distinct paragraphs, covering the main points, the context, and any stated outcomes or implications. The tone should be neutral and informative, suitable for an intelligence briefing. Respond in English. Article:\n\n"${articleBody}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        const summary = response.text;
        
        if (summary) {
            setInCache(cacheKey, summary);
        }

        return summary || "Could not generate a summary.";
    } catch (error) {
        console.error("Failed to generate summary with Gemini:", error);
        throw new Error("AI summarization failed.");
    }
}

export async function performAiSearch(query: string): Promise<AiSearchResult> {
    if (!query || query.trim().length === 0) {
        throw new Error("Query cannot be empty.");
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `${query}. Please answer in English.`,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const summary = response.text;
        const sources: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        
        if (!summary) {
            throw new Error("Received an empty response from the AI.");
        }

        return { summary, sources };
    } catch (error) {
        console.error("Error performing AI search with Gemini:", error);
        throw new Error("The AI search request failed.");
    }
}

export function createChatSession(systemInstruction: string): Chat {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
    return chat;
}

export async function* sendMessageStream({ message, chat }: { message: string | Part[], chat: Chat }): AsyncGenerator<string> {
    const lang = 'en';
    if (!message || (typeof message === 'string' && message.trim().length === 0)) {
        return;
    }

    // Append language instruction if the message is a simple string
    let finalMessage = message;
    if (typeof message === 'string') {
        finalMessage = `${message} (Please respond in ${lang})`;
    } else {
        // If it's a multipart message (e.g., with an image), add a new text part for the language
        finalMessage = [...message, { text: `(Please respond in ${lang})` }];
    }

    try {
        const responseStream = await chat.sendMessageStream({ message: finalMessage });
        for await (const chunk of responseStream) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error sending message with Gemini:", error);
        throw new Error("AI chat request failed.");
    }
}

export async function analyzeTextSentimentAndTopics(articleBody: string): Promise<AiAnalysisResult> {
    const lang = 'en';
    const bodyKey = articleBody.slice(0, 500);
    const cacheKey = `gemini-analysis-${bodyKey}-${lang}`;
    const cachedData = getFromCache<AiAnalysisResult>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    if (!articleBody || articleBody.trim().length < 50) {
        throw new Error("Article content is too short to analyze.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Analyze the sentiment of the following news article. Provide a sentiment label ('Positive', 'Neutral', or 'Negative'), a sentiment score from 0.0 (very negative) to 1.0 (very positive) where 0.5 is neutral, and a list of up to 5 relevant topics as an array of strings. Respond in English. Article:\n\n"${articleBody}"`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                sentiment: { type: Type.STRING, enum: ['Positive', 'Neutral', 'Negative'] },
                score: { type: Type.NUMBER },
                topics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            },
            required: ['sentiment', 'score', 'topics'],
        };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonStr = response.text.trim();
        const analysisResult: AiAnalysisResult = JSON.parse(jsonStr);

        if (analysisResult) {
            setInCache(cacheKey, analysisResult);
        }

        return analysisResult;

    } catch (error) {
        console.error("Failed to generate sentiment and topic analysis with Gemini:", error);
        throw new Error("AI analysis failed.");
    }
}


export async function generatePortalBriefing(articles: Article[]): Promise<string> {
    if (articles.length === 0) {
        return "There are no articles in your feed to generate a briefing from. Please adjust your portal settings.";
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const articleSummaries = articles
            .slice(0, 20) // Limit to the 20 most recent articles to manage prompt size
            .map(a => `- ${a.title}: ${a.summary_short}`)
            .join('\n');

        const prompt = `Generate a concise, high-level intelligence briefing based on the following list of article titles and summaries. Identify 2-3 main themes or key developments. The response should be a bulleted list, written in a neutral, analytical tone for a government official.

Article Summaries:
${articleSummaries}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "Could not generate a briefing at this time.";

    } catch (error) {
        console.error("Failed to generate portal briefing with Gemini:", error);
        throw new Error("AI briefing generation failed.");
    }
}

export async function generateThematicAnalysis(articles: Article[]): Promise<string> {
    if (articles.length < 3) {
        return "Insufficient data for a comprehensive analysis. At least 3 articles are needed.";
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const articleContent = articles
            .slice(0, 30) // Limit to 30 articles to manage prompt size
            .map(a => `Title: ${a.title}\nSummary: ${a.summary_short}\nTopics: ${a.topics.join(', ')}`)
            .join('\n\n---\n\n');

        const prompt = `As a geopolitical analyst, review the following collection of news summaries. Identify the 3-5 most significant, overarching themes present in this dataset. For each theme, provide a concise title and a paragraph explaining the theme, its significance, and how the different articles connect to it. Use Markdown for formatting (e.g., use '###' for theme titles).

Data:
${articleContent}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "Could not generate a thematic analysis at this time.";

    } catch (error) {
        console.error("Failed to generate thematic analysis with Gemini:", error);
        throw new Error("AI thematic analysis generation failed.");
    }
}
