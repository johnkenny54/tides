import { PageNearbyStationList } from "./pageNearbyStationList.js";

/**
 * @typedef {{
 * name:string,
 * lat:number,
 * lng:number
 * }} StationData
 */

await navigator.serviceWorker.register("./sw.js", { type: "module" });

await PageNearbyStationList.createPage();
