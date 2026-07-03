// Client-safe configuration. These values are public by design (a site key and
// a public web-app URL); the server secret lives only in Apps Script.
export const SUGGEST_URL = import.meta.env.VITE_SUGGEST_URL as string | undefined;
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

// The Suggest feature only appears when both values are configured. Unset
// VITE_* vars resolve to undefined at build time, so this Boolean check (both
// must be non-empty strings) gates the feature.
export const suggestionsEnabled = Boolean(SUGGEST_URL && TURNSTILE_SITE_KEY);
