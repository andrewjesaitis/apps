import React, { useMemo, useState } from "react";
import { PEDALS } from "../data/pedals";
import "../app.css";
import Masthead from "./Masthead";
import PedalPicker from "./PedalPicker";
import Chart from "./Chart";
import Legend from "./Legend";
import DetailPanel from "./DetailPanel";

export default function App() {
  const [active, setActive] = useState<string | null>(null);
  const [solo, setSolo] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(false);

  const activePedal = useMemo(() => PEDALS.find((p) => p.id === active) ?? null, [active]);

  const pick = (id: string): void => {
    setActive(id);
    setSolo(null);
  };
  const soloTag = (tag: string): void => {
    setActive(null);
    setSolo((s) => (s === tag ? null : tag));
  };
  // A click on empty space (or the picker's Clear) drops both the active
  // selection and any soloed family, returning to the full overview.
  const clear = (): void => {
    setActive(null);
    setSolo(null);
  };

  return (
    <div className="app">
      <Masthead />
      <p className="intro">
        Clipping × gain for ~60 overdrive, distortion, boost, and fuzz pedals. Color marks the tonal
        voicing; hollow markers preserve your amp&rsquo;s voice, solid ones color it. Tap any pedal.
      </p>
      <PedalPicker pedals={PEDALS} active={active} onPick={pick} onClear={clear} />
      <div className="layout">
        <Chart
          pedals={PEDALS}
          active={active}
          solo={solo}
          showLabels={showLabels}
          onSelect={setActive}
          onPick={pick}
          onClear={clear}
        />
        <DetailPanel pedal={activePedal} solo={solo} />
      </div>
      <Legend
        solo={solo}
        showLabels={showLabels}
        onSolo={soloTag}
        onToggleLabels={() => setShowLabels((s) => !s)}
      />
      <p className="footnote">
        Tap a tag to solo it. Ratings are interpretive characterizations, not lab measurements.
      </p>
    </div>
  );
}
