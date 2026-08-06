import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { FadeUp } from "@/components/ui/fade-up";
import { buildMetadata } from "@/lib/seo";
import { content } from "@/content/site-content";
import { siteConfig } from "@/lib/site";
import { BookingDetails } from "./booking-details";

const { thankYouDiscovery } = content;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Your Discovery Call is booked | CYRA Wellness",
    absoluteTitle: true,
    description:
      "Your free Discovery Call with the CYRA Wellness team is confirmed.",
    path: "/thankyou/discovery-call",
    noindex: true,
  });
}

export default function DiscoveryCallConfirmationPage() {
  return (
    <>
      <Section>
        <FadeUp className="mx-auto max-w-2xl py-4 text-center md:py-8">
          <SectionLabel>{thankYouDiscovery.label}</SectionLabel>
          <BookingDetails />
        </FadeUp>
      </Section>

      {/* The number the call comes from */}
      <Section tone="surface">
        <FadeUp className="mx-auto max-w-2xl">
          <div className="rounded-[3px] border border-border bg-background p-8 text-center shadow-card">
            <p className="text-small font-semibold uppercase tracking-[0.18em] text-foreground-muted">
              {thankYouDiscovery.callFrom.heading}
            </p>
            <a
              href={`tel:${siteConfig.smsNumber}`}
              className="mt-2 block font-heading text-3xl font-bold text-primary transition-colors hover:text-primary-light md:text-4xl"
            >
              {siteConfig.smsDisplay}
            </a>
            <p className="text-body-copy mx-auto mt-4 max-w-md">
              {thankYouDiscovery.callFrom.body}
            </p>
          </div>
        </FadeUp>
      </Section>

      {/* What to expect */}
      <Section>
        <FadeUp className="mx-auto max-w-2xl">
          <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
            {thankYouDiscovery.expectHeading}
          </h2>
          <ul className="mt-6 space-y-5">
            {thankYouDiscovery.expect.map((item) => (
              <li key={item.slice(0, 40)} className="flex gap-3">
                <Check
                  className="mt-1 h-5 w-5 shrink-0 text-primary"
                  aria-hidden
                />
                <span className="text-body-copy">{item}</span>
              </li>
            ))}
          </ul>
        </FadeUp>
      </Section>

      {/* Rescheduling and next step */}
      <Section tone="surface">
        <FadeUp className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
            {thankYouDiscovery.rescheduleHeading}
          </h2>
          <p className="text-body-copy mt-4">
            {thankYouDiscovery.rescheduleBody}
          </p>
          <a
            href={`sms:${siteConfig.smsNumber}`}
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[3px] bg-primary px-6 py-2.5 text-center font-body text-cta font-bold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-accent sm:px-10 sm:tracking-[0.17em]"
          >
            Text us: {siteConfig.smsDisplay}
          </a>
          <p className="mt-8">
            <Link
              href="/book/consultation"
              className="text-small font-medium text-foreground-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {thankYouDiscovery.readyLabel}
            </Link>
          </p>
        </FadeUp>
      </Section>
    </>
  );
}
