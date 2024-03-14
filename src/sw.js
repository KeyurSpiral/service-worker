// sw.js

self.addEventListener('install', function(event) {
  console.log('Service Worker installed');
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activated');
});

self.addEventListener('sync', function(event) {
  if (event.tag === 'syncCount') {
    event.waitUntil(syncCount());
  }
});

function syncCount() {
  return fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      return self.registration.showNotification('Synced Successfully', {
        body: 'New count: ' + data.id
      });
    })
    .catch(function(err) {
      console.error('Error syncing count:', err);
    });
}
