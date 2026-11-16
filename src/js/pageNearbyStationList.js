import { hdom } from "@htmltools/hdom";
import { NOAA } from "./noaa.js";

export class PageNearbyStationList {
  static async createPage() {
    const stations = await NOAA.getStationList();

    const main = hdom.removeChildren("main");

    const container = hdom.createElement("div", {}, main);
    for (const station of stations) {
      this.addStation(station, container);
    }
  }

  /**
   * @param {import('./noaa.js').NOAAStationData} station
   * @param {HTMLElement} container
   */
  static addStation(station, container) {
    const outer = hdom.createElement("div", {}, container);
    hdom.setTextValue(outer, station.getStationName());
  }
}
