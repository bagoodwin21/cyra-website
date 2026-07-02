"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailGateStepProps {
  onSubmit: (email: string) => void;
  onSkip: () => void;
  submitting: boolean;
}

export function EmailGateStep({ onSubmit, onSkip, submitting }: EmailGateStepProps) {
  const [email, setEmail] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Mail className="h-6 w-6" aria-hidden />
      </span>
      <h2 className="mt-5 font-heading text-xl font-semibold text-foreground md:text-2xl">
        Get your results emailed to you
      </h2>
      <p className="text-body-copy mx-auto mt-3 max-w-md">
        Your personalized results are ready. Enter your email to save a copy
        for later, or skip straight to your results.
      </p>

      <form
        className="mx-auto mt-6 max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (valid) onSubmit(email);
        }}
      >
        <label htmlFor="quiz-email" className="sr-only">
          Email address
        </label>
        <input
          id="quiz-email"
          type="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          className="h-12 w-full rounded-full border-2 border-border bg-surface px-5 text-center text-body-copy text-foreground outline-none transition-colors focus:border-primary"
        />
        {touched && !valid && (
          <p className="mt-2 text-small text-foreground-muted">
            Enter a valid email address.
          </p>
        )}
        <div className="mt-5 flex flex-col items-center gap-3">
          <Button type="submit" variant="accent" size="lg" disabled={submitting} className="w-full">
            {submitting ? "Sending…" : "Email Me My Results"}
          </Button>
          <button
            type="button"
            onClick={onSkip}
            className="text-small font-medium text-foreground-muted underline-offset-2 transition-colors hover:text-primary hover:underline"
          >
            Skip — just show me my results
          </button>
        </div>
      </form>
    </motion.div>
  );
}
