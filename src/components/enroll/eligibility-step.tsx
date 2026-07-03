"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkEligibilityFromDOB, EligibilityResult } from "@/lib/enrollment";

interface EligibilityStepProps {
  onResult: (result: EligibilityResult) => void;
}

export function EligibilityStep({ onResult }: EligibilityStepProps) {
  const [dob, setDob] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  const valid = /^\d{4}-\d{2}-\d{2}$/.test(dob);

  return (
    <div className="text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CalendarDays className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="mt-5 font-heading text-2xl font-semibold text-foreground md:text-3xl">
        Let&rsquo;s confirm your eligibility
      </h1>
      <p className="text-body-copy mx-auto mt-3 max-w-md">
        First, your date of birth. CYRA is unable to enroll patients who are
        65 or older or under 18, so we check this before anything else.
      </p>

      <form
        className="mx-auto mt-6 max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (valid) onResult(checkEligibilityFromDOB(dob));
        }}
      >
        <label htmlFor="enroll-dob" className="sr-only">
          Date of birth
        </label>
        <input
          id="enroll-dob"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          onBlur={() => setTouched(true)}
          className="h-12 w-full rounded-full border-2 border-border bg-surface px-5 text-center text-body-copy text-foreground outline-none transition-colors focus:border-primary"
        />
        {touched && !valid && (
          <p className="mt-2 text-small text-foreground-muted">
            Enter your date of birth.
          </p>
        )}
        <div className="mt-5">
          <Button type="submit" size="lg" className="w-full">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
