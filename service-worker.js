var cacheName = "recistaurant-v3";
var appShellFiles = [
    '/',
    '/css/styles-medium.css',
    '/css/styles-small.css',
    '/styles.css',
    'js/main.js'
];
var contentToCache = [];
contentToCache.concat(appShellFiles);

self.addEventListener('install', function (event) {
    console.log('[Service Worker] Install');
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(contentToCache);
        })
    );
});

self.addEventListener('fetch', function(e) {
    console.log("REQUEST ",e.request);
    e.respondWith(
        caches.match(e.request).then(function(r) {
              console.log('[Service Worker] Fetching resource: '+e.request.url);
          return r || fetch(e.request).then(function(response) {
                    return caches.open(cacheName).then(function(cache) {
              console.log('[Service Worker] Caching new resource: '+e.request.url);
              cache.put(e.request, response.clone());
              return response;
            });
          });
        })
      );
});