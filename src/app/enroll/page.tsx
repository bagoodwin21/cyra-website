import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { EnrollmentFlow } from "@/components/enroll/enrollment-flow";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return {
    ...buildMetadata({
      title: "Enroll in Your Care Plan | CYRA Wellness",
      absoluteTitle: true,
      description:
        "Complete your CYRA Wellness care plan enrollment: choose your payment option and review your care plan agreement.",
      path: "/enroll",
    }),
    // Unlinked, post-consultation flow (sent once Dr. Mondona has proposed
    // a care plan) — keep out of search results, especially while pricing
    // is pending confirmation.
    robots: { index: false, follow: false },
  };
}

export default function EnrollPage() {
  return (
    <Section>
      <EnrollmentFlow />
    </Section>
  );
}
