"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handoffConfig } from "@/lib/carePlans";
import { EligibilityResult } from "@/lib/enrollment";
import { EligibilityStep } from "@/components/enroll/eligibility-step";
import { IneligibleStep } from "@/components/enroll/ineligible-step";

const stepMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
};

/**
 * Pre-booking eligibility check (/eligibility). Runs the Medicare gate
 * BEFORE the patient books and pays for the initial consultation, so an
 * ineligible patient is routed out before any money changes hands. The
 * same gate runs again at the top of /enroll as a backstop.
 */
export function EligibilityCheck() {
  const [result, setResult] = React.useState<EligibilityResult | null>(null);

  return (
    <div className="mx-auto max-w-2xl">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={result === null ? "check" : result.status}
          {...stepMotion}
        >
          {result === null && <EligibilityStep onResult={setResult} />}
          {result !== null && !result.eligible && (
            <IneligibleStep eligibility={result} />
          )}
          {result !== null && result.eligible && (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CalendarCheck className="h-6 w-6" aria-hidden />
              </span>
              <h1 className="mt-5 font-heading text-2xl font-semibold text-foreground md:text-3xl">
                You&rsquo;re eligible — let&rsquo;s book your consultation
              </h1>
              <p className="text-body-copy mx-auto mt-4 max-w-md">
                Your next step is booking your initial consultation with
                Dr. Mondona. The consultation fee is charged when you book
                and reserves your visit — there&rsquo;s no obligation to
                continue with a care plan afterward.
              </p>
              <div className="mt-6">
                {handoffConfig.optiMantraBookingUrl ? (
                  <a
                    href={handoffConfig.optiMantraBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button variant="accent" size="lg" className="gap-2">
                      Book My Consultation
                      <ExternalLink className="h-4 w-4" aria-hidden />
                    </Button>
                  </a>
                ) : (
                  <p className="mx-auto max-w-md rounded-card border border-border bg-surface p-4 text-small text-foreground-secondary">
                    Our care coordinator will send you your booking link —
                    keep an eye on your email or texts.
                  </p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
