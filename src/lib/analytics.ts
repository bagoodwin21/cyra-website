/**
 * Thin wrapper over the GTM dataLayer. Events fired here are picked up
 * by the Google Tag Manager container configured in
 * src/components/analytics/google-tag-manager.tsx.
 *
 * Event names in use:
 * - book_consult_click        (any CTA leading to /book; auto-tracked)
 * - quiz_start                (first quiz answer selected)
 * - quiz_complete             (quiz results reached)
 * - quiz_result_tier          ({ tier })
 * - compare_page_view
 * - compare_table_scroll      (first horizontal scroll of the table)
 * - financing_check_rate_click
 * - condition_page_view       ({ condition })
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
