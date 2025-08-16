import { SocialMediaLinks, SocialPost } from '../types';

const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

async function parseXmlFromUrl(url: string): Promise<Document> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }
    const xmlText = await response.text();
    if (!xmlText || xmlText.trim() === '') {
        throw new Error("Document is empty");
    }
    if (xmlText.trim().startsWith('<!DOCTYPE html')) {
        throw new Error("Received HTML instead of XML, proxy or source may be down.");
    }
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    const errorNode = xmlDoc.querySelector("parsererror");
    if (errorNode) {
        throw new Error(`Failed to parse XML: ${errorNode.textContent}`);
    }
    return xmlDoc;
}

function getXUsername(xUrl: string): string | null {
    try {
        const url = new URL(xUrl);
        const pathParts = url.pathname.split('/').filter(p => p);
        return pathParts.length > 0 ? pathParts[0] : null;
    } catch (e) {
        return null;
    }
}

function getYouTubeHandle(youtubeUrl: string): string | null {
    try {
        const url = new URL(youtubeUrl);
        const pathParts = url.pathname.split('/').filter(p => p);
        if (pathParts.length > 0) {
            const lastPart = pathParts[pathParts.length - 1];
            return lastPart.replace('@', '');
        }
        return null;
    } catch (e) {
        return null;
    }
}

async function fetchXFeed(xUrl: string): Promise<SocialPost[]> {
    const username = getXUsername(xUrl);
    if (!username) return [];

    const targetUrl = `https://nitter.net/${username}/rss`;
    const proxiedUrl = `${CORS_PROXY_URL}${encodeURIComponent(targetUrl)}`;
    
    const doc = await parseXmlFromUrl(proxiedUrl);
    const authorName = doc.querySelector('channel > title')?.textContent?.split('/')[0].trim() || username;

    return Array.from(doc.querySelectorAll('item')).slice(0, 10).map(item => ({
        id: item.querySelector('guid')?.textContent || item.querySelector('link')?.textContent || '',
        platform: 'X',
        author: authorName,
        text: item.querySelector('title')?.textContent || '',
        htmlContent: item.querySelector('description')?.textContent || '',
        url: item.querySelector('link')?.textContent || '',
        published_at: new Date(item.querySelector('pubDate')?.textContent || 0).toISOString(),
    }));
}

async function fetchYouTubeFeed(youtubeUrl: string): Promise<SocialPost[]> {
    const handle = getYouTubeHandle(youtubeUrl);
    if (!handle) return [];

    const targetUrl = `https://www.youtube.com/feeds/videos.xml?user=${handle}`;
    const proxiedUrl = `${CORS_PROXY_URL}${encodeURIComponent(targetUrl)}`;

    const doc = await parseXmlFromUrl(proxiedUrl);
    
    return Array.from(doc.querySelectorAll('entry')).slice(0, 10).map(entry => {
        const videoId = entry.querySelector('videoId')?.textContent || '';
        return {
            id: videoId,
            platform: 'YouTube',
            author: entry.querySelector('author > name')?.textContent || '',
            text: entry.querySelector('title')?.textContent || '',
            url: `https://www.youtube.com/watch?v=${videoId}`,
            published_at: new Date(entry.querySelector('published')?.textContent || 0).toISOString(),
            thumbnailUrl: entry.querySelector('thumbnail')?.getAttribute('url') || '',
            htmlContent: entry.querySelector('description')?.textContent || ''
        };
    });
}

export async function fetchAllSocialMedia(links: SocialMediaLinks): Promise<SocialPost[]> {
    const promises: Promise<SocialPost[]>[] = [];

    if (links.x) {
        promises.push(fetchXFeed(links.x));
    }
    if (links.youtube) {
        promises.push(fetchYouTubeFeed(links.youtube));
    }

    const results = await Promise.allSettled(promises);
    
    const allPosts: SocialPost[] = [];
    results.forEach(result => {
        if (result.status === 'fulfilled' && Array.isArray(result.value)) {
            allPosts.push(...result.value);
        } else if (result.status === 'rejected') {
            console.error("Failed to fetch a social media feed:", result.reason);
        }
    });

    return allPosts;
}