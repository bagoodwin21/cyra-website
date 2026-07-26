/**
 * Event tracking that works with either tag setup configured in
 * src/components/analytics/google-tag-manager.tsx: sends through
 * gtag() when GA4 is loaded directly (G- measurement ID), otherwise
 * pushes to the GTM dataLayer.
 *
 * Event names in use:
 * - book_consult_click        (any CTA leading to /book; auto-tracked)
 * - financing_check_rate_click (the membership CTA)
 * - compare_page_view          (the /compare page, fired on mount)
 * - compare_table_scroll       (first horizontal scroll of the comparison table)
 */
export function trackEvent(
  event: string,
  params: Record<string, string | number> = {}
) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  if (typeof w.gtag === "function") {
    w.gtag("event", event, params);
    return;
  }
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...params });
}
