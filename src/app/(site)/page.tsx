import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Baby,
  Bone,
  Brain,
  CalendarClock,
  Check,
  Droplets,
  Flower2,
  Heart,
  HeartHandshake,
  HeartPulse,
  Moon,
  PiggyBank,
  Pill,
  Scale,
  Sparkles,
  Sunrise,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { FadeUp } from "@/components/ui/fade-up";
import { FAQItem } from "@/components/ui/faq-item";
import {
  TestimonialCarousel,
  type Testimonial,
} from "@/components/ui/testimonial-carousel";
import { JsonLd } from "@/components/seo/json-ld";
import { medicalBusinessSchema, faqPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { content } from "@/content/site-content";
import { cn } from "@/lib/utils";

const { home } = content;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title:
      "Women's Hormonal Health | Perimenopause, Menopause & More | California Telehealth",
    description: content.brand.description,
    path: "/",
  });
}

/* Icons pair with the content lists below, matched by position. Icons are
   layout, not copy — they live here so the content file stays plain text. */
const trustIcons: LucideIcon[] = [Flower2, Droplets, CalendarClock, Heart];
const affectIcons: LucideIcon[] = [Bone, Scale, HeartPulse, Droplets, Brain, Heart];
const treatIcons: LucideIcon[] = [
  Sunrise,
  Flower2,
  CalendarClock,
  Baby,
  Droplets,
  HeartPulse,
  Scale,
  Activity,
  Zap,
  Moon,
  Pill,
];

const testimonials: Testimonial[] = home.testimonials.items.map((t) => ({ ...t }));

