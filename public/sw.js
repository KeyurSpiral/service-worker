// sw.js
self.addEventListener('install', event => {
  console.log('Service worker installed');
});

self.addEventListener('activate', event => {
  console.log('Service worker activated');
});

self.addEventListener('fetch', event => {
  console.log('Fetch intercepted for:', event.request.url);
});

self.addEventListener('sync', event => {
  if (event.tag === 'syncCount') {
    event.waitUntil(syncCount());
  }
});

async function syncCount() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const data = await response.json();
  localStorage.setItem('count', data.id);
  console.log('Background sync complete');
}
