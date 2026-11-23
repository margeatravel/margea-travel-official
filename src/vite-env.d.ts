/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Public site key of the free Cloudflare Turnstile site used by the
   * contact and property-request forms (src/components/Turnstile.tsx).
   * When unset, the forms submit without a Turnstile token (transition
   * mode) and the edge functions allow submissions through.
   */
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
