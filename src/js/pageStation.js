import { hdom } from "@htmltools/hdom";
import { NOAA } from "./noaa.js";

export class PageStation {
  /**
   * @param {string} id
   */
  static async createPage(id) {
    const main = hdom.removeChildren("main");

    const station = await NOAA.getStationData(id);
    if (station === undefined) {
      throw new Error();
    }

    const h1 = hdom.createElement("h1", {}, main);
    hdom.setTextValue(h1, station.getStationName());

    const div = hdom.createElement("div", {}, main);
    const ll = `${station.getLatitude()},${station.getLongitude()}`;
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
}
