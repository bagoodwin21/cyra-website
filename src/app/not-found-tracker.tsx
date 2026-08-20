"use client";

import * as React from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Records which nonexistent address was requested and which page linked
 * to it, so mystery 404 paths in analytics come with their origin
 * attached instead of needing detective work.
 */
export function NotFoundTracker() {
  React.useEffect(() => {
    trackEvent("page_not_found", {
      bad_path: window.location.pathname.slice(0, 100),
      referrer: (document.referrer || "none").slice(0, 100),
    });
  }, []);
  return null;
}
