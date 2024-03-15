const CACHE_NAME = 'counter-app-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/js/0.chunk.js',
  '/static/js/main.chunk.js',
  '/logo.svg',
  'https://jsonplaceholder.typicode.com/posts/1'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('sync', function(event) {
  if (event.tag === 'syncCount') {
    event.waitUntil(syncCount());
  }
});

function syncCount() {
  return fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    })
    .then(function(data) {
      localStorage.setItem('count', data.id);
    })
    .catch(function(error) {
      console.error('Background sync failed:', error);
    });
}
