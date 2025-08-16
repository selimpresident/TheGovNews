import { OecdIndicator } from '../types';
import { getFromCache, setInCache } from '../utils/cache';

const OECD_API_BASE_URL = 'https://stats.oecd.org/SDMX-JSON/data';
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url='; // Switched to a more reliable proxy

const oecdIndicatorMap: Record<string, { code: string; name: string }> = {
    GDP_GROWTH: { code: 'KEI.VGDPV...A', name: 'GDP Growth Rate (annual)' },
    UNEMPLOYMENT: { code: 'KEI.LRUNTT...A', name: 'Unemployment Rate' },
    INFLATION: { code: 'KEI.CPALTT01...A', name: 'Inflation (CPI, annual)' },
    INTEREST_RATE: { code: 'KEI.IR3TIB...A', name: 'Short-term Interest Rate' },
};

export async function fetchOecdData(countryCode: string): Promise<OecdIndicator[]> {
    if (!countryCode) {
        console.warn('OECD fetch called with no country code.');
        return [];
    }

    const cacheKey = `oecd-${countryCode}`;
    const cachedData = getFromCache<OecdIndicator[]>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const indicatorCodes = Object.values(oecdIndicatorMap).map(i => i.code).join('+').replace(/\.\.\./g, `.${countryCode}`);
    const dataset = 'KEI'; // Key Economic Indicators

    try {
        const params = new URLSearchParams({
            lastNObservations: '1',
            dimensionAtObservation: 'AllDimensions',
        });

        const targetUrl = `${OECD_API_BASE_URL}/${dataset}/${indicatorCodes}/all?${params.toString()}`;
        const proxiedUrl = `${CORS_PROXY_URL}${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(proxiedUrl);
        if (!response.ok) {
            throw new Error(`OECD API request failed: ${response.statusText}`);
        }

        const text = await response.text();
        if (text.trim().startsWith('<')) {
            throw new Error("Received HTML instead of JSON. The OECD API or proxy may be down or blocking the request.");
        }
        const data = JSON.parse(text);

        if (!data.dataSets || data.dataSets.length === 0) {
             throw new Error("No data available in OECD response.");
        }
        
        const parsedData = parseOecdResponse(data);
        
        if (parsedData.some(d => d.value !== null)) {
            setInCache(cacheKey, parsedData);
        }

        return parsedData;

    } catch (error) {
        console.error(`OECD data fetching error for ${countryCode}:`, error);
        return Object.values(oecdIndicatorMap).map(indicator => ({
            name: indicator.name,
            value: null,
            year: null,
            message: error instanceof Error ? error.message : "Failed to fetch",
        }));
    }
}

function parseOecdResponse(data: any): OecdIndicator[] {
    const { structure, dataSets } = data;
    if (!structure || !dataSets || dataSets.length === 0) return [];

    const timeDim = structure.dimensions.observation.find((d: any) => d.id === 'TIME_PERIOD');
    const indicatorDim = structure.dimensions.series.find((d: any) => d.id === 'SUBJECT');

    if (!timeDim || !indicatorDim) return [];

    const indicatorIdToNameMap = new Map<string, string>();
     Object.values(oecdIndicatorMap).forEach(val => {
        // KEI.VGDPV...A -> VGDPV
        const shortCode = val.code.split('.')[1];
        indicatorIdToNameMap.set(shortCode, val.name);
    });

    const results: OecdIndicator[] = [];

    Object.entries(dataSets[0].series).forEach(([seriesKey, seriesData]: [string, any]) => {
        const seriesIndices = seriesKey.split(':');
        const subjectIndex = indicatorDim.keyPosition;
        const subjectCode = indicatorDim.values[parseInt(seriesIndices[subjectIndex])].id;
        
        const indicatorName = indicatorIdToNameMap.get(subjectCode);
        if (!indicatorName) return;

        const latestObservationKey = Object.keys(seriesData.observations).pop();
        if (latestObservationKey === undefined) {
             results.push({ name: indicatorName, value: null, year: null, message: "No observation found" });
             return;
        }

        const observationIndex = parseInt(latestObservationKey);
        const observation = seriesData.observations[latestObservationKey];
        const value = observation[0];
        const year = timeDim.values[observationIndex]?.name;
        
        results.push({
            name: indicatorName,
            value: typeof value === 'number' ? value : null,
            year: year || null,
        });
    });

    // Ensure all indicators are present in the final array, even if no data was returned for them
    const finalResults = Object.values(oecdIndicatorMap).map(indicator => {
        const found = results.find(r => r.name === indicator.name);
        return found || { name: indicator.name, value: null, year: null, message: 'Data not available' };
    });

    return finalResults;
}