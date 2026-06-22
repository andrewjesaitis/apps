import { describe, it, expect } from "vitest";
import { eqAmplitude, eqCurvePoints, eqAreaPath } from "./eq-curve";

describe("eq-curve", () => {
  it("flat EQ has zero deviation", () => {
    expect(eqAmplitude(0, 30)).toBe(0);
  });

  it("exaggerates a small move beyond a linear v/3 mapping", () => {
    const half = 30;
    const linear = (1 / 3) * half; // the original artifact's mapping for value=1
    expect(eqAmplitude(1, half)).toBeGreaterThan(linear);
  });

  it("clamps full ±3 to the rail", () => {
    expect(eqAmplitude(3, 30)).toBeCloseTo(30);
    expect(eqAmplitude(-3, 30)).toBeCloseTo(-30);
  });

  it("is monotonic in |value|", () => {
    expect(eqAmplitude(2, 30)).toBeGreaterThan(eqAmplitude(1, 30));
  });

  it("draws a flat line for [0, 0, 0]", () => {
    const ys = eqCurvePoints([0, 0, 0], 120, 56)
      .split(" ")
      .map((p) => Number(p.split(",")[1]));
    expect(Math.max(...ys) - Math.min(...ys)).toBeLessThan(0.5);
  });

  it("returns a closed area path", () => {
    const d = eqAreaPath([3, -3, 3], 120, 56);
    expect(d.startsWith("M")).toBe(true);
    expect(d.trim().endsWith("Z")).toBe(true);
  });
});
