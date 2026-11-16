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

await navigator.serviceWorker.register(sw);

await PageNearbyStationList.createPage();

/**
 * @template T
 * @returns {Promise<T>}
 */
async function getNoaaData() {
  const resp = await fetch(
    "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/9414290.json",
  );
  const json = await resp.json();
  return json.stations[0];
}
