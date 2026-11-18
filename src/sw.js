/**
 * @callback FnResponse
 * @param {Promise<Response>} response
 *
 * @typedef {{
 * request:Request,
 * respondWith:FnResponse
 * }} FetchEvent
 */

const VERSION = 3;
const cacheName = `tides-${VERSION}`;

addEventListener("install", () => {
  console.log(`install ${VERSION}`);
});

addEventListener("activate", (event) => {
  console.log(`activate ${VERSION}`);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
});

self.addEventListener("fetch", (e) => {
  const fe = /** @type {FetchEvent} */ (/** @type {unknown} */ (e));
  handleFetch(fe);
});

/**
 * @param {FetchEvent} e
 */
async function handleFetch(e) {
  const url = new URL(e.request.url);
  if (
    url.hostname === "localhost" ||
    url.hostname !== location.hostname ||
    url.port !== location.port
  ) {
    return;
  }
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      cache.put(e.request, response.clone());
      return response;
    })(),
  );
}
