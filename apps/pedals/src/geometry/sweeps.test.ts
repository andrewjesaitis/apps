import { describe, it, expect } from "vitest";
import { findSweeps, arrowGeometry } from "./sweeps";
import type { Pedal } from "../types";

const lo: Pedal = {
  id: "a_lo",
  name: "A lo",
  lineage: "ts",
  voicing: "flat",
  clip: 2,
  gain: 2,
  transp: 5,
  note: "",
  pair: "a",
  end: "lo",
};
const hi: Pedal = {
  id: "a_hi",
  name: "A hi",
  lineage: "ts",
  voicing: "flat",
  clip: 4,
  gain: 6,
  transp: 3,
  note: "",
  pair: "a",
  end: "hi",
};
const solo: Pedal = {
  id: "s",
  name: "S",
  lineage: "ts",
  voicing: "flat",
  clip: 5,
  gain: 5,
  transp: 5,
  note: "",
};

describe("findSweeps", () => {
  it("pairs lo + hi sharing a pair key", () => {
    const s = findSweeps([lo, hi, solo]);
    expect(s).toHaveLength(1);
    expect(s[0].lo.id).toBe("a_lo");
    expect(s[0].hi.id).toBe("a_hi");
  });

  it("ignores incomplete pairs", () => {
    expect(findSweeps([lo, solo])).toHaveLength(0);
  });
});

describe("arrowGeometry", () => {
  it("retracts the tip by markerRadius + 2 from the target", () => {
    const g = arrowGeometry(0, 0, 100, 0, 11);
    expect(g.line.x2).toBeCloseTo(100 - 13);
    expect(g.line.y2).toBeCloseTo(0);
  });

  it("returns a three-point arrowhead polygon", () => {
    const g = arrowGeometry(0, 0, 100, 0, 11);
    expect(g.head.trim().split(/\s+/)).toHaveLength(3);
  });
});
