const CACHE_NAME = "pychat-v2";

const PRECACHE_ASSETS = [
  "./",
  "./chat.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// --------------------
// INSTALL
// --------------------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// --------------------
// ACTIVATE
// --------------------
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// --------------------
// FETCH
// --------------------
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        const responseClone = networkResponse.clone();

        if (networkResponse.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }

        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
