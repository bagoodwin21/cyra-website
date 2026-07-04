import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { EligibilityCheck } from "@/components/enroll/eligibility-check";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return {
    ...buildMetadata({
      title: "Check Your Eligibility | CYRA Wellness",
      absoluteTitle: true,
      description:
        "Confirm your eligibility for CYRA Wellness care before booking your initial consultation.",
      path: "/eligibility",
    }),
    // Sent to patients after the discovery call, before they book and pay
    // for the initial consultation — not a public landing page.
    robots: { index: false, follow: false },
  };
}

export default function EligibilityPage() {
  return (
    <Section>
      <EligibilityCheck />
    </Section>
  );
}
