import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

/**
 * Cloudflare Turnstile widget (managed mode) as a React component.
 *
 * Managed mode is the default: Turnstile decides whether the visitor needs
 * to see a challenge, so most real users never notice anything. The widget
 * issues a token via its callback; the parent reads the current token with
 * getToken() at submit time and sends it to the edge function, which verifies
 * it server-side against Cloudflare's siteverify endpoint.
 *
 * The parent must NOT render this component when no site key is configured
 * (VITE_TURNSTILE_SITE_KEY unset) — in that case submissions go through
 * without a token and the edge functions allow them (transition mode) until
 * the keys are set.
 */

export interface TurnstileHandle {
  /** Current token, or null when the challenge has not completed yet. */
  getToken: () => string | null;
  /** Discard the current token and run a fresh challenge. */
  reset: () => void;
}

interface TurnstileProps {
  siteKey: string;
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: Record<string, unknown>,
      ) => string;
      reset: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string | undefined;
      remove: (widgetId?: string) => void;
    };
  }
}

let scriptLoadPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Turnstile requires a browser window"));
  }
  if (window.turnstile) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;
  const existing = document.getElementById(SCRIPT_ID);
  if (existing) {
    scriptLoadPromise = new Promise<void>((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Turnstile script")),
      );
    });
    return scriptLoadPromise;
  }
  scriptLoadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Turnstile script"));
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(
  function Turnstile({ siteKey }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const tokenRef = useRef<string | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
      let cancelled = false;
      loadTurnstileScript()
        .then(() => {
          if (cancelled || !containerRef.current || !window.turnstile) return;
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            // Managed mode is the default: no `appearance` override.
            // Turnstile shows a challenge only when it finds the visitor
            // suspicious; most real users see nothing.
            callback: (token: string) => {
              tokenRef.current = token;
            },
            "expired-callback": () => {
              tokenRef.current = null;
            },
            "error-callback": () => {
              tokenRef.current = null;
              setFailed(true);
            },
          });
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
      return () => {
        cancelled = true;
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // Widget may already be gone; nothing to do.
          }
          widgetIdRef.current = null;
        }
      };
    }, [siteKey]);

    useImperativeHandle(ref, () => ({
      getToken: () => {
        if (widgetIdRef.current && window.turnstile) {
          return (
            window.turnstile.getResponse(widgetIdRef.current) ||
            tokenRef.current
          );
        }
        return tokenRef.current;
      },
      reset: () => {
        tokenRef.current = null;
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
    }));

    // If the challenge script cannot load, render nothing so the form still
    // works. The edge function decides what to do with a missing token.
    if (failed) return null;
    return <div ref={containerRef} />;
  },
);

export default Turnstile;
