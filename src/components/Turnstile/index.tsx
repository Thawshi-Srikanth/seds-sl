"use client";

import React, { useEffect, useRef, useState, useId } from "react";

// Official Cloudflare Turnstile dummy testing keys for local/development fallback
const DEMO_SITE_KEY = "1x00000000000000000000AA";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
  align?: "left" | "center" | "right";
  className?: string;
}

export function Turnstile({
  onVerify,
  onError,
  onExpire,
  theme = "dark",
  align = "left",
  className,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const id = useId().replace(/:/g, "_");

  // Store callbacks in refs to prevent re-triggering useEffect on parent re-renders
  const onVerifyRef = useRef(onVerify);
  const onErrorRef = useRef(onError);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onErrorRef.current = onError;
    onExpireRef.current = onExpire;
  });

  const alignClass =
    align === "center"
      ? "justify-center"
      : align === "right"
        ? "justify-end"
        : "justify-start";

  const siteKey =
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    DEMO_SITE_KEY;

  useEffect(() => {
    // Check if script is already present
    let script = document.querySelector(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"]',
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const renderWidget = () => {
      if (window.turnstile && containerRef.current) {
        try {
          if (widgetIdRef.current) {
            const oldId = widgetIdRef.current;
            widgetIdRef.current = null;
            try {
              window.turnstile.remove(oldId);
            } catch (_) {}
          }
          if (containerRef.current) {
            containerRef.current.innerHTML = "";
          }
          const widgetId = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              onVerifyRef.current?.(token);
            },
            "error-callback": () => {
              onErrorRef.current?.();
            },
            "expired-callback": () => {
              onExpireRef.current?.();
            },
            theme,
          });
          widgetIdRef.current = widgetId;
          setLoaded(true);
        } catch (err) {
          console.error("Turnstile render error:", err);
        }
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        const oldId = widgetIdRef.current;
        widgetIdRef.current = null;
        try {
          window.turnstile.remove(oldId);
        } catch (_) {}
      }
    };
  }, [siteKey, theme]);

  return (
    <div className={className || `my-2 flex ${alignClass}`}>
      <div ref={containerRef} id={`turnstile_${id}`} />
    </div>
  );
}
