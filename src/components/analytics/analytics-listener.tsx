"use client";

import * as React from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Site-wide click tracking, mounted once in the root layout:
 * - any link to /book fires book_consult_click
 * - any element with a data-analytics-event attribute fires that event
 *   (used for financing_check_rate_click and similar one-off CTAs)
 */
export function AnalyticsListener() {
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;

      const tagged = target.closest<HTMLElement>("[data-analytics-event]");
      if (tagged?.dataset.analyticsEvent) {
        trackEvent(tagged.dataset.analyticsEvent);
      }

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (link) {
        const href = link.getAttribute("href") ?? "";
        if (href === "/book" || href.startsWith("/book?")) {
          trackEvent("book_consult_click", {
            cta_text: link.textContent?.trim() ?? "",
            page_path: window.location.pathname,
          });
        }
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
