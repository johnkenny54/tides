import { DB, STORE_HILO, STORE_STATIONS } from "./db.js";

/**
 * @typedef {{
 * t: string,
 * v: number,
 * type: 'L'|'H'
 * }} HighLowDataForDate
 *
 * @typedef {{
 * t: string,
 * v: string,
 * type: 'L'|'H'
 * }} RawHighLowData
 *
 * @typedef {{
 * state:string,
 * type:string,
 * id:string,
 * name:string,
 * lat:number,
 * lng:number
 * }} RawStationData
 *
 * @callback FnStationFactory
 * @param {RawStationData} in
 * @returns {NOAAStationData}
 */

export class NOAA {
  /**
   * @param {string} stationId
   * @param {string} date
   * @returns {Promise<HighLowDataForDate[]>}
   */
  static async getHighLowData(stationId, date) {
    const db = await DB.getInstance();
    /** @type {Object<string,HighLowDataForDate[]>|undefined} */
    let stationData = await db.get(STORE_HILO, stationId);
    if (stationData !== undefined) {
      const dateData = stationData[date];
      if (dateData !== undefined) {
        return dateData;
      }
    }

    // Fill in data for the missing date and save to DB.
    const url = new URL(
      "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&interval=hilo&units=metric&time_zone=lst_ldt&datum=MLLW&format=json",
    );
    url.searchParams.set("station", stationId);
    url.searchParams.set("begin_date", date);
    url.searchParams.set("range", (30 * 24).toString());

    /** @type {{predictions:RawHighLowData[]}} */
    const rawData = await this.#getNoaaData(url);

    /** @type {Object<string,HighLowDataForDate[]>} */
    const newStationData = {};
    for (const hilo of rawData.predictions) {
      const dt = hilo.t.split(" ");
      const d = dt[0];
      let dateData = newStationData[d];
      if (dateData === undefined) {
        dateData = [];
        newStationData[d] = dateData;
      }
      dateData.push({ t: dt[1], v: parseFloat(hilo.v), type: hilo.type });
    }

    if (stationData === undefined) {
      stationData = newStationData;
    } else {
      for (const [k, v] of Object.entries(newStationData)) {
        stationData[k] = v;
      }
    }
    await db.put(STORE_HILO, stationId, stationData);

    return stationData[date];
  }

  /**
   * @param {string} id
   * @returns {Promise<NOAAStationData|undefined>}
   */
  static async getStationData(id) {
    const stations = await this.getStationList();
    return stations.find((station) => station.getId() === id);
  }

  /**
   * @returns {Promise<NOAAStationData[]>}
   */
  static async getStationList() {
    const db = await DB.getInstance();

    /** @type {FnStationFactory} */
    const fn = (e) => new NOAAStationData(e);
    const stationList = await db.getEntries(STORE_STATIONS, fn);
    if (stationList.length > 0) {
      console.log(stationList);
      return stationList;
    }

    // No stations found, initialize list.
    /** @type {{stations:RawStationData[]}} */
    const data = await this.#getNoaaData(
      new URL(
        "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions",
      ),
    );
    const rawStationData = data.stations;

    const stations = [];
    for (const station of rawStationData) {
      stations.push(new NOAAStationData(station));
      db.put(STORE_STATIONS, station.id, station);
    }
    return stations;
  }

  /**
   * @template T
   * @param {URL} url
   * @returns {Promise<T>}
   */
  static async #getNoaaData(url) {
    url.searchParams.set("application", "tidy");
    const resp = await fetch(url);
    return await resp.json();
  }
}

export class NOAAStationData {
  #stationData;

  /**
   * @param {RawStationData} rawStationData
   */
  constructor(rawStationData) {
    this.#stationData = rawStationData;
  }

  getId() {
    return this.#stationData.id;
  }

  getLatitude() {
    return this.#stationData.lat;
  }

  getLongitude() {
    return this.#stationData.lng;
  }

  getStationName() {
    return this.#stationData.name;
  }
}
