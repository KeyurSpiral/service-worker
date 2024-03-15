// sw.js

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

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/App.css',
        '/logo.svg',
        '/app.js',
        '/index.js',
        '/serviceWorkerRegistration.js',
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});
