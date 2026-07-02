import type { Metadata } from "next";
import { Suspense } from "react";
import { ClipboardList, Clock, Lock } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { FadeUp } from "@/components/ui/fade-up";
import { SymptomQuiz } from "@/components/quiz/symptom-quiz";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Hormone Symptom Assessment Quiz",
    description:
      "A free 12-question hormone symptom assessment. Find out whether your symptoms point to perimenopause, menopause, low testosterone, or thyroid issues — and whether physician-led care could help.",
    path: "/quiz",
  });
}

const reassurance = [
  { Icon: Clock, label: "Takes about 2 minutes" },
  { Icon: ClipboardList, label: "12 quick questions" },
  { Icon: Lock, label: "No account required" },
];

export default function QuizPage() {
  return (
    <>
      <Section className="pb-6 md:pb-10">
        <FadeUp className="mx-auto max-w-3xl py-4 text-center md:py-6">
          <SectionLabel>Free Assessment</SectionLabel>
          <h1 className="heading-hero">
            Is it your hormones? Find out in 2 minutes.
          </h1>
          <p className="text-subheadline mt-6">
            Answer 12 quick questions about what you&rsquo;re experiencing and
            get a personalized read on whether hormone care could help — and
            which areas are worth discussing with Dr. Mondona.
          </p>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3">
            {reassurance.map(({ Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-small font-medium text-foreground-secondary"
              >
                <Icon className="h-4 w-4 text-primary" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </FadeUp>
      </Section>

      <Section tone="surface">
        <Suspense>
          <SymptomQuiz />
        </Suspense>
      </Section>
    </>
  );
}
