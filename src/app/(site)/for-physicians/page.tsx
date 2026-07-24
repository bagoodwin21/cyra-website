import type { Metadata } from "next";
import { Check, HeartHandshake, Stethoscope } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { FadeUp } from "@/components/ui/fade-up";
import { buildMetadata } from "@/lib/seo";
import { content } from "@/content/site-content";
import { siteConfig } from "@/lib/site";

const { forPhysicians: fp } = content;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "For Physicians & Referring Providers | CYRA Wellness",
    absoluteTitle: true,
    description:
      "Refer your patients to CYRA Wellness — physician-led hormone care for women across California. Board-certified Internal Medicine, MSCP. We extend your care, we don't replace it.",
    path: "/for-physicians",
  });
}

export default function ForPhysiciansPage() {
  return (
    <>
      {/* Hero */}
      <Section>
        <FadeUp className="mx-auto max-w-3xl text-center">
          <SectionLabel>{fp.label}</SectionLabel>
          <h1 className="heading-section">{fp.heading}</h1>
          <div className="mt-7 space-y-5 text-left sm:text-center">
            {fp.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-body-copy">
                {paragraph}
              </p>
            ))}
          </div>
        </FadeUp>
      </Section>

      {/* Who to refer + collaboration promise */}
      <Section tone="surface">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          <FadeUp>
            <div className="h-full rounded-[3px] border border-border bg-background p-6 shadow-card md:p-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Stethoscope className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-4 font-heading text-2xl font-semibold text-foreground">
                {fp.referHeading}
              </h2>
              <ul className="mt-5 space-y-3.5">
                {fp.referrals.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-body-copy">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
          <FadeUp delay={0.12}>
            <div className="h-full rounded-[3px] border-2 border-primary bg-background p-6 shadow-card md:p-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <HeartHandshake className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-4 font-heading text-2xl font-semibold text-foreground">
                {fp.collaborationHeading}
              </h2>
              <div className="mt-5 space-y-4">
                {fp.collaboration.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-body-copy">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Logistics */}
      <Section>
        <FadeUp className="mx-auto max-w-3xl">
          <h2 className="heading-section text-center">{fp.logisticsHeading}</h2>
          <ul className="mx-auto mt-8 max-w-xl space-y-3.5 rounded-[3px] border border-border bg-background p-6 shadow-card md:p-8">
            {fp.logistics.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                </span>
                <span className="text-body-copy">{item}</span>
              </li>
            ))}
          </ul>
        </FadeUp>
      </Section>

      {/* How to refer / contact */}
      <Section tone="surface">
        <FadeUp className="mx-auto max-w-3xl text-center">
          <h2 className="heading-section">{fp.contactHeading}</h2>
          <p className="text-body-copy mx-auto mt-6 max-w-2xl">{fp.contactBody}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex min-h-12 items-center justify-center rounded-[3px] bg-primary px-6 py-2.5 text-center font-body text-cta font-bold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-accent sm:px-10 sm:tracking-[0.17em]"
            >
              {fp.contactEmailLabel}
            </a>
            <a
              href={`tel:${siteConfig.smsNumber}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-foreground bg-transparent px-6 py-2.5 text-center font-body text-cta font-bold uppercase tracking-[0.12em] text-foreground transition-all duration-200 hover:bg-foreground hover:text-white sm:px-10 sm:tracking-[0.17em]"
            >
              {fp.contactPhoneLabel}: {siteConfig.smsDisplay}
            </a>
          </div>
          <p className="mt-6 text-small text-foreground-muted">
            {siteConfig.email} · {siteConfig.licensedStates}
          </p>
        </FadeUp>
      </Section>
    </>
  );
}
