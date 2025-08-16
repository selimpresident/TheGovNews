import { NoaaIndicator, NoaaRawData } from '../types';
import { getFromCache, setInCache } from '../utils/cache';

const NOAA_API_BASE_URL = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data';
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

const noaaIndicators = {
    TAVG: { name: "Average Temperature", unit: "°C" },
    PRCP: { name: "Precipitation", unit: "mm" },
} as const;
type NoaaDataType = keyof typeof noaaIndicators;


export async function fetchNoaaData(countryFipsCode: string): Promise<NoaaIndicator[]> {
    const errorResult = (message: string) => Object.keys(noaaIndicators).map(key => ({
        name: key as NoaaDataType,
        value: null,
        unit: null,
        date: null,
        message,
    }));
    
    if (!countryFipsCode) {
        console.warn('NOAA fetch called with no country FIPS code.');
        return errorResult("Country code not found.");
    }

    const cacheKey = `noaa-${countryFipsCode}`;
    const cachedData = getFromCache<NoaaIndicator[]>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    try {
        const params = new URLSearchParams({
            datasetid: 'GHCND', // Global Historical Climatology Network Daily
            locationid: `FIPS:${countryFipsCode}`,
            startdate: formatDate(startDate),
            enddate: formatDate(endDate),
            datatypeid: 'TAVG,PRCP',
            units: 'metric',
            limit: '1000', // Fetch a decent number of records to find recent data
            sortfield: 'date',
            sortorder: 'desc',
        });

        const targetUrl = `${NOAA_API_BASE_URL}?${params.toString()}`;
        
        // NOTE: The NOAA API requires an API token. This implementation uses a public CORS
        // proxy which cannot securely handle or forward the required 'token' header.
        // Therefore, this service is expected to fail. A proper backend or a more advanced
        // proxy that supports custom headers is required for this to work.
        const proxiedUrl = `${CORS_PROXY_URL}${encodeURIComponent(targetUrl)}`;
        
        // The 'token' header must be sent directly to the NOAA API.
        // The simple proxy used here does not support this, and the request will likely be
        // rejected by the API. The dummy token has been removed as it served no purpose.
        const response = await fetch(proxiedUrl);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const rawResults: NoaaRawData[] = data.results || [];
        
        if (rawResults.length === 0) {
            throw new Error("No data returned from NOAA for this location.");
        }

        const latestData = new Map<NoaaDataType, NoaaIndicator>();

        // Find the most recent record for each data type
        for (const record of rawResults) {
            const dataType = record.datatype as NoaaDataType;
            if (noaaIndicators[dataType] && !latestData.has(dataType)) {
                latestData.set(dataType, {
                    name: dataType,
                    value: record.value,
                    unit: noaaIndicators[dataType].unit,
                    date: record.date.split('T')[0],
                });
            }
            // If we've found all types, we can stop
            if (latestData.size === Object.keys(noaaIndicators).length) {
                break;
            }
        }
        
        // Ensure all indicators are present in the final array
        const finalData = Object.keys(noaaIndicators).map(keyStr => {
            const key = keyStr as NoaaDataType;
            return latestData.get(key) || {
                name: key,
                value: null,
                unit: null,
                date: null,
                message: "Data not available for this type."
            };
        });

        setInCache(cacheKey, finalData);
        return finalData;

    } catch (error) {
        console.error(`NOAA data fetching error for ${countryFipsCode}:`, error);
        return errorResult(error instanceof Error ? error.message : "Failed to fetch");
    }
}
