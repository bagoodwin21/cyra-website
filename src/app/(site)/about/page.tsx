import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { FadeUp } from "@/components/ui/fade-up";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { physicianSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { content } from "@/content/site-content";
import { cn } from "@/lib/utils";

const { about } = content;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "About Dr. Mondona Goodwin, DO | CYRA Wellness",
    absoluteTitle: true,
    description:
      "Meet Dr. Mondona Goodwin, DO — a board-certified Internal Medicine physician and Menopause Society Certified Practitioner (MSCP) behind CYRA Wellness, a California membership-based practice for women's hormonal and metabolic health.",
    path: "/about",
  });
}

function initials(name: string) {
  return name
    .replace(/,.*$/, "")
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={physicianSchema()} />

      {/* Hero */}
      <Section>
        <FadeUp className="mx-auto max-w-3xl py-4 text-center md:py-8">
          <SectionLabel>{about.label}</SectionLabel>
          <h1 className="heading-hero">{about.heading}</h1>
          <p className="text-subheadline mt-6">{about.subheadline}</p>
        </FadeUp>
      </Section>

      {/* Bio */}
      <Section tone="surface">
        <div className="mx-auto grid max-w-5xl items-start gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <FadeUp>
            {/* Professional headshot placeholder — replace with photography. */}
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-card bg-gradient-to-br from-warm via-white to-accent-light/50 shadow-card">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-surface/60 font-heading text-2xl font-bold text-primary">
                  {initials(about.name)}
                </span>
                <p className="text-small font-medium text-foreground-secondary/80">
                  {about.photoCaption}
                </p>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.12}>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              {about.name}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {about.badges.map((badge, i) => (
                <Badge key={badge} variant={i === 1 ? "accent" : i === 2 ? "warm" : "primary"}>
                  {badge}
                </Badge>
              ))}
            </div>
            <div className="mt-7 space-y-5">
              {about.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-body-copy">
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeUp>
        </div>
        <FadeUp delay={0.1} className="mx-auto mt-16 max-w-3xl text-center">
          <Divider className="my-0 mb-10" />
          <blockquote className="font-heading text-2xl font-semibold leading-snug text-primary md:text-3xl">
            &ldquo;{about.quote}&rdquo;
          </blockquote>
          <p className="mt-6 font-script text-3xl text-primary md:text-4xl">
            {about.signature}
          </p>
          <p className="mt-1 text-small font-semibold uppercase tracking-[0.18em] text-foreground-muted">
            {about.name}
          </p>
        </FadeUp>
      </Section>

      {/* Credentials */}
      <Section className="py-10 md:py-12">
        <FadeUp>
          <ul className="flex flex-wrap items-center justify-center gap-3">
            {about.credentials.map((item) => (
              <li key={item}>
                <Badge variant="outline">{item}</Badge>
              </li>
            ))}
          </ul>
        </FadeUp>
      </Section>

      {/* Final CTA */}
      <Section tone="primary">
        <FadeUp className="mx-auto max-w-2xl py-4 text-center md:py-8">
          <h2 className="font-heading text-section-mobile text-white md:text-section">
            {about.cta.heading}
          </h2>
          <p className="mt-5 font-body text-subhead-mobile font-medium text-white/80 md:text-subhead">
            {about.cta.body}
          </p>
          <div className="mt-8">
            <Link
              href="/book"
              className={cn(buttonVariants({ variant: "accent", size: "lg" }))}
            >
              {about.cta.button}
            </Link>
          </div>
        </FadeUp>
      </Section>
    </>
  );
}
