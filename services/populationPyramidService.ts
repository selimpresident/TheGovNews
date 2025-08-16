import { PopulationPyramidData, PopulationDataPoint } from '../types';
import { slugify } from './ciaFactbookService';
import { getFromCache, setInCache } from '../utils/cache';

const API_BASE_URL = 'https://populationpyramid.net/api/pp';
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

export async function fetchPopulationPyramidData(countryEnglishName: string, year: number = new Date().getFullYear()): Promise<PopulationPyramidData> {
    const countrySlug = slugify(countryEnglishName);
    
    const cacheKey = `populationpyramid-${countrySlug}-${year}`;
    const cachedData = getFromCache<PopulationPyramidData>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const errorResult = (message: string): PopulationPyramidData => ({
        country: countryEnglishName,
        year,
        totalPopulation: 0,
        pyramid: [],
        message,
    });
    
    try {
        const targetUrl = `${API_BASE_URL}/${countrySlug}/${year}/`;
        const proxiedUrl = `${CORS_PROXY_URL}${encodeURIComponent(targetUrl)}`;

        const response = await fetch(proxiedUrl);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const rawData = await response.json();

        if (rawData.error) {
            throw new Error(rawData.error.description || 'API returned an error');
        }

        const pyramid: PopulationDataPoint[] = [];
        let totalPopulation = 0;

        const ageGroups = new Set<string>();
        Object.keys(rawData).forEach(key => {
            if (key.startsWith(`${year}_`)) {
                const parts = key.split('_');
                // Key format is year_startAge_endAge_gender
                if(parts.length === 4) {
                    ageGroups.add(`${parts[1]}-${parts[2]}`);
                }
            }
        });

        const sortedAgeGroups = Array.from(ageGroups).sort((a, b) => {
            const aStart = parseInt(a.split('-')[0]);
            const bStart = parseInt(b.split('-')[0]);
            return aStart - bStart;
        });

        sortedAgeGroups.forEach(ageGroup => {
            const [startAge, endAge] = ageGroup.split('-');
            const maleKey = `${year}_${startAge}_${endAge}_male`;
            const femaleKey = `${year}_${startAge}_${endAge}_female`;
            
            const malePop = rawData[maleKey] || 0;
            const femalePop = rawData[femaleKey] || 0;

            pyramid.push({
                age: ageGroup.replace('-', ' - '),
                male: malePop,
                female: femalePop,
            });
            totalPopulation += malePop + femalePop;
        });
        
        if (pyramid.length === 0) {
            throw new Error("No population data parsed from response.");
        }

        const result: PopulationPyramidData = {
            country: countryEnglishName,
            year,
            totalPopulation,
            pyramid
        };
        
        setInCache(cacheKey, result);
        return result;

    } catch (error) {
        console.error(`Population Pyramid data fetching error for ${countrySlug}:`, error);
        return errorResult(error instanceof Error ? error.message : "Failed to fetch");
    }
}
