import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Section } from "@/components/ui/section";
import { CherryCalculator } from "@/components/pricing/cherry-calculator";
import { buildMetadata } from "@/lib/seo";
import { content } from "@/content/site-content";
import { siteConfig } from "@/lib/site";

const { book } = content;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Book Your Visit | CYRA Wellness",
    absoluteTitle: true,
    description:
      "Request more information from CYRA Wellness, women's hormonal health telehealth in California. Book a free Discovery Call with our Patient Care Coordinator or your 60-minute comprehensive consultation.",
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
      {/* What it costs, before either booking option */}
      <div className="mx-auto mt-10 max-w-2xl rounded-[3px] border border-border bg-surface p-6 md:p-7">
        <p className="text-body-copy">
          <span className="font-semibold text-foreground">
            {book.costs.consultHeading}
          </span>{" "}
          {book.costs.consultBody}
        </p>
        <p className="text-body-copy mt-4">
          <span className="font-semibold text-foreground">
            {book.costs.membershipHeading}
          </span>{" "}
          {book.costs.membershipBody}
        </p>
      </div>
      {/* The two booking paths, side by side */}
      <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
        {[book.consult, book.discovery].map((option) => {
          const isConsult = "bookingUrl" in option;
          return (
            <div
              key={option.title}
              className={
                isConsult
                  ? "flex flex-col rounded-[3px] border-2 border-primary bg-background p-6 shadow-card md:p-8"
                  : "flex flex-col rounded-[3px] border border-border bg-background p-6 shadow-card md:p-8"
              }
            >
              <p className="text-small font-semibold uppercase tracking-[0.1em] text-primary">
                {option.meta}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                {option.title}
              </h2>
              <p className="text-body-copy mt-3 flex-1">{option.body}</p>
              <div className="mt-6">
                <Link
                  href={isConsult ? "/book/consultation" : "/book/discovery-call"}
                  data-analytics-event={
                    isConsult
                      ? "book_consult_click"
                      : "book_discovery_call_click"
                  }
                  className="inline-flex w-full min-h-12 items-center justify-center rounded-[3px] bg-primary px-6 py-2.5 text-center font-body text-cta font-bold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-accent sm:tracking-[0.17em]"
                >
                  {option.ctaLabel}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      {/* Financing, below the booking choice so it never pushes the two
          options out of view. */}
      <div className="mx-auto mt-10 max-w-2xl">
        <CherryCalculator />
      </div>
      {/* The schedulers live on their own pages: one embed per page keeps
          this page fast, and each choice shows up as its own page view. */}
      <p className="mt-12 text-center text-small text-foreground-muted">
        {book.textPrompt}{" "}
        <a
          href={`sms:${siteConfig.smsNumber}`}
          className="font-medium text-primary hover:text-primary-light"
        >
          {siteConfig.smsDisplay}
        </a>
        {" · "}
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
