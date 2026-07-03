import type { Pedal } from "../types";

export type Draft = { clip: number; gain: number; transp: number };

export type SuggestionPayload = {
  id: string;
  name: string;
  clip: number;
  gain: number;
  transp: number;
};

// Clamp a raw slider value into [0,10] and round to one decimal.
export function clampAxis(v: number): number {
  const bounded = Math.min(10, Math.max(0, v));
  return Math.round(bounded * 10) / 10;
}

// Combine a pedal's identity with clamped draft values into the wire payload.
export function buildSuggestion(pedal: Pedal, draft: Draft): SuggestionPayload {
  return {
    id: pedal.id,
    name: pedal.name,
    clip: clampAxis(draft.clip),
    gain: clampAxis(draft.gain),
    transp: clampAxis(draft.transp),
  };
}
