/**
 * Thin wrapper over the GTM dataLayer. Events fired here are picked up
 * by the Google Tag Manager container configured in
 * src/components/analytics/google-tag-manager.tsx.
 *
 * Event names in use:
 * - book_consult_click        (any CTA leading to /book; auto-tracked)
 * - financing_check_rate_click (the care-plan CTA)
 */
export function trackEvent(
  event: string,
  params: Record<string, string | number> = {}
) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...params });
}
