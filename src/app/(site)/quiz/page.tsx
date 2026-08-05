import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { FadeUp } from "@/components/ui/fade-up";
import { buildMetadata } from "@/lib/seo";
import { content } from "@/content/site-content";
import { SymptomQuiz } from "./symptom-quiz";

const { quiz } = content;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Hormone Symptom Quiz for Women | CYRA Wellness",
    absoluteTitle: true,
    description:
      "A free two-minute symptom check. Answer a few questions about your cycle, sleep, mood, and energy, and we'll point you toward the hormonal pattern your symptoms most resemble: PMS, PMDD, perimenopause, menopause, or low testosterone.",
    path: "/quiz",
  });
}

export default function QuizPage() {
  return (
    <>
      <Section>
        <FadeUp className="mx-auto max-w-3xl text-center">
          <SectionLabel>{quiz.label}</SectionLabel>
          <h1 className="heading-hero">{quiz.heading}</h1>
          <p className="text-subheadline mt-6">{quiz.intro}</p>
        </FadeUp>
      </Section>
      <Section tone="surface">
        <FadeUp>
          <SymptomQuiz />
        </FadeUp>
      </Section>
    </>
  );
}
