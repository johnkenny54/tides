export class MathUtils {
  /**
   * @param {number} degrees
   * @returns {number}
   */
  static degToRadian(degrees) {
    return (degrees / 180) * Math.PI;
  }

  /**
   * @param {number} value
   * @param {0|1|2|3|4|5|6|7|8|9|10} decimals
   * @returns {number}
   */
  static roundDecimals(value, decimals) {
    return parseFloat(value.toFixed(decimals));
  }
}
