import { WorldBankIndicator } from '../types';
import { getFromCache, setInCache } from '../utils/cache';

const WORLD_BANK_API_BASE_URL = 'https://api.worldbank.org/v2/country';
// Switched to a more reliable CORS proxy
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

export const indicatorConfig: Record<string, { code: string; format: 'currency' | 'number' | 'percent' }> = {
    GDP: { code: 'NY.GDP.MKTP.CD', format: 'currency' },
    GDP_PER_CAPITA: { code: 'NY.GDP.PCAP.CD', format: 'currency' },
    POPULATION: { code: 'SP.POP.TOTL', format: 'number' },
    INFLATION: { code: 'FP.CPI.TOTL.ZG', format: 'percent' },
    UNEMPLOYMENT: { code: 'SL.UEM.TOTL.ZS', format: 'percent' },
};

export async function fetchWorldBankData(countryCode: string): Promise<WorldBankIndicator[]> {
    const cacheKey = `worldbank-${countryCode}`;
    const cachedData = getFromCache<WorldBankIndicator[]>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const allIndicatorCodes = Object.values(indicatorConfig).map(config => config.code).join(';');

    try {
        const params = new URLSearchParams({
            format: 'json',
            mrnev: '1', // Most Recent Non-Empty Value
            source: '2', // Source: World Development Indicators
        });
        const targetUrl = `${WORLD_BANK_API_BASE_URL}/${countryCode}/indicator/${allIndicatorCodes}?${params.toString()}`;
        const proxiedUrl = `${CORS_PROXY_URL}${encodeURIComponent(targetUrl)}`;

        const response = await fetch(proxiedUrl);
        if (!response.ok) {
            throw new Error(`Proxied request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        if (Array.isArray(data) && data[0]?.message?.[0]?.key === 'Invalid value') {
             throw new Error(`Invalid country code or indicator: ${countryCode}`);
        }

        if (!Array.isArray(data) || data.length < 2) {
             console.warn("No valid data received from World Bank API for", countryCode, data);
             // Return unavailable for all
             throw new Error("Data not available for this country.");
        }

        // data[1] is an array of indicator records
        const records = data[1] || [];
        const resultsMap = new Map<string, any>(records.map((rec: any) => [rec.indicator.id, rec]));

        const finalData = Object.values(indicatorConfig).map(config => {
            const record = resultsMap.get(config.code);
            if (record && record.value !== null) {
                return {
                    country: record.country.value,
                    indicator: record.indicator.value,
                    indicatorCode: config.code,
                    year: record.date,
                    value: record.value,
                };
            } else {
                return {
                    country: countryCode,
                    indicator: config.code, // Fallback
                    indicatorCode: config.code,
                    year: null,
                    value: null,
                    message: "Data not available"
                };
            }
        });

        // Only cache if we got at least some valid data
        if (finalData.some(d => d.value !== null)) {
            setInCache(cacheKey, finalData);
        }
        
        return finalData;

    } catch (error) {
        console.error(`World Bank data fetching error for ${countryCode}:`, error);
        // On error, return an array with error messages for all requested indicators
        return Object.values(indicatorConfig).map(config => ({
            country: countryCode,
            indicator: config.code,
            indicatorCode: config.code,
            year: null,
            value: null,
            message: error instanceof Error ? error.message : "Failed to fetch"
        }));
    }
}
