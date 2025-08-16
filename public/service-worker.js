// Service Worker with Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.setConfig({ debug: false });

workbox.core.setCacheNameDetails({
  prefix: 'govnews',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime',
});

// Precache static assets
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        maxEntries: 30,
      }),
    ],
  })
);

// Cache API responses
workbox.routing.registerRoute(
  /\/api\/v1\/articles/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-articles',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24, // 24 hours
      }),
    ],
  })
);

// Cache map tiles with a stale-while-revalidate strategy
workbox.routing.registerRoute(
  /^https:\/\/cdn\.jsdelivr\.net\/npm\/world-atlas/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'map-tiles',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      }),
    ],
  })
);

// Cache static assets
workbox.routing.registerRoute(
  /\.(?:js|css|png|jpg|jpeg|svg|gif)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// Offline fallback
workbox.routing.setCatchHandler(({ event }) => {
  if (event.request.destination === 'document') {
    return workbox.precaching.matchPrecache('/offline.html');
  }
  
  return Response.error();
});

// Handle background sync for failed requests
workbox.routing.registerRoute(
  /\/api\/v1\/(articles|comments|bookmarks)/,
  async ({ url, event, params }) => {
    const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('apiQueue', {
      maxRetentionTime: 24 * 60, // Retry for up to 24 hours (specified in minutes)
    });
    
    try {
      const response = await fetch(event.request.clone());
      return response;
    } catch (error) {
      await bgSyncPlugin.queueRequest(event.request);
      return new Response('This request has been queued for retry when online', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  },
  'POST'
);

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Skip waiting and claim clients
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});