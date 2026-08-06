import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { CalendlyEmbed } from "@/components/ui/calendly-embed";
import { buildMetadata } from "@/lib/seo";
import { content } from "@/content/site-content";
import { siteConfig } from "@/lib/site";

const { book } = content;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Schedule your free Discovery Call | CYRA Wellness",
    absoluteTitle: true,
    description:
      "Schedule a free Discovery Call with the CYRA Wellness team.",
    path: "/book/discovery-call",
    // A scheduler step, not a page for search results. /book is the
    // page that should rank.
    noindex: true,
  });
}

export default function DiscoveryCallSchedulerPage() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="heading-section">{book.discovery.schedulerHeading}</h1>
        <p className="text-body-copy mx-auto mt-4 max-w-xl">
          {book.discovery.schedulerIntro}
        </p>
      </div>
      <div className="mx-auto mt-8 max-w-4xl">
        <CalendlyEmbed
          url={book.calendlyUrl}
          fallbackLabel={book.schedulerLabel}
        />
      </div>
      <p className="mt-8 text-center text-small text-foreground-muted">
        {book.textPrompt}{" "}
        <a
          href={`sms:${siteConfig.smsNumber}`}
          className="font-medium text-primary hover:text-primary-light"
        >
          {siteConfig.smsDisplay}
        </a>
      </p>
      <p className="mt-6 text-center">
        <Link
          href="/book"
          className="inline-flex items-center gap-1.5 text-small font-medium text-foreground-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {book.backLabel}
        </Link>
      </p>
    </Section>
  );
}
