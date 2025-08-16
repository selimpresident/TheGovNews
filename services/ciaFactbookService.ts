import { FactbookData, FactbookProfile } from '../types';
import { getFromCache, setInCache } from '../utils/cache';

const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

export function slugify(text: string): string {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

export async function fetchCountryProfileFactbook(countrySlug: string): Promise<FactbookData> {
  const cacheKey = `factbook-${countrySlug}`;
  const cachedData = getFromCache<FactbookData>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const targetUrl = `https://www.cia.gov/the-world-factbook/countries/${countrySlug}/`;
    const proxiedUrl = `${CORS_PROXY_URL}${encodeURIComponent(targetUrl)}`;
    
    const response = await fetch(proxiedUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; TheGovNewsBot/1.0; +https://thegovnews.com)" }
    });
    
    if (!response.ok) {
      throw new Error(`Page not found or fetch error: ${response.status}`);
    }
    
    const html = await response.text();
    if (html.length < 1000) { // Add a guard against empty/error pages from the proxy
        throw new Error(`Fetched page content is too small, likely a proxy error, redirect, or country not found.`);
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    if (doc.title.includes("Search Results") || doc.querySelector(".search-results-container")) {
        throw new Error(`Country slug "${countrySlug}" did not resolve to a valid page.`);
    }

    const countryNameElem = doc.querySelector('h1.hero-title');
    const country_name = countryNameElem ? countryNameElem.textContent.trim() : countrySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // The new structure uses 'wfb-category' for sections
    const sections = doc.querySelectorAll('div.wfb-category');
    const profile: FactbookProfile = {};

    sections.forEach(section => {
      const sectionTitleElem = section.querySelector('h2');
      if (!sectionTitleElem) return;
      const sectionTitle = sectionTitleElem.textContent.trim();
      
      const details: { [key:string]: string } = {};

      // Data points are now in 'div.wfb-key-value' elements
      const fields = section.querySelectorAll('.wfb-key-value');

      fields.forEach(field => {
        const labelElem = field.querySelector('p.font-bold');
        const valueElem = labelElem?.nextElementSibling;

        if (labelElem && valueElem) {
            const label = labelElem.textContent?.trim();
            const value = (valueElem as HTMLElement).innerText?.trim().replace(/\s\s+/g, '\n').trim();

            if (value && label) {
                details[label] = value;
            }
        }
      });
      if (Object.keys(details).length > 0) {
        profile[sectionTitle] = details;
      }
    });

    if (Object.keys(profile).length === 0) {
        throw new Error('Could not parse any profile data. Page structure might have changed.');
    }

    const result = { country_name, profile };
    setInCache(cacheKey, result);
    return result;

  } catch (error) {
    console.error(`CIA Factbook scraping error for slug (${countrySlug}):`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errResult: FactbookData = { country_name: countrySlug, profile: {}, error: `Data could not be retrieved: ${errorMessage}` };
    // Do not cache errors to allow for retries
    return errResult;
  }
}