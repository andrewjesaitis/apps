/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUGGEST_URL?: string;
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  turnstile?: {
    render: (
      el: HTMLElement,
      opts: {
        sitekey: string;
        callback: (token: string) => void;
        "expired-callback"?: () => void;
      },
    ) => string;
    remove: (id: string) => void;
    reset: (id: string) => void;
  };
}
