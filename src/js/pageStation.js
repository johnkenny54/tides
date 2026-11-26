import { hdom } from "@htmltools/hdom";
import { NOAA } from "./noaa.js";
import { Settings } from "./settings.js";
import { Units } from "./units.js";

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

    const eStation = hdom.createElement("div", { id: "station" }, main);

    const h1 = hdom.createElement("h1", "centered", eStation);
    hdom.setTextValue(h1, station.getStationName());

    const div = hdom.createElement("div", "centered", eStation);
    const ll = `${+station.getLatitude().toFixed(4)},${+station.getLongitude().toFixed(4)}`;
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

    const date = Temporal.Now.zonedDateTimeISO();
    const dateString = date.toPlainDate().toString();
    hdom.createTextElement("p", "centered", dateString, eStation);

    const divTides = hdom.createElement(
      "div",
      { id: "hilo", class: "centered grid" },
      eStation,
    );

    const ms = Settings.getMeasurementSystem();
    const heightUnits = ms === "US" ? "ft" : "m";

    const data = await NOAA.getHighLowData(id, dateString);
    for (const hl of data) {
      const t = Temporal.PlainTime.from(hl.t);
      const eTime = hdom.createElement("div", "time", divTides);
      hdom.createTextElement(
        "div",
        {},
        t.toLocaleString(undefined, { timeStyle: "short" }),
        eTime,
      );

      const eHeight = hdom.createElement("div", "height", divTides);
      hdom.setElementText(
        eHeight,
        Units.getDisplayString(
          Units.convert(hl.v, "m", heightUnits),
          heightUnits,
          2,
        ),
      );
    }
  }
}
