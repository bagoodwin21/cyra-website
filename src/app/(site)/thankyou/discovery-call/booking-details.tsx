"use client";

import * as React from "react";
import { trackEvent } from "@/lib/analytics";
import { content } from "@/content/site-content";

const { thankYouDiscovery } = content;

/**
 * Reads the booking details Calendly appends to the redirect URL, then
 * clears them from the address bar. Two reasons for clearing:
 * Calendly includes the invitee's email address, which must never reach
 * analytics, and the address is nicer to share without it.
 *
 * Also breaks out of Calendly's iframe: when the scheduler is embedded
 * inline, Calendly may run its redirect inside that frame, which would
 * otherwise leave this page trapped in a small box (or blocked outright
 * by our X-Frame-Options header).
 */
export function BookingDetails() {
  const [firstName, setFirstName] = React.useState<string | null>(null);
  const [when, setWhen] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Escape the scheduler iframe, keeping the details in the address.
    if (window.top && window.top !== window.self) {
      window.top.location.href = window.location.href;
      return;
    }

    const params = new URLSearchParams(window.location.search);

    const name = params.get("invitee_first_name")?.trim();
    if (name) setFirstName(name.slice(0, 40));

    const start = params.get("event_start_time");
    if (start) {
      const date = new Date(start);
      if (!Number.isNaN(date.getTime())) {
        setWhen(
          date.toLocaleString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short",
          }),
        );
      }
    }

    if (window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }

    trackEvent("booking_confirmed", { method: "discovery_call" });
  }, []);

  return (
    <>
      <h1 className="heading-hero">
        {firstName
          ? `${firstName}, your Discovery Call is booked.`
          : thankYouDiscovery.heading}
      </h1>
      <p className="text-subheadline mt-6">{thankYouDiscovery.intro}</p>
      {when && (
        <p className="mt-7">
          <span className="block text-small font-semibold uppercase tracking-[0.18em] text-foreground-muted">
            {thankYouDiscovery.whenLabel}
          </span>
          <span className="mt-1 block font-heading text-2xl font-semibold text-foreground md:text-3xl">
            {when}
          </span>
        </p>
      )}
    </>
  );
}
