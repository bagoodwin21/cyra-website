import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Section } from "@/components/ui/section";
import { CalendlyPlaceholder } from "@/components/ui/calendly-placeholder";
import { buildMetadata } from "@/lib/seo";
import { content } from "@/content/site-content";
import { siteConfig } from "@/lib/site";

const { book } = content;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Request More Information | CYRA Wellness",
    absoluteTitle: true,
    description:
      "Request more information from CYRA Wellness — women's hormonal health telehealth in California. Book a free Discovery Call with our Patient Care Coordinator or your 60-minute comprehensive consultation.",
    path: "/book",
  });
}

export default function BookPage() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="heading-section">{book.heading}</h1>
        <p className="text-subheadline mt-5">{book.subheadline}</p>
        <ul className="mx-auto mt-8 flex max-w-2xl flex-col items-start gap-3 sm:items-center">
          {book.reassurances.map((point) => (
            <li key={point} className="flex items-start gap-3 text-left">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
              </span>
              <span className="text-body-copy">{point}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto mt-12 max-w-4xl">
        <CalendlyPlaceholder label={book.schedulerLabel} className="min-h-[480px]" />
      </div>
      <p className="mt-8 text-center text-small text-foreground-muted">
        {book.emailPrompt}{" "}
        <a
          href={`mailto:${siteConfig.email}`}
          className="font-medium text-primary hover:text-primary-light"
        >
          {siteConfig.email}
        </a>
      </p>
    </Section>
  );
}
