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

  return (
    <div
      className={cn("calendly-inline-widget", className)}
      data-url={url}
      style={{ minWidth: "320px" }}
    />
  );
}
