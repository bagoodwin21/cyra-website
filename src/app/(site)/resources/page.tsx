import type { Metadata } from "next";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { FadeUp } from "@/components/ui/fade-up";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";
import { content } from "@/content/site-content";
import { siteConfig } from "@/lib/site";

const { resources } = content;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Trusted Resources | CYRA Wellness",
    absoluteTitle: true,
    description:
      "Independent providers Dr. Goodwin partners with and recommends: pelvic floor physical therapists, trainers, dietitians, and more.",
    path: "/resources",
  });
}

export default function ResourcesPage() {
  const hasPartners = resources.categories.some((c) => c.partners.length > 0);

  return (
    <>
      <Section>
        <FadeUp className="mx-auto max-w-3xl text-center">
          <SectionLabel>{resources.label}</SectionLabel>
          <h1 className="heading-section">{resources.heading}</h1>
          <p className="text-subheadline mt-6">{resources.intro}</p>
        </FadeUp>
      </Section>

      <Section tone="surface">
        {hasPartners ? (
          <div className="mx-auto max-w-5xl space-y-14">
            {resources.categories
              .filter((category) => category.partners.length > 0)
              .map((category) => (
                <FadeUp key={category.name}>
                  <h2 className="text-center font-heading text-2xl font-semibold text-foreground md:text-3xl">
                    {category.name}
                  </h2>
                  <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {category.partners.map((partner) => (
                      <Card key={partner.name} className="h-full">
                        <CardTitle className="text-lg md:text-xl">
                          {partner.name}
                        </CardTitle>
                        {partner.credentials && (
                          <p className="mt-1 text-small font-semibold uppercase tracking-[0.1em] text-primary">
                            {partner.credentials}
                          </p>
                        )}
                        {partner.location && (
                          <p className="mt-2 flex items-center gap-1.5 text-small text-foreground-muted">
                            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                            {partner.location}
                          </p>
                        )}
                        {partner.blurb && (
                          <CardDescription className="mt-3">
                            {partner.blurb}
                          </CardDescription>
                        )}
                        {partner.url && (
                          <a
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-1.5 font-body text-cta font-bold uppercase tracking-[0.15em] text-primary transition-colors hover:text-primary-light"
                          >
                            Visit website
                            <ArrowUpRight className="h-4 w-4" aria-hidden />
                          </a>
                        )}
                      </Card>
                    ))}
                  </div>
                </FadeUp>
              ))}
          </div>
        ) : (
          <FadeUp className="mx-auto max-w-2xl">
            <div className="rounded-[3px] border border-border bg-background p-8 text-center shadow-card">
              <p className="text-body-copy">{resources.emptyNote}</p>
              <a
                href={`sms:${siteConfig.smsNumber}`}
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-[3px] bg-primary px-6 py-2.5 text-center font-body text-cta font-bold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-accent sm:px-10 sm:tracking-[0.17em]"
              >
                Text us: {siteConfig.smsDisplay}
              </a>
            </div>
          </FadeUp>
        )}
        <p className="mx-auto mt-12 max-w-2xl text-center text-small text-foreground-muted">
          {resources.disclaimer}
        </p>
      </Section>
    </>
  );
}
