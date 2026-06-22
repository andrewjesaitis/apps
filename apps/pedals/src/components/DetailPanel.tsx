import React from "react";
import type { LineageKey, Pedal, Voicing } from "../types";
import { LINEAGES, VOICINGS, VOICING_COLOR, VOICING_INFO } from "../data/lineages";
import { EQ } from "../data/eq";
import Waveform from "./Waveform";
import EqCurve from "./EqCurve";

function Bar({
  label,
  value,
  color,
  invert,
}: {
  label: string;
  value: number;
  color: string;
  invert?: boolean;
}) {
  return (
    <div className="bar">
      <div className="bar-head">
        <span className="bar-label">{label}</span>
        <span className="bar-value">{value.toFixed(1)}</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${(value / 10) * 100}%`, background: color }} />
      </div>
      <div className="bar-ends">
        <span>{invert ? "colored" : "low"}</span>
        <span>{invert ? "transparent" : "high"}</span>
      </div>
    </div>
  );
}

const voicingLabel = (v: Voicing): string => VOICINGS.find((x) => x.value === v)?.label ?? v;

// A representative EQ curve + one-line overview for a voicing.
function VoicingCard({ value }: { value: Voicing }) {
  const info = VOICING_INFO[value];
  return (
    <div className="voicing-card">
      <div className="voicing-eq">
        <EqCurve eq={info.eq} color={VOICING_COLOR[value]} label="representative" />
      </div>
      <p className="context-text">{info.blurb}</p>
    </div>
  );
}

export default function DetailPanel({ pedal, solo }: { pedal: Pedal | null; solo: string | null }) {
  // A pedal is selected → full detail, with its voicing + lineage context.
  if (pedal) {
    const lin = LINEAGES[pedal.lineage];
    const color = VOICING_COLOR[pedal.voicing];
    const eq = EQ[pedal.id];
    return (
      <aside className="detail">
        <div className="detail-kicker">
          <span style={{ color }}>{voicingLabel(pedal.voicing)}</span>
          <span className="detail-voicing"> · {lin.label}</span>
        </div>
        <h2 className="detail-name">{pedal.name}</h2>
        <div className="readouts">
          <Waveform clip={pedal.clip} color={color} />
          {eq && <EqCurve eq={eq} color={color} />}
        </div>
        <Bar label="CLIPPING" value={pedal.clip} color={color} />
        <Bar label="GAIN" value={pedal.gain} color={color} />
        <Bar label="TRANSPARENCY" value={pedal.transp} color={color} invert />
        {pedal.note && <p className="detail-note">{pedal.note}</p>}
        <div className="context">
          <div className="context-block">
            <div className="context-head" style={{ color }}>
              Voicing · {voicingLabel(pedal.voicing)}
            </div>
            <VoicingCard value={pedal.voicing} />
          </div>
          <div className="context-block">
            <div className="context-head">Lineage · {lin.label}</div>
            <p className="context-text">{lin.history}</p>
          </div>
        </div>
      </aside>
    );
  }

  // No pedal, but a tag is soloed → show that group's overview.
  if (solo) {
    if (solo in LINEAGES) {
      const lin = LINEAGES[solo as LineageKey];
      return (
        <aside className="detail">
          <div className="detail-kicker">Lineage</div>
          <h2 className="detail-name">{lin.label}</h2>
          <p className="context-text">{lin.history}</p>
          <p className="detail-hint">Hover a highlighted pedal for its details.</p>
        </aside>
      );
    }
    const v = solo as Voicing;
    return (
      <aside className="detail">
        <div className="detail-kicker" style={{ color: VOICING_COLOR[v] }}>
          Voicing
        </div>
        <h2 className="detail-name">{voicingLabel(v)}</h2>
        <VoicingCard value={v} />
        <p className="detail-hint">Hover a highlighted pedal for its details.</p>
      </aside>
    );
  }

  // Nothing selected → empty-state key.
  return (
    <aside className="detail detail--empty">
      <p>
        Tap or hover a pedal to see its clipping waveform, EQ voicing, and where it sits — or tap a
        tag below to explore a voicing or lineage.
      </p>
    </aside>
  );
}
