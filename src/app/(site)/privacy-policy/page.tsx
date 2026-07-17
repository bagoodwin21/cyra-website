import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { content } from "@/content/site-content";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: content.legalPages.privacy.title,
    description: "CYRA Wellness privacy policy.",
    path: "/privacy-policy",
  });
}

export default function PrivacyPolicyPage() {
  return (
    <PagePlaceholder
      label={content.legalPages.privacy.label}
      title={content.legalPages.privacy.title}
      description={content.legalPages.privacy.description}
    />
  );
}
