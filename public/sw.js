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
      saveCountToIndexedDB(data.id);
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

function saveCountToIndexedDB(count) {
  if (!('indexedDB' in self)) {
    console.log('IndexedDB is not supported in this browser.');
    return;
  }

  const request = self.indexedDB.open('countDB', 1);

  request.onerror = function(event) {
    console.error('IndexedDB error:', event.target.error);
  };

  request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(['countStore'], 'readwrite');
    const objectStore = transaction.objectStore('countStore');
    objectStore.put(count, 1);
  };

  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore('countStore', { keyPath: 'id' });
    objectStore.add(count, 1);
  };
}
