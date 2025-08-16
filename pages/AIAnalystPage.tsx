import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChatMessage, AnalystMode, Article, AiAnalysisResult, Source } from '../types';
import { CountryMappings } from '../services/countryDataService';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import { Chat, Part } from '@google/genai';
import ChatInterface from '../components/ChatInterface';
import { processImageFile } from '../utils/imageUtils';
import { ArrowLeftIcon } from '../components/Icons';

interface AIAnalystPageProps {
    setView: (view: { name: string; context?: any }) => void;
    context: { mode: AnalystMode, countryName?: string };
    countryMappings: CountryMappings;
}

const AIAnalystPage: React.FC<AIAnalystPageProps> = ({ setView, context, countryMappings }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [attachedImage, setAttachedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [chatError, setChatError] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    
    const { mode, countryName } = context;

    const englishCountryName = useMemo(() => {
        return countryName ? countryMappings.turkishToEnglish.get(countryName) || countryName : 'Global';
    }, [countryName, countryMappings]);

    useEffect(() => {
        let systemInstruction = `You are a world-class geopolitical analyst named 'TheGovNews Analyst'. Your knowledge is up-to-date. Provide detailed, neutral, and factual analysis. When asked, cite potential sources if possible but do not invent URLs. Keep answers concise but informative. You can also analyze images provided by the user.`;
        if (mode === 'country' && englishCountryName) {
            systemInstruction += ` Your primary focus for this session is ${englishCountryName}. All questions should be interpreted in the context of this country unless specified otherwise.`;
        } else {
            systemInstruction += ` Your focus for this session is global analysis.`;
        }
        
        const session = createChatSession(systemInstruction);
        setChatSession(session);
        setMessages([]); // Reset messages when context changes

    }, [mode, englishCountryName]);

    const handleAttachImage = () => {
        imageInputRef.current?.click();
    };

    const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsProcessingImage(true);
            setChatError(null);
            try {
                const { previewUrl } = await processImageFile(file);
                setAttachedImage(file);
                setImagePreview(previewUrl);
            } catch (err) {
                const errorMessage = (err as Error).message;
                setChatError(errorMessage);
            } finally {
                setIsProcessingImage(false);
            }
        }
        if (e.target) e.target.value = '';
    };

    const handleRemoveImage = () => {
        setAttachedImage(null);
        setImagePreview(null);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !attachedImage) || !chatSession || isLoading) return;

        const userMessageText = input;
        const userMessageForHistory: ChatMessage = { role: 'user', text: userMessageText, imagePreview };
        
        setMessages(prev => [...prev, userMessageForHistory]);
        setInput('');
        
        const imageToProcess = attachedImage;
        setAttachedImage(null);
        setImagePreview(null);
        setIsLoading(true);
        setChatError(null);

        try {
            let messageForApi: string | Part[];
            if (imageToProcess) {
                const { base64Data, mimeType } = await processImageFile(imageToProcess);
                messageForApi = [
                    { text: userMessageText },
                    { inlineData: { mimeType, data: base64Data } }
                ];
            } else {
                messageForApi = userMessageText;
            }

            const stream = sendMessageStream({ message: messageForApi, chat: chatSession });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error(error);
            const errorMessage = "Sorry, I encountered an error. Please try again.";
            setChatError(errorMessage);
            setMessages(prev => prev.filter(msg => msg.role !== 'model' || msg.text !== ''));
        } finally {
            setIsLoading(false);
        }
    };
    
    const welcomeMessage = useMemo(() => (
        <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-sm text-blue-800 dark:text-blue-300">
            Welcome to the AI Analyst.
            {mode === 'country' 
                ? ` The current analysis context is focused on ${englishCountryName}. Ask me anything about its current geopolitical events, trends, or internal affairs.`
                : ` You are in Global Analysis mode. Ask me anything about international relations, geopolitical events, or comparative analysis.`
            }
        </div>
    ), [mode, englishCountryName]);

    return (
         <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col">
            <header className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 backdrop-blur-md">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                AI Analyst: <span className="text-blue-600">{englishCountryName}</span>
                            </h1>
                        </div>
                        <button onClick={() => setView({ name: countryName ? 'country' : 'landing', context: { countryName } })} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <ArrowLeftIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                            <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">Back</span>
                        </button>
                    </div>
                </div>
            </header>
            <div className="flex-grow max-w-4xl w-full mx-auto p-4">
                 <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-[calc(100vh-8rem)]">
                     <input type="file" accept="image/png, image/jpeg, image/webp" ref={imageInputRef} onChange={handleImageFileChange} className="hidden" />
                     <ChatInterface
                        messages={messages}
                        input={input}
                        onInputChange={(e) => setInput(e.target.value)}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        thinkingText="Analyst is thinking..."
                        welcomeMessage={welcomeMessage}
                        onAttachImageClick={handleAttachImage}
                        attachedImagePreview={imagePreview}
                        onRemoveAttachedImage={handleRemoveImage}
                        isProcessingImage={isProcessingImage}
                        processingImageText="Processing image..."
                        inputPlaceholder={`Ask about ${englishCountryName}...`}
                        chatError={chatError}
                        countryMappings={countryMappings}
                        onCountryClick={(country) => {
                            setView({ name: 'country', context: { countryName: country } })
                        }}
                    />
                 </div>
            </div>
        </div>
    );
};

export default AIAnalystPage;
