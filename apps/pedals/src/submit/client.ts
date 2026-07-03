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
    // Trust only a well-formed success body — a 200 with a wrong-shaped body
    // (e.g. an Apps Script HTML page) must never be reported as a write.
    try {
      const data = (await res.json()) as Partial<SubmitResult>;
      if (data?.ok === true) return { ok: true };
      return { ok: false, error: typeof data?.error === "string" ? data.error : "server" };
    } catch (err) {
      console.error("submitSuggestion: unparseable response body", err);
      return { ok: false, error: "server" };
    }
  } catch (err) {
    console.error("submitSuggestion: request failed", err);
    return { ok: false, error: "network" };
  }
}
