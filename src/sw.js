// src/sw.js

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.3.0/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { NetworkOnly } = workbox.strategies;
const { Queue } = workbox.backgroundSync;

const queue = new Queue('counterQueue');

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/increment') || event.request.url.includes('/decrement')) {
    const bgSync = new NetworkOnly({ plugins: [{ fetchDidFail: async ({ request }) => { await queue.addRequest(request); } }] });
    event.respondWith(bgSync.handle({ request: event.request }));
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(queue.replayRequests());
  }
});

registerRoute(
  ({ url }) => url.pathname.startsWith('/posts'),
  new NetworkOnly()
);
