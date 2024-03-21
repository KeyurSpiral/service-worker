/* eslint-disable */
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { BackgroundSyncPlugin } from "workbox-background-sync"; // Import BackgroundSyncPlugin

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
const bgSyncPlugin = new BackgroundSyncPlugin("myQueueName", {
  maxRetentionTime: 24 * 60, // Retry for max of 24 hours (in minutes)
});

registerRoute(
  "https://jsonplaceholder.typicode.com/posts/1", // Adjust the URL as per your needs
  new NetworkFirst({
    plugins: [bgSyncPlugin],
  }),
  "POST" // Specify the HTTP method you want to retry
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// handle location access
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data === "getLocation") {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({ type: "location", latitude, longitude });
            });
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported");
    }
  }
});

// handle push notification
self.addEventListener("push", function (event) {
  const options = {
    body: event.data.text(),
    icon: "/public/logo192.png",
    badge: "/public/logo192.png",
  };

  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});

const VERSION = process.env.REACT_APP_VERSION;

// Check for updates
setInterval(() => {
  fetch("/version.json") // Fetch the version file
    .then((response) => response.json())
    .then((data) => {
      if (data.version !== VERSION) {
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "NEW_VERSION_AVAILABLE",
              version: data.version,
            });
          });
        });
        console.log("New version available!");
      }
    })
    .catch((error) => {
      console.error("Error checking for updates:", error);
    });
}, 60000);

// Listen for skip waiting message from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
}); // Check for updates every hour(60 * 60 * 1000)
