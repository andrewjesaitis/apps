// src/components/SuggestForm.tsx
import React, { useEffect, useRef, useState } from "react";
import type { Pedal } from "../types";
import { buildSuggestion, type Draft } from "../submit/payload";
import { submitSuggestion } from "../submit/client";
import { SUGGEST_URL, TURNSTILE_SITE_KEY } from "../submit/config";

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
type Status = "idle" | "submitting" | "success" | "error";

// Loads the Turnstile script once (only when this form first mounts, i.e. only
// when the user enters edit mode) and resolves when window.turnstile is ready.
function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("turnstile-load")));
      return;
    }
    const s = document.createElement("script");
    s.src = TURNSTILE_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("turnstile-load"));
    document.head.appendChild(s);
  });
}

export default function SuggestForm({
  pedal,
  draft,
  onCancel,
}: {
  pedal: Pedal;
  draft: Draft;
  onCancel: () => void;
}) {
  const widgetHost = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let widgetId: string | undefined;
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !widgetHost.current || !window.turnstile || !TURNSTILE_SITE_KEY) return;
        widgetId = window.turnstile.render(widgetHost.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (t) => setToken(t),
          "expired-callback": () => setToken(null),
        });
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, []);

  const submit = async () => {
    if (!token || !SUGGEST_URL) return;
    setStatus("submitting");
    const result = await submitSuggestion(SUGGEST_URL, buildSuggestion(pedal, draft), token);
    setStatus(result.ok ? "success" : "error");
  };

  if (status === "success") {
    return (
      <div className="suggest">
        <p className="suggest-msg">Thanks — your suggestion was recorded.</p>
        <button type="button" className="suggest-btn" onClick={onCancel}>
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="suggest">
      <div ref={widgetHost} className="suggest-captcha" />
      {status === "error" && (
        <p className="suggest-msg suggest-msg--error">Couldn&rsquo;t submit — please try again.</p>
      )}
      <div className="suggest-actions">
        <button type="button" className="suggest-btn" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className="suggest-btn suggest-btn--primary"
          disabled={!token || status === "submitting"}
          onClick={submit}
        >
          {status === "submitting" ? "Submitting…" : "Submit"}
        </button>
      </div>
    </div>
  );
}
