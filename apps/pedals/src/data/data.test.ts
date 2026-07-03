import { describe, it, expect } from "vitest";
import { PEDALS } from "./pedals";
import { EQ } from "./eq";
import { LINEAGES, VOICINGS } from "./lineages";

describe("pedal data", () => {
  it("has 77 plotted dots", () => {
    expect(PEDALS).toHaveLength(77);
  });

  it("gives every pedal a unique id", () => {
    const ids = new Set(PEDALS.map((p) => p.id));
    expect(ids.size).toBe(PEDALS.length);
  });

  it("has exactly one EQ entry per pedal and no orphans", () => {
    expect(Object.keys(EQ).length).toBe(PEDALS.length);
    for (const p of PEDALS) {
      expect(EQ[p.id], `missing EQ for ${p.id}`).toBeDefined();
    }
  });

  it("references only known lineages and voicings", () => {
    const voicingValues = new Set(VOICINGS.map((v) => v.value));
    for (const p of PEDALS) {
      expect(LINEAGES[p.lineage], `unknown lineage ${p.lineage} on ${p.id}`).toBeDefined();
      expect(voicingValues.has(p.voicing), `unknown voicing ${p.voicing} on ${p.id}`).toBe(true);
    }
  });

  it("keeps ratings within 0–10 and EQ within −3…+3", () => {
    for (const p of PEDALS) {
      for (const v of [p.clip, p.gain, p.transp]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(10);
      }
      for (const band of EQ[p.id]) {
        expect(band).toBeGreaterThanOrEqual(-3);
        expect(band).toBeLessThanOrEqual(3);
      }
    }
  });
});

describe("demo videos", () => {
  const withDemo = PEDALS.filter((p) => p.demo);

  it("seeds at least 3 demo videos", () => {
    expect(withDemo.length).toBeGreaterThanOrEqual(3);
  });

  it("uses a valid 11-char YouTube id for every demo", () => {
    for (const p of withDemo) {
      const demo = p.demo;
      if (!demo) continue;
      expect(demo.youtubeId, `bad id on ${p.id}`).toMatch(/^[A-Za-z0-9_-]{11}$/);
    }
  });

  it("uses non-negative integer start times when present", () => {
    for (const p of withDemo) {
      const demo = p.demo;
      if (!demo || demo.start === undefined) continue;
      expect(Number.isInteger(demo.start), `non-integer start on ${p.id}`).toBe(true);
      expect(demo.start).toBeGreaterThanOrEqual(0);
    }
  });

  it("uses a non-empty source string when present", () => {
    for (const p of withDemo) {
      const demo = p.demo;
      if (!demo || demo.source === undefined) continue;
      expect(demo.source.trim().length, `empty source on ${p.id}`).toBeGreaterThan(0);
    }
  });
});
