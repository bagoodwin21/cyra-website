import type { Metadata } from "next";
import { LegalDocument } from "@/components/layout/legal-document";
import { content } from "@/content/site-content";
import { buildMetadata } from "@/lib/seo";

const { terms } = content.legalPages;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: terms.title,
    description:
      "The terms that apply to the CYRA Wellness website, including appointment and payment policies, financing through Cherry, and the limits of the information published here.",
    path: "/terms-of-service",
  });
}

export default function TermsOfServicePage() {
  return (
    <LegalDocument
      label={terms.label}
      title={terms.title}
      effectiveDate={terms.effectiveDate}
      intro={terms.intro}
      sections={terms.sections}
    />
  );
}
