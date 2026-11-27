import { hdom } from "@htmltools/hdom";
import { PageNearbyStationList } from "./pageNearbyStationList.js";

/**
 * @typedef {{
 * name:string,
 * lat:number,
 * lng:number
 * }} StationData
 */

await navigator.serviceWorker.register("./sw.js", { type: "module" });

hdom.addEventListener(
  "menu-link-home",
  "click",
  async () => await PageNearbyStationList.createPage(),
);

await PageNearbyStationList.createPage();
