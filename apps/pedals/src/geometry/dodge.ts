import type { Pedal } from "../types";

export type Offset = { dx: number; dy: number };

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function coordKey(p: Pedal): string {
  return `${p.clip}|${p.gain}`;
}

/**
 * Deterministic collision-aware offsets (in pixels) for stacked markers.
 * Markers sharing an exact (clip, gain) fan onto a sunflower spiral; the
 * first (by id) stays on the true point, the rest spiral out. Singletons
 * and dots at distinct coordinates get {0, 0} — they are never moved.
 */
export function computeDodge(pedals: Pedal[], markerRadius: number): Map<string, Offset> {
  const groups = new Map<string, Pedal[]>();
  for (const p of pedals) {
    const key = coordKey(p);
    const arr = groups.get(key);
    if (arr) arr.push(p);
    else groups.set(key, [p]);
  }

  const spacing = markerRadius * 1.7;
  const out = new Map<string, Offset>();
  for (const members of groups.values()) {
    if (members.length === 1) {
      out.set(members[0].id, { dx: 0, dy: 0 });
      continue;
    }
    const ordered = members.slice().sort((a, b) => a.id.localeCompare(b.id));
    ordered.forEach((p, i) => {
      const r = spacing * Math.sqrt(i);
      const theta = i * GOLDEN_ANGLE;
      out.set(p.id, { dx: r * Math.cos(theta), dy: r * Math.sin(theta) });
    });
  }
  return out;
}
