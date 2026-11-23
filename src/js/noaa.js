/**
 * @typedef {{
 * t: string,
 * v: string,
 * type: 'L'|'H'
 * }} HighLowData
 *
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
   * @param {string} stationId
   * @param {string} date
   * @returns {Promise<{predictions:HighLowData[]}>}
   */
  static async getHighLowData(stationId, date) {
    const url = new URL(
      "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&interval=hilo&units=metric&time_zone=lst_ldt&datum=MLLW&application=tidy&format=json",
    );
    url.searchParams.set("station", stationId);
    url.searchParams.set("begin_date", date);
    url.searchParams.set("end_date", date);
    return await this.#getNoaaData(url.toString());
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
    /** @type {{stations:RawStationData[]}} */
    const data = await this.#getNoaaData(
      "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions",
    );
    const rawStationData = data.stations;

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
