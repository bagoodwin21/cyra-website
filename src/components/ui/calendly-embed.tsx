"use client";

import { useEffect } from "react";
import { CalendlyPlaceholder } from "./calendly-placeholder";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface CalendlyEmbedProps {
  url: string;
  fallbackLabel: string;
  className?: string;
}

export function CalendlyEmbed({ url, fallbackLabel, className }: CalendlyEmbedProps) {
  useEffect(() => {
    if (!url || document.getElementById("calendly-widget-script")) return;
    const script = document.createElement("script");
    script.id = "calendly-widget-script";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, [url]);

  // Calendly posts a message to the parent window when a booking is
  // completed inside its iframe — the only signal we get, since we can't
  // see into a cross-origin frame. Turn it into a booking_confirmed event
  // so discovery calls are counted alongside consultations.
  useEffect(() => {
    if (!url) return;
    function onMessage(e: MessageEvent) {
      if (typeof e.origin !== "string" || !e.origin.includes("calendly.com")) {
        return;
      }
      const name = (e.data as { event?: string } | null)?.event;
      if (name === "calendly.event_scheduled") {
        trackEvent("booking_confirmed", { method: "discovery_call" });
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [url]);

  if (!url) {
    return <CalendlyPlaceholder label={fallbackLabel} className={className} />;
  }

  // Calendly's widget script sizes its iframe from the inline height of this
  // div, so an explicit height is required — CSS min-height classes alone
  // leave the iframe at a tiny default. data-resize lets newer versions of
  // the widget grow beyond it to fit content.
  return (
    <div
      className={cn("calendly-inline-widget", className)}
      data-url={url}
      data-resize="true"
      style={{ minWidth: "320px", height: "760px" }}
    />
  );
}
