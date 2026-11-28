import { expect, test } from "vitest";
import { GeoUtils } from "../src/js/geoUtils.js";
import { MathUtils } from "../src/js/mathUtils.js";

test("getDistanceKM()", () => {
  const p1 = [-120, 37];
  const p2 = [-121, 38];
  expect(MathUtils.roundDecimals(GeoUtils.getDistanceKM(p1, p2), 2)).toBe(
    141.9,
  );
});
