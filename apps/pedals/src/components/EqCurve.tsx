import React from "react";
import { eqCurvePoints, eqAreaPath } from "../geometry/eq-curve";
import type { EqBands } from "../types";

const VW = 120;
const VH = 56;

export default function EqCurve({
  eq,
  color,
  label = "eq voicing",
}: {
  eq: EqBands;
  color: string;
  label?: string;
}) {
  return (
    <div className="readout">
      <div className="readout-label">{label}</div>
      <div className="readout-box">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="readout-svg">
          <line
            x1="0"
            y1={VH / 2}
            x2={VW}
            y2={VH / 2}
            className="readout-axis"
            strokeDasharray="3 4"
          />
          <path d={eqAreaPath(eq, VW, VH)} fill={color} fillOpacity="0.18" />
          <polyline
            points={eqCurvePoints(eq, VW, VH)}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <text x="6" y={VH - 2} className="readout-tick">
            low
          </text>
          <text x={VW / 2} y={VH - 2} className="readout-tick" textAnchor="middle">
            mid
          </text>
          <text x={VW - 6} y={VH - 2} className="readout-tick" textAnchor="end">
            high
          </text>
        </svg>
      </div>
    </div>
  );
}
