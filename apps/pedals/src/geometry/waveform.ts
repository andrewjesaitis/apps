const TWO_PI = Math.PI * 2;

/**
 * One clipped-sine sample at `phase` for a clipping rating 0..10.
 * Low clip → rounded (gentle tanh); high clip → flat-topped square. The
 * drive coefficient and hardness blend are tuned so the difference reads
 * clearly across the data's actual 1–9 range.
 */
export function clipSample(phase: number, clip: number): number {
  const hardness = (clip / 10) ** 1.1;
  const drive = 1 + clip * 0.7;
  const s = Math.sin(phase) * drive;
  const soft = Math.tanh(s);
  const rail = 0.7;
  const hard = Math.max(-rail, Math.min(rail, s)) / rail;
  const y = (1 - hardness) * soft + hardness * hard;
  return Math.max(-1, Math.min(1, y));
}

/** Mean |amplitude| over a cycle — a monotonic proxy for "squareness". */
export function squareness(clip: number, samples = 256): number {
  let sum = 0;
  for (let i = 0; i < samples; i++) {
    sum += Math.abs(clipSample((i / samples) * TWO_PI, clip));
  }
  return sum / samples;
}

function buildPoints(sample: (phase: number) => number, w: number, h: number, pad: number): string {
  const n = 120;
  const cycles = 2.2;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const phase = (i / n) * cycles * TWO_PI;
    const y = sample(phase);
    const x = pad + (i / n) * (w - 2 * pad);
    const yy = h / 2 - y * (h / 2 - pad);
    pts.push(`${x.toFixed(1)},${yy.toFixed(1)}`);
  }
  return pts.join(" ");
}

/** SVG polyline points for the clipping waveform inside a w×h box. */
export function waveformPoints(clip: number, w: number, h: number, pad = 4): string {
  return buildPoints((phase) => clipSample(phase, clip), w, h, pad);
}

/** SVG polyline points for the faint clean-signal reference sine. */
export function referenceSinePoints(w: number, h: number, pad = 4): string {
  return buildPoints((phase) => Math.sin(phase), w, h, pad);
}
