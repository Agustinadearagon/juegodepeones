// sw.js
const CACHE_NAME = "juegodepeones-v2";  // Cambia el número cada vez que hagas cambios importantes

const archivos = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js"
];

// Instalar y guardar en caché
self.addEventListener("install", (evento) => {
    evento.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(archivos);
        })
    );
    self.skipWaiting(); // Activa la nueva versión inmediatamente
});

// Activar y borrar cachés antiguas
self.addEventListener("activate", (evento) => {
    evento.waitUntil(
        caches.keys().then((nombres) => {
            return Promise.all(
                nombres.map((nombre) => {
                    if (nombre !== CACHE_NAME) {
                        return caches.delete(nombre);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Interceptar peticiones
self.addEventListener("fetch", (evento) => {
    evento.respondWith(
        caches.match(evento.request).then((respuesta) => {
            return respuesta || fetch(evento.request);
        })
    );
});
