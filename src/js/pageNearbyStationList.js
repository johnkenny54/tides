import * as turf from "@turf/turf";
import { hdom } from "@htmltools/hdom";
import { NOAA } from "./noaa.js";
import { PageStation } from "./pageStation.js";
import { Settings } from "./settings.js";
import { Units } from "./units.js";

export class PageNearbyStationList {
  static async createPage() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      await this.#showNearbyStations(position.coords);
    });
  }

  // INTERNAL METHODS

  /**
   * @param {import('./noaa.js').NOAAStationData} station
   * @param {number} dist
   * @param {import("./units.js").UnitType} units
   * @param {HTMLElement} container
   */
  static #addStation(station, dist, units, container) {
    const link = hdom.createLinkElement(
      "",
      station.getStationName(),
      {},
      container,
    );
    hdom.addEventListener(link, "click", async (event) => {
      event.preventDefault();
      await PageStation.createPage(station.getId());
    });

    hdom.createTextElement(
      "div",
      {},
      Units.getDisplayString(Units.convert(dist, "km", units), units, 2),
      container,
    );
  }
  /**
   * @param {GeolocationCoordinates} currentCoords
   */
  static async #showNearbyStations(currentCoords) {
    /** @type {import("@turf/turf").Coord} */
    const current = [currentCoords.longitude, currentCoords.latitude];
    const allStations = await NOAA.getStationList();

    const ms = Settings.getMeasurementSystem();
    const distUnits = ms === "US" ? "mi" : "km";
    const distance = ms === "US" ? 6 : 10;

    /** @type {{dist:number,station:import('./noaa.js').NOAAStationData}[]} */
    const nearbyStations = [];
    for (const station of allStations) {
      const dist = turf.distance(current, [
        station.getLongitude(),
        station.getLatitude(),
      ]);
      if (dist <= Units.convert(distance, distUnits, "km")) {
        nearbyStations.push({ dist: dist, station: station });
      }
    }

    nearbyStations.sort((a, b) => a.dist - b.dist);

    const main = hdom.removeChildren("main");

    hdom.createTextElement(
      "h1",
      "centered",
      `Stations within ${Units.getDisplayString(distance, distUnits, 0)}`,
      main,
    );

    const container = hdom.createElement(
      "div",
      { id: "stations", class: "centered grid" },
      main,
    );
    for (const station of nearbyStations) {
      this.#addStation(station.station, station.dist, distUnits, container);
    }
  }
}
