import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { FadeUp } from "@/components/ui/fade-up";
import { TrackPageView } from "@/components/analytics/track-page-view";
import { buildMetadata } from "@/lib/seo";
import { content } from "@/content/site-content";
import { siteConfig } from "@/lib/site";

const { thankYou } = content;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Your visit is booked | CYRA Wellness",
    absoluteTitle: true,
    description:
      "Your appointment with CYRA Wellness is confirmed. Here's what happens next before your visit.",
    path: "/thankyou",
    // Confirmation pages have no business in search results.
    noindex: true,
  });
}

export default function ThankYouPage() {
  return (
    <>
      {/* Records the booking in Google Analytics. */}
      <TrackPageView event="booking_confirmed" />

      <Section>
        <FadeUp className="mx-auto max-w-2xl py-4 text-center md:py-8">
          <SectionLabel>{thankYou.label}</SectionLabel>
          <h1 className="heading-hero">{thankYou.heading}</h1>
          <p className="text-subheadline mt-6">{thankYou.intro}</p>
        </FadeUp>
      </Section>

      <Section tone="surface">
        <FadeUp className="mx-auto max-w-2xl">
          <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
            {thankYou.nextStepsHeading}
          </h2>
          <ul className="mt-6 space-y-5">
            {thankYou.nextSteps.map((step) => (
              <li key={step.slice(0, 40)} className="flex gap-3">
                <Check
                  className="mt-1 h-5 w-5 shrink-0 text-primary"
                  aria-hidden
                />
                <span className="text-body-copy">{step}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-[3px] border border-border bg-background p-6 shadow-card">
            <h3 className="font-heading text-xl font-semibold text-foreground md:text-2xl">
              {thankYou.firstVisit.heading}
            </h3>
            <p className="text-body-copy mt-3">{thankYou.firstVisit.body}</p>
          </div>
        </FadeUp>
      </Section>

      <Section>
        <FadeUp className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
            {thankYou.questionsHeading}
          </h2>
          <p className="text-body-copy mt-4">{thankYou.questionsBody}</p>
          <a
            href={`sms:${siteConfig.smsNumber}`}
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[3px] bg-primary px-6 py-2.5 text-center font-body text-cta font-bold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-accent sm:px-10 sm:tracking-[0.17em]"
          >
            Text us: {siteConfig.smsDisplay}
          </a>
          <p className="mt-8">
            <Link
              href="/"
              className="text-small font-medium text-foreground-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {thankYou.homeLinkLabel}
            </Link>
          </p>
        </FadeUp>
      </Section>
    </>
  );
}
