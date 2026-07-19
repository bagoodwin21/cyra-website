import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CalendarRange,
  Check,
  CreditCard,
  Droplets,
  Receipt,
  Stethoscope,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { Divider } from "@/components/ui/divider";
import { FAQItem } from "@/components/ui/faq-item";
import { TrackPageView } from "@/components/analytics/track-page-view";
import { buildMetadata } from "@/lib/seo";
import { content } from "@/content/site-content";
import { cn } from "@/lib/utils";
import { ComparisonTable } from "./comparison-table";

const { compare } = content;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title:
      "Menopause Telehealth Comparison: CYRA vs Midi, Alloy, Evernow, Winona | 2026",
    absoluteTitle: true,
    description:
      "How does CYRA Wellness compare to Midi, Alloy, Evernow, Winona, and Hers? A detailed comparison of menopause telehealth platforms including provider type, testosterone access, care structure, and financing options.",
    path: "/compare",
  });
}

/* Icons pair with compare.dimensions.items by position — layout, not copy,
   so the content file stays plain text. */
const dimensionIcons: LucideIcon[] = [
  Stethoscope,
  Droplets,
  CalendarRange,
  Receipt,
  CreditCard,
  UserCheck,
];

export default function ComparePage() {
  return (
    <>
      <TrackPageView event="compare_page_view" />

      {/* Hero */}
      <Section>
        <div className="mx-auto max-w-3xl py-4 text-center md:py-8">
          <SectionLabel>{compare.hero.label}</SectionLabel>
          <h1 className="heading-hero">{compare.hero.heading}</h1>
          <p className="text-subheadline mt-6">{compare.hero.subheadline}</p>
          <div className="mt-8">
            <a
              href="#comparison"
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              {compare.hero.jumpCta}
              <ArrowDown className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </Section>

      {/* Section 1 — What actually differs */}
      <Section tone="surface">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>{compare.dimensions.label}</SectionLabel>
          <h2 className="heading-section">{compare.dimensions.heading}</h2>
          <p className="text-subheadline mt-5">{compare.dimensions.intro}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {compare.dimensions.items.map(({ title, body }, i) => {
            const Icon = dimensionIcons[i % dimensionIcons.length];
            return (
              <Card key={title}>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <CardTitle className="mt-4">{title}</CardTitle>
                <CardDescription>{body}</CardDescription>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Section 2 — Comparison table */}
      <Section id="comparison" className="scroll-mt-24">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>{compare.comparison.label}</SectionLabel>
          <h2 className="heading-section">{compare.comparison.heading}</h2>
          <p className="text-subheadline mt-5">{compare.comparison.intro}</p>
        </div>
        <div className="mt-12">
          <ComparisonTable />
        </div>
      </Section>

      {/* Section 3 — Deeper dives */}
      <Section tone="surface">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionLabel>{compare.deeperDives.label}</SectionLabel>
            <h2 className="heading-section">{compare.deeperDives.heading}</h2>
            <p className="text-subheadline mt-5">{compare.deeperDives.intro}</p>
          </div>
          <div className="mt-10">
            {compare.deeperDives.items.map((dive) => (
              <FAQItem
                key={dive.name}
                question={dive.name}
                answer={
                  <div className="space-y-4">
                    {dive.paragraphs.map((p) => (
                      <p key={p.slice(0, 32)}>{p}</p>
                    ))}
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Section 4 — Questions to ask */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionLabel>{compare.questions.label}</SectionLabel>
            <h2 className="heading-section">{compare.questions.heading}</h2>
            <p className="text-subheadline mt-5">{compare.questions.intro}</p>
          </div>
          <ul className="mx-auto mt-10 max-w-2xl space-y-4">
            {compare.questions.items.map((question) => (
              <li key={question} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                </span>
                <span className="text-body-copy">{question}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Section 5 — Final CTA */}
      <Section tone="surface">
        <div className="mx-auto max-w-2xl text-center">
          <Divider className="my-0 mb-10" />
          <h2 className="heading-section">{compare.finalCta.heading}</h2>
          <p className="text-subheadline mt-5">{compare.finalCta.body}</p>
          <div className="mt-8">
            <Link
              href="/book"
              className={cn(buttonVariants({ variant: "accent", size: "lg" }))}
            >
              {compare.finalCta.cta}
            </Link>
          </div>
          <Link
            href="/#membership"
            className="mt-6 inline-flex items-center gap-1.5 text-small font-medium text-primary hover:text-primary-light"
          >
            {compare.finalCta.secondaryLink}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Section>
    </>
  );
}
