/**
 * @typedef {{request:Request}} FetchEvent
 */

addEventListener("install", () => {});

self.addEventListener("fetch", (e) => {
  const fe = /** @type {FetchEvent} */ (/** @type {unknown} */ (e));
  handleFetch(fe);
});

/**
 * @param {FetchEvent} e
 */
async function handleFetch(e) {
  if (e.request.url.startsWith("https://api")) {
    console.log(`fetching ${e.request.url}`);
    e.respondWith(
      new Response(
        JSON.stringify({
          count: 1,
          units: null,
          stations: [{ name: "xxx" }],
        }),
      ),
    );
    return;
  }
  e.respondWith(fetch(e.request));
  // return {
  //   count: 1,
  //   units: null,
  //   stations: [{ name: "xxx" }],
  // };
}
