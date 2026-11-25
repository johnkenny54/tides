import { VERSION } from "./version.js";

export const STORE_HILO = "hilo";

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
   * @param {string} store
   */
  async clear(store) {
    const transaction = this.#db.transaction(store, "readwrite");
    const objectStore = transaction.objectStore(store);
    return new Promise((resolve, reject) => {
      const request = objectStore.clear();
      request.onerror = (event) => {
        reject(event);
      };
      request.onsuccess = (event) => {
        resolve(event);
      };
    });
  }

  /**
   * @param {string} store
   * @param {string} key
   */
  async delete(store, key) {
    const transaction = this.#db.transaction(store, "readwrite");
    const objectStore = transaction.objectStore(store);
    return new Promise((resolve, reject) => {
      const request = objectStore.delete(key);
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
   * @param {string} store
   */
  async getAllKeys(store) {
    const transaction = this.#db.transaction(store);
    const objectStore = transaction.objectStore(store);
    return new Promise((resolve, reject) => {
      const request = objectStore.getAllKeys();
      request.onerror = (event) => {
        reject(event);
      };
      request.onsuccess = () => {
        resolve(request.result);
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
        try {
          request.result.deleteObjectStore(STORE_HILO);
        } catch (error) {
          if (
            !(error instanceof DOMException) ||
            error.name !== "NotFoundError"
          ) {
            throw error;
          }
        }
        request.result.createObjectStore(STORE_HILO);
      };
    });
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
}
