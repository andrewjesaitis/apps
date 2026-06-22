import React, { useMemo, useState } from "react";
import type { Pedal } from "../types";
import { LINEAGES, VOICING_COLOR } from "../data/lineages";

type Props = {
  pedals: Pedal[];
  active: string | null;
  onPick: (id: string) => void;
  onClear: () => void;
};

export default function PedalPicker({ pedals, active, onPick, onClear }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? pedals.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            LINEAGES[p.lineage].label.toLowerCase().includes(q) ||
            p.voicing.toLowerCase().includes(q),
        )
      : pedals;
    return list
      .slice()
      .sort(
        (a, b) =>
          LINEAGES[a.lineage].label.localeCompare(LINEAGES[b.lineage].label) ||
          a.name.localeCompare(b.name),
      );
  }, [pedals, query]);

  const pick = (id: string): void => {
    onPick(id);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="picker">
      <div className="picker-row">
        <input
          className="picker-input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search or pick a pedal…"
        />
        {(active || query) && (
          <button
            className="picker-clear"
            onClick={() => {
              onClear();
              setQuery("");
              setOpen(false);
            }}
          >
            Clear
          </button>
        )}
      </div>
      {open && (
        <>
          <div className="picker-scrim" onClick={() => setOpen(false)} />
          <ul className="picker-menu">
            {results.map((p) => (
              <li key={p.id}>
                <button
                  className={active === p.id ? "picker-item picker-item--active" : "picker-item"}
                  style={active === p.id ? { background: VOICING_COLOR[p.voicing] } : undefined}
                  onClick={() => pick(p.id)}
                >
                  <span className="picker-dot" style={{ background: VOICING_COLOR[p.voicing] }} />
                  <span className="picker-name">{p.name}</span>
                  <span className="picker-fam">{LINEAGES[p.lineage].label}</span>
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="picker-empty">No matches</li>}
          </ul>
        </>
      )}
    </div>
  );
}
