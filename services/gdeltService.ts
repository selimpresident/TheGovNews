import { GdeltArticle } from '../types';
import { getFromCache, setInCache } from '../utils/cache';

const GDELT_API_BASE_URL = 'https://api.gdeltproject.org/api/v2/doc/doc';
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

export const fetchGdeltArticles = async (countryEnglishName: string): Promise<GdeltArticle[]> => {
    if (!countryEnglishName) {
        console.warn('GDELT fetch called with no country name.');
        return [];
    }

    const cacheKey = `gdelt-${countryEnglishName}`;
    const cachedData = getFromCache<GdeltArticle[]>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const params = new URLSearchParams({
            query: `"${countryEnglishName}"`,
            mode: 'ArtList',
            format: 'json',
            maxrecords: '25'
        });
        const targetUrl = `${GDELT_API_BASE_URL}?${params.toString()}`;
        const proxiedUrl = `${CORS_PROXY_URL}${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(proxiedUrl);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to fetch GDELT data for ${countryEnglishName}:`, errorText);
            throw new Error(`GDELT API request failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        // The GDELT API returns an object with an 'articles' property which is an array
        const articles: GdeltArticle[] = data.articles || [];

        if (!articles) {
            console.warn(`GDELT data for ${countryEnglishName} is null or undefined.`, data);
            setInCache(cacheKey, []);
            return [];
        }

        setInCache(cacheKey, articles);
        return articles;

    } catch (error) {
        console.error(`Failed to fetch GDELT data for ${countryEnglishName}:`, error);
        throw error;
    }
};