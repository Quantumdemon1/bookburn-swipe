// Service Worker for Book Burn application
const CACHE_NAME = 'book-burn-cache-v1';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/favicon.ico',
  '/og-image.svg',
  '/placeholder.svg'
];

const API_CACHE_CONFIG = {
  '/rest/v1/books': {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    strategy: 'stale-while-revalidate'
  },
  '/rest/v1/reviews': {
    maxAge: 15 * 60 * 1000, // 15 minutes
    strategy: 'network-first'
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
      fetch(OFFLINE_URL).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.put(OFFLINE_URL, response);
        });
      })
    ])
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('book-burn-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

async function handleApiRequest(request, url) {
  const cacheConfig = Object.entries(API_CACHE_CONFIG)
    .find(([pattern]) => url.pathname.includes(pattern))?.[1];

  if (!cacheConfig) {
    return fetch(request);
  }

  const cache = await caches.open(CACHE_NAME);
  
  if (cacheConfig.strategy === 'stale-while-revalidate') {
    const cachedResponse = await cache.match(request);
    const networkPromise = fetch(request).then(async (response) => {
      await cache.put(request, response.clone());
      return response;
    });

    return cachedResponse || networkPromise;
  }

  if (cacheConfig.strategy === 'network-first') {
    try {
      const response = await fetch(request);
      await cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  }

  return fetch(request);
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle API requests
  if (url.hostname === 'rdzcrmdivwreoiwgecxk.supabase.co') {
    event.respondWith(handleApiRequest(event.request, url));
    return;
  }

  // Handle static assets
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});