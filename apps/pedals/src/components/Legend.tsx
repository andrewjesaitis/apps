import React from "react";
import type { LineageKey } from "../types";
import { LINEAGES, VOICINGS, VOICING_COLOR } from "../data/lineages";

type Props = {
  solo: string | null;
  showLabels: boolean;
  onSolo: (tag: string) => void;
  onToggleLabels: () => void;
};

export default function Legend({ solo, showLabels, onSolo, onToggleLabels }: Props) {
  const dim = (selected: boolean): number => (solo !== null && !selected ? 0.4 : 1);
  return (
    <div className="legend">
      <div className="legend-row">
        <span className="legend-axis">Voicing</span>
        {VOICINGS.map(({ value, label }) => {
          const selected = solo === value;
          const color = VOICING_COLOR[value];
          return (
            <button
              key={value}
              className={selected ? "chip chip--on" : "chip"}
              style={
                selected
                  ? { background: color, borderColor: color, color: "var(--bg)" }
                  : { opacity: dim(selected) }
              }
              onClick={() => onSolo(value)}
            >
              <span className="chip-dot" style={{ background: color }} />
              {label}
            </button>
          );
        })}
      </div>
      <div className="legend-row">
        <span className="legend-axis">Lineage</span>
        {(Object.keys(LINEAGES) as LineageKey[]).map((key) => {
          const selected = solo === key;
          return (
            <button
              key={key}
              className={selected ? "chip chip--neutral chip--on" : "chip chip--neutral"}
              style={selected ? undefined : { opacity: dim(selected) }}
              onClick={() => onSolo(key)}
            >
              {LINEAGES[key].label}
            </button>
          );
        })}
        <button
          className={showLabels ? "chip chip--toggle chip--on" : "chip chip--toggle"}
          onClick={onToggleLabels}
        >
          {showLabels ? "Hide names" : "Show names"}
        </button>
      </div>
    </div>
  );
}
