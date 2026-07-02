"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { QuizQuestion } from "@/lib/quiz";
import { cn } from "@/lib/utils";

interface QuestionStepProps {
  question: QuizQuestion;
  selectedIndex?: number;
  onSelect: (index: number) => void;
  onBack?: () => void;
  onSkip?: () => void;
  isFirst: boolean;
}

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export function QuestionStep({
  question,
  selectedIndex,
  onSelect,
  onBack,
  onSkip,
  isFirst,
}: QuestionStepProps) {
  return (
    <motion.div
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="font-heading text-xl font-semibold text-foreground md:text-2xl">
        {question.question}
      </h2>

      <div className="mt-6 space-y-3">
        {question.options.map((option, i) => {
          const selected = selectedIndex === i;
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onSelect(i)}
              aria-pressed={selected}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-card border-2 px-5 py-4 text-left text-body-copy transition-colors",
                selected
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-surface hover:border-primary/40"
              )}
            >
              <span>{option.label}</span>
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  selected ? "border-primary bg-primary text-white" : "border-border"
                )}
                aria-hidden
              >
                {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isFirst}
          className="text-small font-medium text-foreground-muted transition-colors hover:text-primary disabled:pointer-events-none disabled:opacity-0"
        >
          ← Back
        </button>
        {question.skippable && (
          <button
            type="button"
            onClick={onSkip}
            className="text-small font-medium text-foreground-muted underline-offset-2 transition-colors hover:text-primary hover:underline"
          >
            Skip this question
          </button>
        )}
      </div>
    </motion.div>
  );
}
