// @ts-ignore
// Set path relative to root.
import sw from "../sw.js?url&no-inline";
import { hdom } from "@htmltools/hdom";

/**
 * @typedef {{
 * name:string,
 * lat:number,
 * lng:number
 * }} StationData
 */

await navigator.serviceWorker.register(sw);

// const resp = await fetch(
//   "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=20250801&end_date=20250831&station=9414816&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&format=json",
// );
// console.log(await resp.json());

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
