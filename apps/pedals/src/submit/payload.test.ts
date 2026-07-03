import { describe, it, expect } from "vitest";
import { clampAxis, buildSuggestion } from "./payload";
import type { Pedal } from "../types";

const pedal: Pedal = {
  id: "ts808",
  name: "Tube Screamer",
  lineage: "ts",
  voicing: "mid-hump",
  clip: 3,
  gain: 5,
  transp: 6,
  note: "",
};

describe("clampAxis", () => {
  it("clamps out-of-range values into [0,10]", () => {
    expect(clampAxis(-2)).toBe(0);
    expect(clampAxis(12)).toBe(10);
  });
  it("rounds to one decimal", () => {
    expect(clampAxis(6.25)).toBe(6.3);
    expect(clampAxis(6.24)).toBe(6.2);
  });
});

describe("buildSuggestion", () => {
  it("assembles id + name + clamped axes", () => {
    const out = buildSuggestion(pedal, { clip: 3.25, gain: 12, transp: -1 });
    expect(out).toEqual({
      id: "ts808",
      name: "Tube Screamer",
      clip: 3.3,
      gain: 10,
      transp: 0,
    });
  });
});
