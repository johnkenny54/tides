/**
 * @typedef {"ft"|"m"} UnitType
 */

export class Units {
  /**
   * @param {number} value
   * @param {UnitType} from
   * @param {UnitType} to
   * @returns {number}
   */
  static convert(value, from, to) {
    switch (from) {
      case "m":
        switch (to) {
          case "ft":
            return value * 3.280839895;
          case "m":
            return value;
        }
    }
    throw new Error(`unable to convert "${from}" to "${to}"`);
  }
}
