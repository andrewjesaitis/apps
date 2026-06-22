import { describe, it, expect } from "vitest";
import { squareness, clipSample, waveformPoints, referenceSinePoints } from "./waveform";

function flatFraction(clip: number, samples = 256): number {
  let c = 0;
  for (let i = 0; i < samples; i++) {
    if (Math.abs(clipSample((i / samples) * Math.PI * 2, clip)) > 0.95) c++;
  }
  return c / samples;
}

describe("waveform", () => {
  it("squares off monotonically as clipping rises", () => {
    expect(squareness(5)).toBeGreaterThan(squareness(1));
    expect(squareness(9)).toBeGreaterThan(squareness(5));
  });

  it("soft clipping spends little time pinned at the rail", () => {
    expect(flatFraction(1)).toBeLessThan(0.3);
  });

  it("hard clipping spends most of the cycle at the rail", () => {
    expect(flatFraction(9)).toBeGreaterThan(0.6);
  });

  it("produces non-empty point strings", () => {
    expect(waveformPoints(5, 120, 56).split(" ").length).toBeGreaterThan(50);
    expect(referenceSinePoints(120, 56).split(" ").length).toBeGreaterThan(50);
  });
});
