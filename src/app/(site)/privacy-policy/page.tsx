import type { Metadata } from "next";
import { LegalDocument } from "@/components/layout/legal-document";
import { content } from "@/content/site-content";
import { buildMetadata } from "@/lib/seo";

const { privacy } = content.legalPages;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: privacy.title,
    description:
      "How CYRA Wellness handles information collected through this website, and where patient health information is covered instead by HIPAA and our Notice of Privacy Practices.",
    path: "/privacy-policy",
  });
}

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      label={privacy.label}
      title={privacy.title}
      effectiveDate={privacy.effectiveDate}
      intro={privacy.intro}
      sections={privacy.sections}
    />
  );
}
