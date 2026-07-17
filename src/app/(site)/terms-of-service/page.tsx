import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { content } from "@/content/site-content";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: content.legalPages.terms.title,
    description: "CYRA Wellness terms of service.",
    path: "/terms-of-service",
  });
}

export default function TermsOfServicePage() {
  return (
    <PagePlaceholder
      label={content.legalPages.terms.label}
      title={content.legalPages.terms.title}
      description={content.legalPages.terms.description}
    />
  );
}
