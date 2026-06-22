import type { EqBands } from "../types";

const CENTERS = [0.2, 0.5, 0.8] as const;
const SIGMA = 0.2;

/**
 * Vertical pixel deviation from baseline for an EQ band value (−3..+3),
 * exaggerated via a gamma so small ±1 moves read clearly. Positive = boost.
 */
export function eqAmplitude(value: number, halfHeight: number): number {
  const norm = Math.max(-1, Math.min(1, value / 3));
  const shaped = Math.sign(norm) * Math.abs(norm) ** 0.6;
  return shaped * halfHeight;
}

/** Gaussian-blended response value (in band units) at horizontal position t∈[0,1]. */
function responseAt(eq: EqBands, t: number): number {
  let wsum = 0;
  let vsum = 0;
  for (let k = 0; k < 3; k++) {
    const w = Math.exp(-((t - CENTERS[k]) ** 2) / (2 * SIGMA * SIGMA));
    wsum += w;
    vsum += w * eq[k];
  }
  return vsum / wsum;
}

/** SVG polyline points for the EQ curve in a w×h box. */
export function eqCurvePoints(eq: EqBands, w: number, h: number, pad = 6): string {
  const n = 72;
  const half = h / 2 - pad;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const y = h / 2 - eqAmplitude(responseAt(eq, t), half);
    const x = pad + t * (w - 2 * pad);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

/** Closed SVG path (curve, then back along the baseline) for the filled area. */
export function eqAreaPath(eq: EqBands, w: number, h: number, pad = 6): string {
  const n = 72;
  const half = h / 2 - pad;
  const baseY = h / 2;
  let d = `M ${pad.toFixed(1)} ${baseY.toFixed(1)}`;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const y = h / 2 - eqAmplitude(responseAt(eq, t), half);
    const x = pad + t * (w - 2 * pad);
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  d += ` L ${(w - pad).toFixed(1)} ${baseY.toFixed(1)} Z`;
  return d;
}
