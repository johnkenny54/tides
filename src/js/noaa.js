import { DBCache } from "./dbCache.js";

/**
 * @typedef {{
 * state:string,
 * type:string,
 * id:string,
 * name:string,
 * lat:number,
 * lng:number
 * }} RawStationData
 */

export class NOAA {
  /**
   *
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
    const cache = await DBCache.getInstance();
    /** @type {RawStationData[]|undefined} */
    let rawStationData = await cache.get("stations");
    if (rawStationData === undefined) {
      /** @type {{stations:RawStationData[]}} */
      const data = await this.#getNoaaData(
        "stations.json?type=tidepredictions",
      );
      rawStationData = data.stations;
      await cache.put("stations", rawStationData);
    }
    const stations = [];
    for (const station of rawStationData) {
      stations.push(new NOAAStationData(station));
    }
    return stations;
  }

  /**
   * @template T
   * @param {string} url
   * @returns {Promise<T>}
   */
  static async #getNoaaData(url) {
    const resp = await fetch(
      `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/${url}`,
    );
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
