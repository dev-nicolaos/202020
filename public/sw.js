const STATIC_CACHE_NAME = "202020-cache-v2";

const STATIC_ASSET_ROUTES = [
  "/",
  "/dist/main.css",
  "/dist/main.js",
  "/favicon.ico",
  "/index.html",
  "/global.css",
  "/icons/apple-touch-icon.png",
  "/icons/favicon-16x16.png",
  "/icons/favicon-32x32.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/maskable-icon-192x192.webp",
  "/icons/maskable-icon-512x512.webp",
  "/icons/safari-pinned-tab.svg",
  "/manifest.webmanifest",
  "/support.css",
];

const cacheStaticAssets = async () =>
  (await caches.open(STATIC_CACHE_NAME)).addAll(STATIC_ASSET_ROUTES);

/**
 * Comment out DURING DEVELOPMENT ONLY,
 * as caching can mess with hot reloading.
 */
self.addEventListener("install", (event) => {
  event.waitUntil(cacheStaticAssets());
});

const deleteOldCaches = async () =>
  Promise.all(
    (await caches.keys()).reduce(
      (acc, key) =>
        key === STATIC_CACHE_NAME ? acc : acc.concat(caches.delete(key)),
      [],
    ),
  );

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});

const timerIDs = {};

const scheduleFutureNotification = (delay, clientId) => {
  timerIDs[clientId] = setTimeout(() => {
    if (Notification.permission === "granted") {
      const notificationTitle = "It's been 20 minutes, give your eyes a break!";
      const notificationOptions = {
        body: "Look at something 20 feet away for 20 seconds to let your eyes relax",
        icon: "/icons/icon-192x192.png",
        data: { clientId },
      };

      try {
        /**
         * This throws an error on Android Chrome,
         * but Safari doesn't support registration.showNotification,
         * and Firefox only has partial support for registration.showNotification,
         * so prefer the constructor approach and fallback to registration.showNotification.
         */
        new Notification(notificationTitle, notificationOptions);
      } catch (err) {
        self.registration.showNotification(
          notificationTitle,
          notificationOptions,
        );
      }
    }
  }, delay);
};

const cancelFutureNotification = (clientId) => {
  clearTimeout(timerIDs[clientId]);
};

const handleRequest = async (req) => (await caches.match(req)) || fetch(req);

self.addEventListener("fetch", async (event) => {
  if (event.request.method === "POST") {
    event.respondWith(Promise.resolve(new Response(null, { status: 202 })));
    scheduleFutureNotification(await event.request.json(), event.clientId);
  } else if (event.request.method === "DELETE") {
    event.respondWith(Promise.resolve(new Response(null, { status: 202 })));
    cancelFutureNotification(event.clientId);
  } else {
    event.respondWith(handleRequest(event.request));
  }
});

const handleNotificationClick = async (event) => {
  try {
    // Not currently supported in Android Chrome
    event.Notification.close();
  } catch { /* swallow error */ }

  const controlledClients = await self.clients.matchAll();

  if (controlledClients.length === 0) {
    // There are no open clients, open a new one
    return self.clients.openWindow(self.location.origin);
  }

  /**
   * Target the client that triggered the notification if it's still around,
   * or the most recently focused one if not.
   */
  const targetClient = controlledClients.find((client) =>
    client.id === event.notification.data.clientId
  ) || controlledClients[0];

  if (targetClient && targetClient.focus) return targetClient.focus();

  // There are controlled clients, but the browser doesn't support focusing them
};

self.addEventListener("notificationclick", (event) => {
  event.waitUntil(handleNotificationClick(event));
});
