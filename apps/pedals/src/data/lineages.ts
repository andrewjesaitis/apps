import type { EqBands, Lineage, LineageKey, Voicing } from "../types";

// Circuit lineages — a filter/tag axis (color is driven by voicing).
// Originators are grouped with their clones (the Klon Centaur sits with its
// klones, TS-808 with the TS clones). `history` is shown in the detail panel.
export const LINEAGES: Record<LineageKey, Lineage> = {
  ts: {
    label: "Tube Screamer",
    color: "#5BBF5A",
    history:
      "Ibanez's TS-808 (1979): a JRC4558 op-amp with clipping diodes in the feedback loop for soft, symmetric clipping and a fixed mid-hump near 720 Hz. The most-cloned overdrive ever built.",
  },
  od1: {
    label: "Boss OD-1",
    color: "#A6C13C",
    history:
      "Boss's OD-1 (1977), the first mass-market overdrive — asymmetric diodes in the op-amp feedback loop. Its patent nudged Ibanez toward the symmetric Tube Screamer; the SD-1 later added a tone knob.",
  },
  klon: {
    label: "Klon",
    color: "#E6B422",
    history:
      "Bill Finnegan's Klon Centaur (1994): a clean buffered path blended with a germanium clipping path by a dual-gang gain pot, fed by an internal 18V charge pump. The 'transparent' boost behind countless klones.",
  },
  rat: {
    label: "Rat",
    color: "#E0484C",
    history:
      "ProCo's Rat (early 1980s): an LM308 op-amp whose slow slew rate tames treble, driving silicon diodes clipped hard to ground, with a backwards 'Filter' knob. Gritty and vocal.",
  },
  bb: {
    label: "Bluesbreaker",
    color: "#5AA9E6",
    history:
      "Marshall's Bluesbreaker pedal (1991): soft, asymmetric clipping with fuller lows and gentler mids than a Tube Screamer — the 'black box' that spawned the King of Tone and Morning Glory.",
  },
  muff: {
    label: "Big Muff",
    color: "#D070C8",
    history:
      "EHX's Big Muff Pi (1969): four cascaded transistor gain stages stacking into a near-square wave, with a scooped tone stack. The classic wall of sustaining fuzz.",
  },
  dplus: {
    label: "Distortion+ / DOD 250",
    color: "#F0982E",
    history:
      "MXR's Distortion+ and DOD's 250 (mid-1970s): a single op-amp boost into diodes clipped to ground. The Distortion+ used germanium diodes, the 250 silicon — otherwise near-twins.",
  },
  bossdist: {
    label: "Boss Distortion",
    color: "#A878E6",
    history:
      "Boss's DS-1 (1978) and kin: a preamp gain stage into silicon hard-clipping diodes with a Big Muff-style tone stack — brighter and gainier than the overdrives. The DS-2 and MT-2 Metal Zone pushed it to high gain.",
  },
  marshall: {
    label: "Marshall / British",
    color: "#F0506E",
    history:
      "Amp-in-a-box drives voiced after British amps — from Marshall's 1988 Guv'nor through JCM800-style circuits like the Angry Charlie to the modern Friedman BE-OD. Hard clipping with a Marshall midrange.",
  },
  dumble: {
    label: "Dumble / D-style",
    color: "#2CC2B0",
    history:
      "Pedals chasing the smooth, touch-sensitive overdrive of Alexander Dumble's rare amps — soft, dynamic clipping (often MOSFET plus diodes in the feedback loop). Hermida's Zendrive set the template.",
  },
  rangemaster: {
    label: "Dallas Rangemaster",
    color: "#D9A441",
    history:
      "The Dallas Rangemaster (1965): a one-germanium-transistor treble booster clamped to the front of cranked amps by Clapton, Brian May and Tony Iommi. Bass cut, treble and upper-mids lifted.",
  },
  fet: {
    label: "Modern / FET",
    color: "#7C8CF0",
    history:
      "Modern FET/MOSFET drives — Fulltone's OCD (MOSFETs clipping to V-ref) and JFET designs like the Boss BD-2 — prized for dynamic, amp-like response that cleans up with the guitar's volume.",
  },
  tube: {
    label: "Tube",
    color: "#B5651D",
    history:
      "Pedals built around a real tube: the Tube Driver starves a 12AX7 at low voltage (the op-amp clips, the tube smooths), while the Kingsley Page runs its 12AX7 at full ~240V plate voltage for genuine amp-like saturation.",
  },
  cleanboost: {
    label: "Clean boost",
    color: "#CFC8B6",
    history:
      "Boosters that add level with little clipping — from the one-knob MXR Micro Amp to the JFET Keeley Katana and the Echoplex-preamp-derived Xotic EP Booster.",
  },
  transparent: {
    label: "Transparent / original",
    color: "#86E0C0",
    history:
      "Low-coloration boutique overdrives — the Timmy, Lightspeed and ODR-1 — designed to preserve your amp's own voice and just add level and a little grit rather than impose a tone.",
  },
  octavia: {
    label: "Octavia",
    color: "#E8689F",
    history:
      "The octave-up fuzz line: Roger Mayer's Octavia (and the Tycobrahe version) used a transformer and diode rectification to stack an octave above a fuzz — famous from Hendrix's 'Purple Haze' solo.",
  },
  fuzzface: {
    label: "Fuzz Face",
    color: "#C77DFF",
    history:
      "The Arbiter Fuzz Face (1966): a two-transistor feedback fuzz with only Volume and Fuzz. Germanium units are warm and clean up with the guitar's volume; silicon units are brighter and fiercer. Hendrix and Gilmour.",
  },
  other: {
    label: "Other",
    color: "#8A8276",
    history:
      "Standalone designs without a shared lineage — the Ibanez Mostortion's soft silicon op-amp voice and the Walrus Eras's modern silicon/LED hard-clipping high-gain distortion.",
  },
};

