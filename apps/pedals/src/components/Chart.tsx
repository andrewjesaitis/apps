import React, { useMemo } from "react";
import type { Pedal } from "../types";
import { VOICING_COLOR, pedalHasTag } from "../data/lineages";
import { px, py, W, H, M, MARKER_R } from "../geometry/scales";
import { computeDodge } from "../geometry/dodge";
import { findSweeps, arrowGeometry } from "../geometry/sweeps";

// Transparent pedals read as near-hollow rings; colored ones read solid.
const fillOp = (t: number): number => Math.max(0.03, Math.min(1, ((10 - t) / 10) ** 1.6));

type Props = {
  pedals: Pedal[];
  active: string | null;
  solo: string | null;
  showLabels: boolean;
  onSelect: (id: string | null) => void;
  onPick: (id: string) => void;
  onClear: () => void;
};

export default function Chart({
  pedals,
  active,
  solo,
  showLabels,
  onSelect,
  onPick,
  onClear,
}: Props) {
  const dodge = useMemo(() => computeDodge(pedals, MARKER_R), [pedals]);
  const sweeps = useMemo(() => findSweeps(pedals), [pedals]);

  const pos = (p: Pedal): { x: number; y: number } => {
    const o = dodge.get(p.id) ?? { dx: 0, dy: 0 };
    return { x: px(p.clip) + o.dx, y: py(p.gain) + o.dy };
  };

  // The gain-pair partner of the active dot (a sweep's other end), if any.
  const partnerId = useMemo(() => {
    if (!active) return null;
    const pair = sweeps.find((s) => s.lo.id === active || s.hi.id === active);
    return pair ? (pair.lo.id === active ? pair.hi.id : pair.lo.id) : null;
  }, [active, sweeps]);

  // Dot opacity: full for the active/lit dots, a "transparent" highlight for
  // the active dot's gain-pair partner, dim for everything else. `solo` is a
  // tag (lineage key or voicing value); active overrides the tag.
  const dotOpacity = (p: Pedal): number => {
    if (active) {
      if (p.id === active) return 1;
      if (p.id === partnerId) return 0.5;
      return 0.12;
    }
    return !!solo && !pedalHasTag(p, solo) ? 0.12 : 1;
  };
  const sweepDim = (lo: Pedal, hi: Pedal): boolean =>
    active ? !(active === lo.id || active === hi.id) : !!solo && !pedalHasTag(lo, solo);

  // When a tag is soloed, only dots carrying it update the detail panel on
  // hover — cursoring over the dimmed dots won't hijack it.
  const hoverSelect = (p: Pedal): void => {
    if (!solo || pedalHasTag(p, solo)) onSelect(p.id);
  };
  // In solo mode, hover is a transient preview: leaving a dot restores the
  // full tag view. (Outside solo mode, a hovered selection stays put.)
  const hoverEnd = (): void => {
    if (solo) onSelect(null);
  };

  // Paint order: dimmed dots first, the partner above them, the active dot last.
  const rank = (id: string): number => (id === active ? 2 : id === partnerId ? 1 : 0);
  const ordered = pedals.slice().sort((a, b) => rank(a.id) - rank(b.id));

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" onClick={onClear}>
        <defs>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[0, 2, 4, 6, 8, 10].map((v) => (
          <g key={`g${v}`}>
            <line x1={px(v)} y1={M.T} x2={px(v)} y2={H - M.B} className="grid-line" />
            <line x1={M.L} y1={py(v)} x2={W - M.R} y2={py(v)} className="grid-line" />
          </g>
        ))}
        <line x1={px(5)} y1={M.T} x2={px(5)} y2={H - M.B} className="grid-divider" />
        <line x1={M.L} y1={py(5)} x2={W - M.R} y2={py(5)} className="grid-divider" />

        <text x={(M.L + W - M.R) / 2} y={H - 16} className="axis-label" textAnchor="middle">
          CLIPPING&nbsp;&nbsp;soft → hard
        </text>
        <text
          x={20}
          y={(M.T + H - M.B) / 2}
          className="axis-label"
          textAnchor="middle"
          transform={`rotate(-90 20 ${(M.T + H - M.B) / 2})`}
        >
          GAIN&nbsp;&nbsp;low → high
        </text>

        {sweeps.map(({ lo, hi }) => {
          const a = pos(lo);
          const b = pos(hi);
          const g = arrowGeometry(a.x, a.y, b.x, b.y, MARKER_R);
          const c = VOICING_COLOR[lo.voicing];
          return (
            <g key={`sw-${lo.id}`} className="sweep" opacity={sweepDim(lo, hi) ? 0.1 : 0.55}>
              <line
                x1={g.line.x1}
                y1={g.line.y1}
                x2={g.line.x2}
                y2={g.line.y2}
                stroke={c}
                strokeWidth="2"
                strokeDasharray="2 5"
                strokeLinecap="round"
              />
              <polygon points={g.head} fill={c} />
            </g>
          );
        })}

        {ordered.map((p) => {
          const c = VOICING_COLOR[p.voicing];
          const { x, y } = pos(p);
          const isAct = active === p.id;
          return (
            <g
              key={p.id}
              className="dot"
              opacity={dotOpacity(p)}
              onClick={(e) => {
                e.stopPropagation();
                onPick(p.id);
              }}
              onMouseEnter={() => hoverSelect(p)}
              onMouseLeave={hoverEnd}
            >
              {isAct && (
                <circle
                  cx={x}
                  cy={y}
                  r={MARKER_R + 7}
                  fill="none"
                  stroke={c}
                  strokeWidth="1.5"
                  opacity="0.5"
                  filter="url(#glow)"
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={MARKER_R}
                fill={c}
                fillOpacity={fillOp(p.transp)}
                stroke={c}
                strokeWidth={isAct ? 4 : 2.5}
              />
              {p.tag && (
                <text x={x} y={y + 3.5} className="dot-tag" textAnchor="middle">
                  {p.tag}
                </text>
              )}
              {(showLabels || isAct || p.id === partnerId) && (
                <text
                  x={x}
                  y={y - MARKER_R - 5}
                  className={isAct ? "dot-name dot-name--active" : "dot-name"}
                  textAnchor="middle"
                >
                  {p.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="chart-key">
        <div className="chart-key-row">
          <span className="key-dot key-dot--hollow" /> hollow = transparent
        </div>
        <div className="chart-key-row">
          <span className="key-dot key-dot--solid" /> solid = colors your tone
        </div>
        <div className="chart-key-row">
          <svg width="22" height="10" className="key-arrow">
            <line x1="1" y1="5" x2="14" y2="5" strokeDasharray="2 4" />
            <polygon points="22,5 15,2 15,8" />
          </svg>
          dashed arrow = gain down → cranked
        </div>
      </div>
    </div>
  );
}
