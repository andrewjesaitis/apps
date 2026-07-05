import React, { useState } from "react";
import type { PedalDemo } from "../types";
import { youtubeEmbedUrl } from "../video/embed";

// A lazy YouTube demo player: a button until clicked, then a privacy-enhanced
// iframe. Nothing contacts YouTube until the visitor clicks. State resets on
// pedal change because DetailPanel keys PedalDetail by pedal.id (remount).
export default function PedalVideoEmbed({
  demo,
  pedalName,
}: {
  demo: PedalDemo;
  pedalName: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (!playing) {
    return (
      <button type="button" className="video-btn" onClick={() => setPlaying(true)}>
        <span aria-hidden="true">▶</span> Hear this pedal
      </button>
    );
  }

  return (
    <div className="video-embed">
      <div className="video-frame">
        <iframe
          src={youtubeEmbedUrl(demo)}
          title={`${pedalName} demo`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {demo.source && <p className="video-credit">via {demo.source}</p>}
    </div>
  );
}
