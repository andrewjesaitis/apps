// Circuit lineage — the family a pedal's circuit descends from. Exclusive
// (one per pedal) and drives the dot color. Also usable as a filter tag.
export type LineageKey =
  | "ts"
  | "od1"
  | "klon"
  | "rat"
  | "bb"
  | "muff"
  | "dplus"
  | "bossdist"
  | "marshall"
  | "dumble"
  | "rangemaster"
  | "fet"
  | "tube"
  | "cleanboost"
  | "transparent"
  | "octavia"
  | "fuzzface"
  | "other";

// Tonal voicing — where the pedal sits in the frequency spectrum. Exclusive
// (one per pedal/mode) and usable as a filter tag, but not color-encoded.
export type Voicing = "mid-scooped" | "mid-hump" | "mid-pushed" | "flat" | "bright" | "dark";

export type Lineage = { label: string; color: string; history: string };

export type Pedal = {
  id: string;
  name: string;
  lineage: LineageKey; // circuit family (drives color)
  voicing: Voicing; // tonal voicing (filter tag)
  clip: number; // 0 soft … 10 hard
  gain: number; // 0 clean … 10 high-gain
  transp: number; // 0 colored … 10 transparent
  note: string;
  pair?: string; // sweep-pair key
  end?: "lo" | "hi"; // sweep endpoint
  tag?: string; // discrete-mode label drawn in the dot
};

export type EqBands = readonly [low: number, mid: number, high: number]; // −3 … +3
