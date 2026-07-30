import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { FadeUp } from "@/components/ui/fade-up";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { physicianSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { content } from "@/content/site-content";
import { cn } from "@/lib/utils";

const { reviewsPage } = content;
const googleUrl = content.home.testimonials.googleUrl;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Dr. Mondona Goodwin Reviews | CYRA Wellness",
    absoluteTitle: true,
    description:
      "Read patient reviews of Dr. Mondona Goodwin, DO, and CYRA Wellness on Google. Board-certified Internal Medicine physician and Menopause Society Certified Practitioner (MSCP) caring for women across California.",
    path: "/reviews",
  });
}

export default function ReviewsPage() {
  return (
    <>
      <JsonLd data={physicianSchema()} />

      {/* Hero */}
      <Section>
        <FadeUp className="mx-auto max-w-3xl py-4 text-center md:py-8">
          <SectionLabel>{reviewsPage.label}</SectionLabel>
          <h1 className="heading-hero">{reviewsPage.heading}</h1>
          <p className="text-subheadline mt-6">{reviewsPage.intro}</p>
        </FadeUp>
      </Section>

      {/* Where reviews live + privacy note */}
      <Section tone="surface">
        <FadeUp className="mx-auto max-w-2xl text-center">
          <div className="space-y-5 text-left">
            {reviewsPage.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-body-copy">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-9">
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
            >
              {reviewsPage.googleCtaLabel}
            </a>
          </div>
          <p className="mt-9 text-small leading-relaxed text-foreground-muted">
            {reviewsPage.credentialLine}
          </p>
        </FadeUp>
      </Section>

      {/* Current patients */}
      <Section>
        <FadeUp className="mx-auto max-w-2xl">
          <div className="rounded-[3px] border border-border bg-background p-8 text-center shadow-card">
            <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
              {reviewsPage.forPatients.heading}
            </h2>
            <p className="text-body-copy mt-4">{reviewsPage.forPatients.body}</p>
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 font-body text-cta font-bold uppercase tracking-[0.15em] text-primary transition-colors hover:text-primary-light"
            >
              {reviewsPage.forPatients.cta}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </FadeUp>
      </Section>

      {/* Closing CTAs */}
      <Section tone="primary">
        <FadeUp className="mx-auto max-w-2xl py-4 text-center md:py-8">
          <div>
            <Link
              href="/book"
              className={cn(buttonVariants({ variant: "accent", size: "lg" }))}
            >
              {reviewsPage.closing.bookLabel}
            </Link>
          </div>
          <p className="mt-6">
            <Link
              href="/about"
              className="font-body text-cta font-bold uppercase tracking-[0.15em] text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              {reviewsPage.closing.aboutLabel}
            </Link>
          </p>
        </FadeUp>
      </Section>
    </>
  );
}
