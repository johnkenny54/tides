// @ts-ignore
// Set path relative to root.
import sw from "../sw.js?url&no-inline";
import { hdom } from "@htmltools/hdom";
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

async function pageStation() {
  /** @type {StationData} */
  const stationData = await getNoaaData();

  const main = hdom.removeChildren("main");
  const h1 = hdom.createElement("h1", {}, main);
  hdom.setTextValue(h1, stationData.name);

  const div = hdom.createElement("div", {}, main);
  const ll = `${stationData.lat},${stationData.lng}`;
  // @see https://developers.google.com/maps/documentation/urls/get-started
  div.appendChild(
    hdom.createLinkElement(
      `https://www.google.com/maps/search/?api=1&query=${ll}`,
      ll,
      {
        target: "_blank",
      },
    ),
  );
}

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
