import { hdom } from "@htmltools/hdom";
import { NOAA } from "./noaa.js";
import { Settings } from "./settings.js";
import { Units } from "./units.js";
import { DateUtils } from "./dateUtils.js";

export class PageStation {
  /**
   * @param {string} stationId
   */
  static async createPage(stationId) {
    const main = hdom.removeChildren("main");

    const station = await NOAA.getStationData(stationId);
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

    hdom.createElement("div", { id: "date-specific" }, eStation);
    const dateString = DateUtils.getCurrentDateString();

    await this.#showDateInfo(stationId, dateString);
  }

  /**
   * @param {string} stationId
   * @param {string} dateString
   * @param {-1|1} increment
   */
  static async #handleDateIncrement(stationId, dateString, increment) {
    const dNew = DateUtils.incrementDateString(dateString, increment);
    await this.#showDateInfo(stationId, dNew);
  }

  /**
   * @param {string} stationId
   * @param {string} dateString
   */
  static async #showDateInfo(stationId, dateString) {
    const eDateSpecific = hdom.removeChildren("date-specific");

    const eDate = hdom.createElement(
      "div",
      { id: "date", class: "centered" },
      eDateSpecific,
    );
    const ePrevDate = hdom.createTextElement("button", {}, "<", eDate);
    hdom.addEventListener(
      ePrevDate,
      "click",
      async () => await this.#handleDateIncrement(stationId, dateString, -1),
    );
    hdom.createTextElement("div", "centered", dateString, eDate);
    const eNextDate = hdom.createTextElement("button", {}, ">", eDate);
    hdom.addEventListener(
      eNextDate,
      "click",
      async () => await this.#handleDateIncrement(stationId, dateString, 1),
    );

    const divTides = hdom.createElement(
      "div",
      { id: "hilo", class: "centered grid" },
      eDateSpecific,
    );

    const ms = Settings.getMeasurementSystem();
    const heightUnits = ms === "US" ? "ft" : "m";

    const data = await NOAA.getHighLowData(stationId, dateString);
    for (const hl of data) {
      const t = Temporal.PlainTime.from(hl.t);
      hdom.createTextElement(
        "div",
        {},
        t.toLocaleString(undefined, { timeStyle: "short" }),
        divTides,
      );

      const eHeight = hdom.createElement("div", undefined, divTides);
      hdom.setElementText(
        eHeight,
        Units.getDisplayString(
          Units.convert(hl.v, "m", heightUnits),
          heightUnits,
          2,
        ),
      );

      hdom.createTextElement("div", {}, hl.type, divTides);
    }
  }
}
