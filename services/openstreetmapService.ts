import { OsmData, OsmRoad } from '../types';
import { getFromCache, setInCache } from '../utils/cache';

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

export async function fetchCountryRoads(countryEnglishName: string): Promise<OsmData> {
    const cacheKey = `osm-${countryEnglishName}`;
    const cachedData = getFromCache<OsmData>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const errorResult = (message: string): OsmData => ({
        country: countryEnglishName,
        data: [],
        message,
    });
    
    // Query for major road types. This helps keep the data manageable.
    const query = `
      [out:json][timeout:300];
      area["name"="${countryEnglishName}"]->.a;
      (
        way(area.a)["highway"~"^(motorway|trunk|primary|secondary)$"];
      );
      out geom;
    `;

    try {
        const encodedQuery = encodeURIComponent(query.trim());
        const targetUrl = `${OVERPASS_API_URL}?data=${encodedQuery}`;
        // Using a proxy might be slow for Overpass, but it is necessary in this environment.
        const proxiedUrl = `${CORS_PROXY_URL}${encodeURIComponent(targetUrl)}`;

        const response = await fetch(proxiedUrl);
        if (!response.ok) {
            throw new Error(`Overpass API request failed with status: ${response.status}`);
        }
        
        const rawData = await response.json();

        if (!rawData || !Array.isArray(rawData.elements)) {
            throw new Error("Invalid data format from Overpass API");
        }
        
        const roads: OsmRoad[] = rawData.elements.map((el: any) => ({
            id: el.id,
            type: el.type,
            highway: el.tags?.highway || "unknown",
            geometry: el.geometry || []
        }));

        const result: OsmData = {
            country: countryEnglishName,
            data: roads,
        };
        
        setInCache(cacheKey, result);
        return result;

    } catch (error) {
        console.error(`OpenStreetMap data fetching error for ${countryEnglishName}:`, error);
        return errorResult(error instanceof Error ? error.message : "Failed to fetch data.");
    }
}
