import type { Pedal } from "../types";

export type SweepPair = { lo: Pedal; hi: Pedal };

/** Group pedals by their `pair` key, keeping only complete lo+hi pairs. */
export function findSweeps(pedals: Pedal[]): SweepPair[] {
  const groups: Record<string, { lo?: Pedal; hi?: Pedal }> = {};
  for (const p of pedals) {
    if (!p.pair || !p.end) continue;
    (groups[p.pair] ??= {})[p.end] = p;
  }
  return Object.values(groups).filter(
    (g): g is SweepPair => g.lo !== undefined && g.hi !== undefined,
  );
}

export type ArrowGeometry = {
  line: { x1: number; y1: number; x2: number; y2: number };
  head: string;
};

/**
 * Dashed-arrow geometry from (x1,y1) to (x2,y2). The line stops `markerRadius+2`
 * short of the target so it meets the marker edge; `head` is a 3-point polygon.
 */
export function arrowGeometry(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  markerRadius: number,
): ArrowGeometry {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const tipX = x2 - ux * (markerRadius + 2);
  const tipY = y2 - uy * (markerRadius + 2);
  const bx = tipX - ux * 10;
  const by = tipY - uy * 10;
  const head =
    `${tipX.toFixed(1)},${tipY.toFixed(1)} ` +
    `${(bx - uy * 5).toFixed(1)},${(by + ux * 5).toFixed(1)} ` +
    `${(bx + uy * 5).toFixed(1)},${(by - ux * 5).toFixed(1)}`;
  return { line: { x1, y1, x2: tipX, y2: tipY }, head };
}
