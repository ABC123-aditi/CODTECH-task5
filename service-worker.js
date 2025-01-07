const CACHE_NAME = 'ecommerce-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/images/product1.jpg', // Example product image
  '/images/product2.jpg', // Example product image
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cacheResponse => {
        return cacheResponse || fetch(event.request);
      })
  );
});
self.addEventListener('push', event => {
    const title = event.data ? event.data.text() : 'New Notification';
    const options = {
      body: 'You have a new notification.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png'
    };
  
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
  self.addEventListener('fetch', event => {
    if (event.request.url.includes('/api/products')) {
      event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
          return fetch(event.request).then(response => {
            cache.put(event.request, response.clone());
            return response;
          }).catch(() => {
            return cache.match(event.request);
          });
        })
      );
    } else {
      event.respondWith(
        caches.match(event.request)
          .then(cacheResponse => cacheResponse || fetch(event.request))
      );
    }
  });
    