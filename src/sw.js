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
  console.log(`fetching ${e.request.url}`);
  return {
    count: 1,
    units: null,
    stations: [{ name: "xxx" }],
  };
}
