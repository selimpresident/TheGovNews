const CACHE_PREFIX = 'govnews-cache-';

export function getFromCache<T>(key: string): T | null {
    if (typeof sessionStorage === 'undefined') {
        return null;
    }
    try {
        const cachedItem = sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
        if (cachedItem) {
            const parsed = JSON.parse(cachedItem);
            // In the future, expiry logic could be added here.
            // if (parsed.expiry && parsed.expiry < Date.now()) {
            //     sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
            //     return null;
            // }
            return parsed.data as T;
        }
    } catch (error) {
        console.error("Error reading from sessionStorage:", error);
    }
    return null;
}

export function setInCache<T>(key: string, data: T): void {
    if (typeof sessionStorage === 'undefined') {
        return;
    }
    try {
        const itemToCache = {
            data: data,
            // timestamp: Date.now() // Could be useful for future expiry logic
        };
        sessionStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(itemToCache));
    } catch (error) {
        console.error("Error writing to sessionStorage:", error);
        // This could be due to storage being full. A clean-up strategy could be implemented.
    }
}
