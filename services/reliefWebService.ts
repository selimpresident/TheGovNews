import { ReliefWebUpdate } from '../types';
import { getFromCache, setInCache } from '../utils/cache';

const RELIEFWEB_RSS_BASE_URL = 'https://reliefweb.int/country';
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

function stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

export async function fetchReliefWebUpdates(countryIso3: string, countryName: string): Promise<ReliefWebUpdate[]> {
    const errorResult = (message: string): ReliefWebUpdate[] => [{
        title: '', link: '', publishedDate: '', description: '', country: countryName, message
    }];

    if (!countryIso3) {
        console.warn('ReliefWeb fetch called with no country ISO3 code.');
        return errorResult("Country ISO code not found.");
    }
    
    const cacheKey = `reliefweb-${countryIso3}`;
    const cachedData = getFromCache<ReliefWebUpdate[]>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const targetUrl = `${RELIEFWEB_RSS_BASE_URL}/${countryIso3.toLowerCase()}/rss.xml`;
        const proxiedUrl = `${CORS_PROXY_URL}${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(proxiedUrl);
        if (!response.ok) {
            // ReliefWeb might return 404 if no data exists for a country
            if (response.status === 404) {
                 return [];
            }
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        const errorNode = xmlDoc.querySelector("parsererror");
        if (errorNode) {
            console.error("Error parsing ReliefWeb XML:", errorNode.textContent);
            throw new Error("Failed to parse RSS feed.");
        }
        
        const items = Array.from(xmlDoc.querySelectorAll("item"));

        if (items.length === 0) {
            setInCache(cacheKey, []);
            return [];
        }

        const updates: ReliefWebUpdate[] = items.slice(0, 15).map(item => { // Limit to 15 most recent
            const title = item.querySelector("title")?.textContent || "";
            const link = item.querySelector("link")?.textContent || "";
            const pubDate = item.querySelector("pubDate")?.textContent || "";
            const description = item.querySelector("description")?.textContent || "";

            return {
                title,
                link,
                publishedDate: new Date(pubDate).toISOString(),
                description: stripHtml(description).trim(),
                country: countryName
            };
        });

        setInCache(cacheKey, updates);
        return updates;

    } catch (error) {
        console.error(`ReliefWeb RSS fetching error for ${countryIso3}:`, error);
        return errorResult(error instanceof Error ? error.message : "Failed to fetch");
    }
}
