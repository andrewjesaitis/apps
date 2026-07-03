import type { SuggestionPayload } from "./payload";

export type SubmitResult = { ok: boolean; error?: string };

// POST as text/plain so the browser treats it as a "simple" request (no CORS
// preflight) — the reliable pattern for Google Apps Script web apps.
export async function submitSuggestion(
  url: string,
  payload: SuggestionPayload,
  token: string,
): Promise<SubmitResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...payload, token }),
    });
    if (!res.ok) return { ok: false, error: "server" };
    try {
      return (await res.json()) as SubmitResult;
    } catch {
      return { ok: false, error: "server" };
    }
  } catch {
    return { ok: false, error: "network" };
  }
}
