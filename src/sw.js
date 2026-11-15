/**
 * @callback FnResponse
 * @param {Promise<Response>} response
 *
 * @typedef {{
 * request:Request,
 * respondWith:FnResponse
 * }} FetchEvent
 */

const cacheName = "tides-v1";

addEventListener("install", () => {});

self.addEventListener("fetch", (e) => {
  const fe = /** @type {FetchEvent} */ (/** @type {unknown} */ (e));
  handleFetch(fe);
});

/**
 * @param {FetchEvent} e
 */
async function handleFetch(e) {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const url = new URL(e.request.url);
      if (url.protocol === "http:" || url.protocol === "https:") {
        const cache = await caches.open(cacheName);
        cache.put(e.request, response.clone());
      }
      return response;
    })(),
  );
}
