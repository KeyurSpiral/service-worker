// sw.js

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
