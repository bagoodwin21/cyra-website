"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ProgressBar } from "@/components/quiz/progress-bar";
import { QuestionStep } from "@/components/quiz/question-step";
import { EmailGateStep } from "@/components/quiz/email-gate-step";
import { ResultsStep } from "@/components/quiz/results-step";
import { submitToHubspot } from "@/lib/hubspot";
import {
  computeQuizResult,
  quizQuestions,
  type ConditionSlug,
  type QuizAnswers,
  type ResultTier,
} from "@/lib/quiz";

type Phase = "questions" | "email" | "results";

const VALID_TIERS: ResultTier[] = ["tier1", "tier2", "tier3"];

/**
 * The full assessment flow: 12 questions → soft email gate → tiered
 * results. Self-contained client component so it can be embedded on any
 * page as well as rendered standalone at /quiz.
 *
 * Shareable results: reaching the results screen writes ?result=<tier>
 * into the URL, and landing with ?result=<tier> already present jumps
 * straight to that tier's (generic) results.
 */
export function SymptomQuiz() {
  const searchParams = useSearchParams();
  const sharedTier = searchParams.get("result") as ResultTier | null;
  const startAtResults = sharedTier !== null && VALID_TIERS.includes(sharedTier);

  const [phase, setPhase] = React.useState<Phase>(
    startAtResults ? "results" : "questions"
  );
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<QuizAnswers>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<{
    tier: ResultTier;
    topConditions: ConditionSlug[];
  }>(() =>
    startAtResults
      ? { tier: sharedTier, topConditions: [] }
      : { tier: "tier3", topConditions: [] }
  );

  const question = quizQuestions[step];

  const goToResults = (finalAnswers: QuizAnswers) => {
    const computed = computeQuizResult(finalAnswers);
    setResult({ tier: computed.tier, topConditions: computed.topConditions });
    setPhase("results");
    // Make the result shareable without triggering a navigation.
    const url = new URL(window.location.href);
    url.searchParams.set("result", computed.tier);
    window.history.replaceState(null, "", url.toString());
    return computed;
  };

  const advance = (nextAnswers: QuizAnswers) => {
    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    } else {
      setPhase("email");
    }
    return nextAnswers;
  };

  const handleSelect = (optionIndex: number) => {
    const nextAnswers = { ...answers, [question.id]: optionIndex };
    setAnswers(nextAnswers);
    // Brief pause so the selection state is visible before the transition.
    setTimeout(() => advance(nextAnswers), 220);
  };

  const handleSkip = () => {
    const nextAnswers = { ...answers };
    delete nextAnswers[question.id];
    setAnswers(nextAnswers);
    advance(nextAnswers);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleEmailSubmit = async (email: string) => {
    setSubmitting(true);
    const computed = computeQuizResult(answers);
    await submitToHubspot([
      { name: "email", value: email },
      { name: "quiz_result_tier", value: computed.tier },
      { name: "quiz_score_percent", value: String(computed.percent) },
      { name: "quiz_top_conditions", value: computed.topConditions.join(", ") },
    ]);
    setSubmitting(false);
    goToResults(answers);
  };

  const handleRetake = () => {
    setAnswers({});
    setStep(0);
    setPhase("questions");
    const url = new URL(window.location.href);
    url.searchParams.delete("result");
    window.history.replaceState(null, "", url.toString());
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      {phase === "questions" && (
        <ProgressBar step={step + 1} total={quizQuestions.length} />
      )}

      <div className={phase === "questions" ? "mt-8" : undefined}>
        <AnimatePresence mode="wait" initial={false}>
          {phase === "questions" && (
            <QuestionStep
              key={question.id}
              question={question}
              selectedIndex={answers[question.id]}
              onSelect={handleSelect}
              onBack={handleBack}
              onSkip={question.skippable ? handleSkip : undefined}
              isFirst={step === 0}
            />
          )}

          {phase === "email" && (
            <EmailGateStep
              key="email-gate"
              onSubmit={handleEmailSubmit}
              onSkip={() => goToResults(answers)}
              submitting={submitting}
            />
          )}

          {phase === "results" && (
            <ResultsStep
              key="results"
              tier={result.tier}
              topConditions={result.topConditions}
              onRetake={handleRetake}
            />
          )}
        </AnimatePresence>
      </div>

      {phase === "email" && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setPhase("questions")}
            className="text-small font-medium text-foreground-muted transition-colors hover:text-primary"
          >
            ← Back to questions
          </button>
        </div>
      )}
    </div>
  );
}
