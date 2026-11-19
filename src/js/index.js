// @ts-ignore
// Set path relative to root.
import sw from "../sw.js?url&no-inline";
import { PageNearbyStationList } from "./pageNearbyStationList.js";

/**
 * @typedef {{
 * name:string,
 * lat:number,
 * lng:number
 * }} StationData
 */

await navigator.serviceWorker.register(sw, { type: "module" });

await PageNearbyStationList.createPage();
