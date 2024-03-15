/* eslint-disable */
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { BackgroundSyncPlugin } from 'workbox-background-sync'; // Import BackgroundSyncPlugin

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(({ request, url }) => {
  if (request.mode !== "navigate") {
    return false;
  }

  if (url.pathname.startsWith("/_")) {
    return false;
  }

  if (url.pathname.match(fileExtensionRegexp)) {
    return false;
  }

  return true;
}, createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html"));

registerRoute(
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.endsWith(".png"),
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  })
);

// Register background sync for the desired route
const bgSyncPlugin = new BackgroundSyncPlugin('myQueueName', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 hours (in minutes)
});
registerRoute(
  'https://jsonplaceholder.typicode.com/posts/1', // Adjust the URL as per your needs
  new StaleWhileRevalidate({
    plugins: [bgSyncPlugin],
  }),
  'POST' // Specify the HTTP method you want to retry
);

// Catch errors when fetching external resources and respond with a custom offline response
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => new Response(null, { status: 503 }))
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});