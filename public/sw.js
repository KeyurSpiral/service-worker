self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('myCache').then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
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

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('myCache').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/logo.svg',
        '/App.css',
        '/App.js',
        '/index.js',
        '/serviceWorkerRegistration.js',
        '/reportWebVitals.js'
        // Add other assets you want to cache for offline use
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});
