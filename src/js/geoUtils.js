import { MathUtils } from "./mathUtils.js";

export class GeoUtils {
  /**
   * @param {import('geojson').Position} p1
   * @param {import('geojson').Position} p2
   * @returns {number}
   */
  static getDistanceKM(p1, p2) {
    // Using https://en.wikipedia.org/wiki/Geographical_distance#FCC's_formula.
    const phi1 = p1[1]; // latitude degrees
    const phi2 = p2[1];
    const phiMid = MathUtils.degToRadian((phi1 + phi2) / 2); // radians

    const K1 =
      111.13209 -
      0.56605 * Math.cos(2 * phiMid) +
      0.0012 * Math.cos(4 * phiMid);
    const deltaPhi = phi2 - phi1;

    const K2 =
      111.41513 * Math.cos(phiMid) -
      0.09455 * Math.cos(3 * phiMid) +
      0.00012 * Math.cos(5 * phiMid);

    const K1dp = K1 * deltaPhi;
    const K2dl = K2 * (p2[0] - p1[0]);

    return Math.sqrt(K1dp * K1dp + K2dl * K2dl);
  }
}