/** Renders a headline where text wrapped in *asterisks* becomes an italic accent. */
function AccentHeadline({ text, className }: { text: string; className?: string }) {
  const parts = text.split("*");
  return (
    <h1 className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className="italic text-primary">
            {part}
          </em>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </h1>
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={medicalBusinessSchema()} />
      <JsonLd data={faqPageSchema(home.faq.items)} />

      {/* Section 1 — Hero */}
      <section className="flex min-h-[calc(100vh-4.5rem)] items-center hero-gradient">
        <div className="mx-auto w-full max-w-3xl px-6 py-24 text-center lg:px-8">
          <FadeUp>
            <p className="font-script text-3xl text-primary md:text-4xl">
              {home.hero.eyebrow}
            </p>
            <AccentHeadline text={home.hero.headline} className="heading-hero mt-4" />
            <p className="text-subheadline mx-auto mt-7 max-w-xl">
              {home.hero.subheadline}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/book"
                className={cn(buttonVariants({ variant: "accent", size: "lg" }))}
              >
                {home.hero.primaryCta}
              </Link>
              <Link
                href="/#how-to-join"
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                {home.hero.secondaryCta}
              </Link>
            </div>
            <ul className="mt-12 flex flex-wrap justify-center gap-x-7 gap-y-3">
              {home.hero.trustPoints.map((label, i) => {
                const Icon = trustIcons[i % trustIcons.length];
                return (
                  <li
                    key={label}
                    className="flex items-center gap-2 text-small font-medium text-foreground-secondary"
                  >
                    <Icon className="h-4 w-4 text-primary" aria-hidden />
                    {label}
                  </li>
                );
              })}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* Section 2 — Philosophy: more than hot flashes */}
      <Section>
        <FadeUp className="mx-auto max-w-3xl text-center">
          <SectionLabel>{home.philosophy.label}</SectionLabel>
          <h2 className="heading-section">{home.philosophy.heading}</h2>
          <div className="mt-7 space-y-5 text-left sm:text-center">
            {home.philosophy.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-body-copy">
                {paragraph}
              </p>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={0.15}>
          <p className="mx-auto mt-10 max-w-2xl text-center font-heading text-xl font-semibold text-primary md:text-2xl">
            {home.philosophy.pullQuote}
          </p>
        </FadeUp>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {home.philosophy.affects.map(({ title, body }, i) => {
            const Icon = affectIcons[i % affectIcons.length];
            return (
              <FadeUp key={title} delay={(i % 3) * 0.1}>
                <Card lift={false} className="h-full">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
                  </div>
                  <CardDescription className="mt-3">{body}</CardDescription>
                </Card>
              </FadeUp>
            );
          })}
        </div>
      </Section>

      {/* Section 3 — Collaborative approach */}
      <Section tone="surface">
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <FadeUp>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HeartHandshake className="h-6 w-6" aria-hidden />
            </span>
            <SectionLabel className="mt-5">{home.collaborative.label}</SectionLabel>
            <h2 className="heading-section">{home.collaborative.heading}</h2>
          </FadeUp>
          <FadeUp delay={0.12} className="space-y-5">
            {home.collaborative.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-body-copy">
                {paragraph}
              </p>
            ))}
          </FadeUp>
        </div>
      </Section>

      {/* Section 4 — What we treat */}
      <Section>
        <FadeUp className="mx-auto max-w-3xl text-center">
          <SectionLabel>{home.whatWeTreat.label}</SectionLabel>
          <h2 className="heading-section">{home.whatWeTreat.heading}</h2>
        </FadeUp>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {home.whatWeTreat.items.map(({ title, body }, i) => {
            const Icon = treatIcons[i % treatIcons.length];
            return (
              <FadeUp key={title} delay={(i % 4) * 0.08}>
                <Card className="h-full">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <CardTitle className="mt-4 text-lg md:text-xl">{title}</CardTitle>
                  <CardDescription className="mt-2">{body}</CardDescription>
                </Card>
              </FadeUp>
            );
          })}
        </div>
      </Section>

      {/* Section 5 — Testosterone */}
      <Section tone="surface">
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
          <FadeUp>
            <SectionLabel>{home.testosterone.label}</SectionLabel>
            <h2 className="heading-section">{home.testosterone.heading}</h2>
          </FadeUp>
          <FadeUp delay={0.12} className="space-y-5">
            {home.testosterone.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-body-copy">
                {paragraph}
              </p>
            ))}
          </FadeUp>
        </div>
      </Section>

      {/* Section 6 — Is CYRA right for you? */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <FadeUp className="text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" aria-hidden />
            </span>
            <SectionLabel className="mt-5">{home.rightForYou.label}</SectionLabel>
            <h2 className="heading-section">{home.rightForYou.heading}</h2>
            <p className="text-subheadline mt-5">{home.rightForYou.intro}</p>
          </FadeUp>
          <FadeUp delay={0.12} className="mx-auto mt-10 max-w-xl">
            <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {home.rightForYou.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  <span className="text-body-copy">{item}</span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </Section>

      {/* Section 7 — How to join (3 steps) */}
      <Section tone="surface" id="how-to-join" className="scroll-mt-24">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <SectionLabel>{home.howToJoin.label}</SectionLabel>
          <h2 className="heading-section">{home.howToJoin.heading}</h2>
          <p className="text-subheadline mt-5">{home.howToJoin.intro}</p>
        </FadeUp>
        <ol className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-3">
          {home.howToJoin.steps.map((step, i) => (
            <FadeUp key={step.title} delay={i * 0.12}>
              <li className="flex h-full flex-col rounded-[3px] border border-border border-t-[3px] border-t-primary-light bg-background p-6 shadow-card md:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-heading text-lg font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <span className="mt-1 text-small font-semibold text-accent-dark">
                  {step.meta}
                </span>
                <p className="text-body-copy mt-3">{step.body}</p>
              </li>
            </FadeUp>
          ))}
        </ol>
        <FadeUp delay={0.3} className="mt-12 text-center">
          <Link href="/book" className={cn(buttonVariants({ variant: "accent" }))}>
            {content.nav.cta}
          </Link>
        </FadeUp>
      </Section>

      {/* Section 8 — Membership inclusions + pricing */}
      <Section id="membership" className="scroll-mt-24">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <SectionLabel>{home.carePlan.label}</SectionLabel>
          <h2 className="heading-section">{home.carePlan.heading}</h2>
          <p className="text-subheadline mt-5">{home.carePlan.intro}</p>
        </FadeUp>
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-2">
          {/* Inclusions */}
          <FadeUp>
            <ul className="h-full space-y-3.5 rounded-[3px] border border-border bg-background p-6 shadow-card md:p-8">
              {home.carePlan.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  <span className="text-body-copy">{item}</span>
                </li>
              ))}
            </ul>
          </FadeUp>

          {/* Pricing */}
          <FadeUp delay={0.12}>
            <div className="flex h-full flex-col rounded-[3px] border-2 border-primary bg-background p-6 shadow-card md:p-8">
              <h3 className="font-heading text-2xl font-semibold text-foreground">
                {home.carePlan.pricingHeading}
              </h3>
              <p className="text-body-copy mt-2">{home.carePlan.pricingSubhead}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[home.carePlan.options.financing, home.carePlan.options.upfront].map(
                  (option) => (
                    <div
                      key={option.label}
                      className="rounded-[3px] border border-border bg-surface/60 p-4"
                    >
                      <p className="text-small font-semibold uppercase tracking-[0.1em] text-primary">
                        {option.label}
                      </p>
                      <p className="mt-2 font-heading text-2xl font-bold text-foreground">
                        {option.price}
                      </p>
                      <p className="mt-1 text-small text-foreground-muted">
                        {option.detail}
                      </p>
                    </div>
                  ),
                )}
              </div>
              <p className="mt-6 border-t border-border pt-5 text-small text-foreground-muted">
                {home.carePlan.note}
              </p>
              <div className="mt-6">
                <Link
                  href="/book"
                  data-analytics-event="financing_check_rate_click"
                  className={cn(buttonVariants({ variant: "accent" }), "w-full")}
                >
                  {content.nav.cta}
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
        <FadeUp delay={0.2} className="mt-12 text-center">
          <p className="text-body-copy">{home.compareTeaser.text}</p>
          <Link
            href="/compare"
            className="mt-2 inline-flex items-center gap-1.5 font-body text-cta font-bold uppercase tracking-[0.15em] text-primary transition-colors hover:text-primary-light"
          >
            {home.compareTeaser.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </FadeUp>
      </Section>

      {/* Section 9 — Insurance & cost savings */}
      <Section tone="surface">
        <div className="mx-auto max-w-3xl">
          <FadeUp className="text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <PiggyBank className="h-6 w-6" aria-hidden />
            </span>
            <SectionLabel className="mt-5">{home.insurance.label}</SectionLabel>
            <h2 className="heading-section">{home.insurance.heading}</h2>
            <p className="text-subheadline mt-5">{home.insurance.intro}</p>
          </FadeUp>
          <FadeUp delay={0.12} className="mt-10">
            <ul className="mx-auto max-w-xl space-y-3.5 rounded-[3px] border border-border bg-background p-6 shadow-card md:p-8">
              {home.insurance.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  <span className="text-body-copy">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mx-auto mt-6 max-w-xl text-center text-small text-foreground-muted">
              {home.insurance.note}
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* Section 10 — Testimonials */}
      <Section>
        <FadeUp className="mx-auto max-w-3xl text-center">
          <SectionLabel>{home.testimonials.label}</SectionLabel>
          <h2 className="heading-section">{home.testimonials.heading}</h2>
        </FadeUp>
        <FadeUp delay={0.15} className="mt-12">
          <TestimonialCarousel items={testimonials} />
        </FadeUp>
      </Section>

      {/* Section 11 — FAQ */}
      <Section tone="surface">
        <div className="mx-auto max-w-3xl">
          <FadeUp className="text-center">
            <SectionLabel>{home.faq.label}</SectionLabel>
            <h2 className="heading-section">{home.faq.heading}</h2>
          </FadeUp>
          <FadeUp delay={0.1} className="mt-10">
            {home.faq.items.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </FadeUp>
        </div>
      </Section>

      {/* Section 12 — Final CTA */}
      <Section tone="primary">
        <FadeUp className="mx-auto max-w-2xl py-4 text-center md:py-8">
          <h2 className="font-heading text-section-mobile text-white md:text-section">
            {home.finalCta.heading}
          </h2>
          <p className="mt-5 font-body text-subhead-mobile font-medium text-white/80 md:text-subhead">
            {home.finalCta.body}
          </p>
          <div className="mt-8">
            <Link
              href="/book"
              className={cn(buttonVariants({ variant: "accent", size: "lg" }))}
            >
              {home.finalCta.cta}
            </Link>
          </div>
          <p className="mt-8 text-small text-white/70">{home.finalCta.footnote}</p>
        </FadeUp>
      </Section>
    </>
  );
}
