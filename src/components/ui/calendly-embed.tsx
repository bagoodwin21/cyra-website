"use client";

import { useEffect } from "react";
import { CalendlyPlaceholder } from "./calendly-placeholder";
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
