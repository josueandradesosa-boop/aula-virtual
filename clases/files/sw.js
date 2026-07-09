const CACHE_NAME = 'aula-virtual-v2';
const ASSETS_TO_CACHE = [
  '/index.html',
  '/estudiante.html',
  '/profesor.html',
  '/style.css',
  '/manifest.json'
];

// Instalación: cachear archivos básicos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activación: limpiar caches viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// Fetch: responder con cache si existe, si no ir a la red.
// (No interceptamos llamadas a Firebase, solo el "cascarón" de la app)
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('firestore') || event.request.url.includes('googleapis')) {
    return; // dejar pasar directo a la red
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
