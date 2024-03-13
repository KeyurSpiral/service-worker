/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

const bgSyncQueueName = 'my-background-sync-queue';

precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }) => {
    if (request.mode !== 'navigate') {
      return false;
    }

    if (url.pathname.startsWith('/_')) {
      return false;
    }

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const bgSyncPlugin = new BackgroundSyncPlugin(bgSyncQueueName, {
  maxRetentionTime: 24 * 60 // Retry for up to 24 hours
});

const bgSyncRoute = new RegExp(''); // Add your route here

self.addEventListener('fetch', (event : any) => {
  if (event.request.method === 'POST' && bgSyncRoute.test(event.request.url)) {
    const bgSync = new Promise((resolve, reject) => {
      const bgSyncRequest = new Request(event.request.url, {
        method: 'POST',
        headers: event.request.headers,
        body: event.request.body
      });

      const failureCallback = () => reject('Background sync failed');
      const successCallback = () => resolve('Background sync successful');

      fetch(bgSyncRequest).then(successCallback, failureCallback);
    });

    event.respondWith(bgSync);
  }
});
