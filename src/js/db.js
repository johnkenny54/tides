import { VERSION } from "./version.js";

export const STORE_HILO = "hilo";
export const STORE_STATIONS = "stations";

export class DB {
  /** @type {DB|undefined} */
  static #instance;

  #db;

  /**
   * @param {IDBDatabase} db
   */
  constructor(db) {
    this.#db = db;
  }

  /**
   * @template T
   * @param {string} store
   * @param {string} key
   * @returns {Promise<T|undefined>}
   */
  async get(store, key) {
    const transaction = this.#db.transaction(store);
    const objectStore = transaction.objectStore(store);
    return new Promise((resolve, reject) => {
      const request = objectStore.get(key);
      request.onerror = (event) => {
        reject(event);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  /**
   * @template T
   * @param {string} store
   * @param {function(any):T} fn
   * @returns {Promise<T[]>}
   */
  async getEntries(store, fn) {
    const transaction = this.#db.transaction(store);
    const objectStore = transaction.objectStore(store);
    return new Promise((resolve, reject) => {
      const request = objectStore.getAll();
      request.onerror = (event) => {
        reject(event);
      };
      request.onsuccess = () => {
        resolve(request.result.map((e) => fn(e)));
      };
    });
  }

  /**
   * @returns {Promise<DB>}
   */
  static async getInstance() {
    if (this.#instance === undefined) {
      const idb = await this.#init();
      this.#instance = new DB(idb);
    }
    return this.#instance;
  }

  /**
   * @param {string} store
   * @param {string} key
   * @param {*} data
   */
  async put(store, key, data) {
    const transaction = this.#db.transaction(store, "readwrite");
    const objectStore = transaction.objectStore(store);
    return new Promise((resolve, reject) => {
      const request = objectStore.put(data, key);
      request.onerror = (event) => {
        reject(event);
      };
      request.onsuccess = (event) => {
        resolve(event);
      };
    });
  }

  static async #init() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open("tides", VERSION);
      request.onerror = (event) => {
        console.error(event);
        reject(event);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onupgradeneeded = () => {
        for (const store of [STORE_HILO, STORE_STATIONS]) {
          try {
            request.result.deleteObjectStore(store);
          } catch (error) {
            if (
              !(error instanceof DOMException) ||
              error.name !== "NotFoundError"
            ) {
              throw error;
            }
          }
          request.result.createObjectStore(store);
        }
      };
    });
  }
}
