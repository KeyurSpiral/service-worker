// src/sw.js

const CACHE_NAME = 'my-app-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        // Add more files to cache if needed
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-counter') {
    event.waitUntil(syncCounter());
  }
});

async function syncCounter() {
  // Fetch counter data from local storage
  const counterData = localStorage.getItem('counter');
  
  if (counterData) {
    // Send counter data to the server
    try {
      const response = await fetch('https://example.com/api/updateCounter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ counter: counterData }),
      });

      if (response.ok) {
        console.log('Background sync: Counter data synced!');
        // Clear counter data from local storage
        localStorage.removeItem('counter');
      } else {
        console.error('Failed to sync counter data:', response.statusText);
      }
    } catch (error) {
      console.error('Error syncing counter data:', error);
    }
  } else {
    console.log('No counter data to sync.');
  }
}
