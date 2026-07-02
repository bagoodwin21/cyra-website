"use client";

import * as React from "react";
import { trackEvent } from "@/lib/analytics";

interface TrackPageViewProps {
  event: string;
  params?: Record<string, string>;
}

/** Fires a single dataLayer event on mount — drop into any server page. */
export function TrackPageView({ event, params }: TrackPageViewProps) {
  React.useEffect(() => {
    trackEvent(event, params);
    // Fire exactly once per page mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
