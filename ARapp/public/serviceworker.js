let staticCacheName = 'main-cache';
let filesToCache = [
    'favicon/128x128.png',
    'favicon/144x144.png',
    'favicon/152x152.png',
    'favicon/192x192.png',
    'favicon/512x512.png',
    'favicon/favicon.ico',
    'img/VenueARLogo.png',
    '/',
    '/index.html',
    '/ar.html',
    'css/main.css',
    'css/normalize.css',
    'js/bundle.js',
];

self.addEventListener('install', function(event) {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
        caches.open(staticCacheName)
            .then(function(cache) {
                return cache.addAll(filesToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
            .catch(function (err) {
                console.log("Cache Fetch Error: " + err);
            })
    );
});


self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName.startsWith('main-cache') && staticCacheName !== cacheName) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});


/*
var CACHE_NAME = 'main-cache';
var CACHED_URLS = [
    '/ar',
    '/login'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    }).catch(function(err) {
      // registration failed :(
      console.log('install failed: ', err);
    }));
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        } else if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match(event.request);
        }
      }).catch(function(err) {
      // registration failed :(
      console.log('Cache fetch failed: ', err);
    });
    })
  );
});*/
