/* FRAMA AUTO v0.1.6: red primero, sin HTML obsoleto en navegacion. */
const CACHE = "frama-auto-pwa-v3";
const BASE = new URL("./", self.location.href).pathname;
const CORE = [BASE+"manifest.webmanifest",BASE+"icons/app-192.svg",BASE+"icons/app-512.svg"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("frama-auto-pwa-") && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE) || url.pathname.startsWith(BASE+"api/")) return;
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(new Request(event.request, {cache:"no-store"}))
        .catch(() => caches.match(event.request))
        .then(response => response || Response.error())
    );
  } else if (CORE.includes(url.pathname)) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
  }
});
