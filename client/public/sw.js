const CACHE_NAME = 'egoos-cache-v1';
const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/opengraph.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key === CACHE_NAME ? Promise.resolve() : caches.delete(key))))
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Only handle navigation and GET requests
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      // put a copy in cache for future
      const copy = res.clone();
      caches.open(CACHE_NAME).then((c) => c.put(req, copy));
      return res;
    })).catch(() => caches.match('/index.html')),
  );
});
