import { describe, it, expect } from "vitest";
import { computeDodge } from "./dodge";
import type { Pedal } from "../types";

const R = 11;

function pedal(id: string, clip: number, gain: number): Pedal {
  return { id, name: id, lineage: "ts", voicing: "flat", clip, gain, transp: 5, note: "" };
}

function dist(a: { dx: number; dy: number }, b: { dx: number; dy: number }): number {
  return Math.hypot(a.dx - b.dx, a.dy - b.dy);
}

describe("computeDodge", () => {
  it("leaves an isolated dot exactly on its coordinate", () => {
    const m = computeDodge([pedal("solo", 5, 5)], R);
    expect(m.get("solo")).toEqual({ dx: 0, dy: 0 });
  });

  it("does not move dots that sit at distinct coordinates", () => {
    const m = computeDodge([pedal("a", 3, 4), pedal("b", 5, 6)], R);
    expect(m.get("a")).toEqual({ dx: 0, dy: 0 });
    expect(m.get("b")).toEqual({ dx: 0, dy: 0 });
  });

  it("separates a stacked pair by at least one marker radius", () => {
    const m = computeDodge([pedal("a", 3, 4), pedal("b", 3, 4)], R);
    expect(dist(m.get("a")!, m.get("b")!)).toBeGreaterThanOrEqual(R);
  });

  it("keeps every member of a large stack mutually separated", () => {
    const stack = Array.from({ length: 11 }, (_, i) => pedal(`p${i}`, 3, 4));
    const m = computeDodge(stack, R);
    for (let i = 0; i < stack.length; i++) {
      for (let j = i + 1; j < stack.length; j++) {
        expect(dist(m.get(`p${i}`)!, m.get(`p${j}`)!)).toBeGreaterThanOrEqual(R);
      }
    }
  });

  it("is deterministic across calls", () => {
    const make = () => computeDodge([pedal("a", 3, 4), pedal("b", 3, 4), pedal("c", 3, 4)], R);
    expect([...make().entries()]).toEqual([...make().entries()]);
  });
});
