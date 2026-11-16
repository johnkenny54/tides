import * as turf from "@turf/turf";
import { hdom } from "@htmltools/hdom";
import { NOAA } from "./noaa.js";
import { PageStation } from "./pageStation.js";

export class PageNearbyStationList {
  static async createPage() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      await this.#showNearbyStations(position.coords);
    });
  }

  /**
   * @param {import('./noaa.js').NOAAStationData} station
   * @param {number} dist
   * @param {HTMLElement} container
   */
  static #addStation(station, dist, container) {
    const outer = hdom.createElement("div", {}, container);
    const link = hdom.createLinkElement(
      "",
      station.getStationName(),
      {},
      outer,
    );
    hdom.addEventListener(link, "click", async (event) => {
      event.preventDefault();
      await PageStation.createPage(station.getId());
    });
    hdom.appendTextValue(outer, ` ${dist}km`);
  }

  /**
   * @param {GeolocationCoordinates} currentCoords
   */
  static async #showNearbyStations(currentCoords) {
    /** @type {import("@turf/turf").Coord} */
    const current = [currentCoords.longitude, currentCoords.latitude];
    const allStations = await NOAA.getStationList();

    /** @type {{dist:number,station:import('./noaa.js').NOAAStationData}[]} */
    const nearbyStations = [];
    for (const station of allStations) {
      const dist = turf.distance(current, [
        station.getLongitude(),
        station.getLatitude(),
      ]);
      if (dist <= 10) {
        nearbyStations.push({ dist: dist, station: station });
      }
    }

    nearbyStations.sort((a, b) => a.dist - b.dist);

    const main = hdom.removeChildren("main");
    const container = hdom.createElement("div", {}, main);
    for (const station of nearbyStations) {
      this.#addStation(station.station, station.dist, container);
    }
  }
}
