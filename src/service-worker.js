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

// Cache external resources for offline use
registerRoute(
  ({ url }) => url.origin === 'https://jsonplaceholder.typicode.com',
  new StaleWhileRevalidate()
);

registerRoute(
  ({ url }) => url.origin === 'https://service-worker-keyur.vercel.app',
  new StaleWhileRevalidate()
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