// Tonal voicings — the color axis. Each value maps to a hue suggesting its
// place in the spectrum (scooped magenta, hump green, pushed orange, flat
// blue, bright yellow, dark indigo).
export const VOICINGS: { value: Voicing; label: string; color: string }[] = [
  { value: "mid-scooped", label: "Mid-scooped", color: "#C766C0" },
  { value: "mid-hump", label: "Mid-hump", color: "#5BBF5A" },
  { value: "mid-pushed", label: "Mid-pushed", color: "#E8923A" },
  { value: "flat", label: "Flat", color: "#5B9BD5" },
  { value: "bright", label: "Bright", color: "#E6CB45" },
  { value: "dark", label: "Dark", color: "#6E63C6" },
];

export const VOICING_COLOR = Object.fromEntries(VOICINGS.map((v) => [v.value, v.color])) as Record<
  Voicing,
  string
>;

// A short overview + a representative EQ shape for each voicing, shown in the
// detail panel. The EQ triple feeds the same curve generator as the pedals.
export const VOICING_INFO: Record<Voicing, { blurb: string; eq: EqBands }> = {
  "mid-scooped": {
    blurb:
      "Bass and treble lifted, mids cut — the scooped 'smiley' curve behind big fuzzes and metal distortions.",
    eq: [2, -2.5, 1.5],
  },
  "mid-hump": {
    blurb:
      "A midrange bump with rolled-off lows and highs — the Tube Screamer voice that cuts through a band.",
    eq: [-1.5, 2, -1],
  },
  "mid-pushed": {
    blurb:
      "Forward, present mids without cutting the lows or highs — full-bodied amp-in-a-box territory.",
    eq: [0.5, 1.5, 0.5],
  },
  flat: {
    blurb: "Essentially flat — preserves your amp's own voice with little added coloration.",
    eq: [0, 0, 0],
  },
  bright: {
    blurb: "Treble-forward — adds top-end sparkle and cut, often with a slight trim down low.",
    eq: [-0.5, 0, 2.5],
  },
  dark: {
    blurb: "Treble rolled off with full low-mids — warm, smooth and round.",
    eq: [1.5, 0, -2],
  },
};

// A pedal "carries" a tag when the tag matches either of its two axes.
// Lineage keys and voicing values never collide, so a single string is enough.
export function pedalHasTag(p: { lineage: LineageKey; voicing: Voicing }, tag: string): boolean {
  return p.lineage === tag || p.voicing === tag;
}
