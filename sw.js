const CACHE_NAME = "juegodepeones-v14";  // ← sube el número cada vez que hagas cambios

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./script.js",
    "./style.css",
    "./sw.js"
];

self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Solo cacheamos respuestas válidas
                if (!response || response.status !== 200 || response.type !== "basic") {
                    return response;
                }
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Si no hay red, servimos de la caché
                return caches.match(event.request);
            })
    );
});
