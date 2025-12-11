const CACHE_NAME = 'mini-agenda-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Instalar: cachear archivos básicos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activar: limpiar caches viejos si cambias el nombre de CACHE_NAME
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

// Fetch: servir desde cache (offline support)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      // Si está en cache lo regresa, si no, va a la red
      return resp || fetch(event.request);
    })
  );
});
