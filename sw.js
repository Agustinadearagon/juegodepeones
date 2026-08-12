// sw.js - versión forzada
const CACHE_NAME = "juegodepeones-v10";   // ← número alto para forzar actualización

const archivos = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./sw.js"
];

self.addEventListener("install", (evento) => {
    self.skipWaiting(); // activa inmediatamente
    evento.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(archivos))
    );
});

self.addEventListener("activate", (evento) => {
    evento.waitUntil(
        caches.keys().then((nombres) => {
            return Promise.all(
                nombres.map((nombre) => {
                    if (nombre !== CACHE_NAME) {
                        console.log("Borrando caché antigua:", nombre);
                        return caches.delete(nombre);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (evento) => {
    evento.respondWith(
        caches.match(evento.request).then((respuesta) => {
            return respuesta || fetch(evento.request);
        })
    );
});
