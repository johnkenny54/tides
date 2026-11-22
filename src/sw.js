/**
 * @callback FnResponse
 * @param {Promise<Response|undefined>} response
 *
 * @callback FnWait
 * @param {Promise<void>|Promise<(boolean|undefined)[]>} fn
 *
 * @typedef {{
 * waitUntil:FnWait
 * }} ExtendableEvent
 *
 * @typedef {{
 * request:Request,
 * respondWith:FnResponse
 * }} FetchEvent
 */

const VERSION = 5;
const CACHE_NAME = `tides-${VERSION}`;

self.addEventListener("install", (e) => {
  /** @type {ExtendableEvent} */ (/** @type {unknown} */ (e)).waitUntil(
    (async () => {
      console.log(`install ${VERSION}`);

      // Delete existing cache if present.
      await caches.delete(CACHE_NAME);

      // Add static resources in live version.
      const manifest = await fetch("../.vite/manifest.json");
      let json;
      try {
        json = await manifest.json();
      } catch {
        //
      }

      if (json) {
        /** @type {{file:string,css:string[]}} */
        const indexAssets = json["index.html"];
        const resources = ["index.html"]
          .concat(indexAssets.file)
          .concat(indexAssets.css);

        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(resources.map((r) => "../" + r));
      }
    })(),
  );
});

self.addEventListener("activate", async (e) => {
  console.log(`activate ${VERSION}`);
  const keys = await caches.keys();
  try {
    /** @type {ExtendableEvent} */ (/** @type {unknown} */ (e)).waitUntil(
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      ),
    );
  } catch {
    //
  }
});

self.addEventListener("fetch", (e) => {
  const fe = /** @type {FetchEvent} */ (/** @type {unknown} */ (e));
  console.log(fe);
  handleFetch(fe);
});

/**
 * @param {FetchEvent} e
 */
async function handleFetch(e) {
  const url = new URL(e.request.url);
  console.log(e.request.url);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return;
  }
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      if (r) {
        return r;
      }
      console.log("fetching " + e.request.url);
      const response = await fetch(e.request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(e.request, response.clone());
      return response;
    })(),
  );
}
