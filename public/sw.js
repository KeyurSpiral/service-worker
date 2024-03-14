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
        self.registration.showNotification('Synced Successfully', {
          body: 'Data synchronized successfully!',
          icon: '/logo192.png',
        });
      })
      .catch(function(error) {
        console.error('Background sync failed:', error);
      });
  }
  
  self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting());
  });
  
  self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
  });
  