/**
 * @typedef {"ft"|"km"|"m"|"mi"} UnitType
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
      case "km":
        switch (to) {
          case "mi":
            return value * 0.6213712;
        }
        break;
      case "m":
        switch (to) {
          case "ft":
            return value * 3.280839895;
          case "m":
            return value;
        }
        break;
      case "mi":
        switch (to) {
          case "km":
            return value * 1.609344;
        }
        break;
    }
    throw new Error(`unable to convert "${from}" to "${to}"`);
  }

  /**
   *
   * @param {number} value
   * @param {UnitType} units
   * @param {number} decimals
   */
  static getDisplayString(value, units, decimals) {
    return `${value.toFixed(decimals)} ${units}`;
  }
}
