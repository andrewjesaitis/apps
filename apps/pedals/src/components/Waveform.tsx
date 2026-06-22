import React from "react";
import { waveformPoints, referenceSinePoints } from "../geometry/waveform";

const VW = 120;
const VH = 56;

export default function Waveform({ clip, color }: { clip: number; color: string }) {
  return (
    <div className="readout">
      <div className="readout-label">clipping shape</div>
      <div className="readout-box">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="readout-svg">
          <line x1="0" y1={VH / 2} x2={VW} y2={VH / 2} className="readout-axis" />
          <polyline points={referenceSinePoints(VW, VH)} className="readout-ref" />
          <polyline
            points={waveformPoints(clip, VW, VH)}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
