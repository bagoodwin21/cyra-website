"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeDollarSign, Info, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { carePlanTotal } from "@/lib/site";
import { cn } from "@/lib/utils";

type FinancingChoice = "yes" | "no" | "info";

const financingOptions: { value: FinancingChoice; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "info", label: "Tell me more about financing" },
];

/** Care plan lengths on offer. Extend this array as new tiers launch. */
const planLengths = [{ months: 12, label: "12 months" }];

/** Cherry splits a 12-month plan into 13 equal payments. */
const cherryPaymentCount = (months: number) => months + 1;

/**
 * Formats the monthly Cherry payment. While the care plan total is still
 * the [CARE_PLAN_TOTAL] placeholder this returns a visible [X] placeholder;
 * once a real number (e.g. "$4,800") lands in src/lib/site.ts the split
 * computes automatically.
 */
function monthlyPayment(total: string, payments: number): string {
  const numeric = Number(total.replace(/[^0-9.]/g, ""));
  if (total.startsWith("[") || !Number.isFinite(numeric) || numeric <= 0) {
    return "[X]";
  }
  return `$${Math.ceil(numeric / payments).toLocaleString()}`;
}

const panelMotion = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

export function CostEstimator() {
  const [financing, setFinancing] = React.useState<FinancingChoice | null>(null);
  const [months, setMonths] = React.useState(12);

  const payments = cherryPaymentCount(months);
  const perMonth = monthlyPayment(carePlanTotal, payments);

  return (
    <div className="mx-auto max-w-2xl rounded-card border border-border bg-surface p-6 shadow-card md:p-10">
      {/* Step 1 — financing interest */}
      <div>
        <p className="text-small font-semibold uppercase tracking-[0.18em] text-primary">
          Step 1
        </p>
        <h3 className="mt-2 font-heading text-xl font-semibold text-foreground">
          Are you interested in financing your care plan?
        </h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {financingOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFinancing(option.value)}
              aria-pressed={financing === option.value}
              className={cn(
                "rounded-full border-2 px-5 py-2.5 text-small font-medium transition-colors",
                financing === option.value
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-foreground-secondary hover:border-primary/40"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {financing === "info" && (
          <motion.div key="info" {...panelMotion} className="overflow-hidden">
            <div className="mt-6 rounded-card bg-accent/10 p-5 md:p-6">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <div>
                  <p className="font-body text-body font-semibold text-foreground">
                    How Cherry financing works
                  </p>
                  <p className="text-body-copy mt-2">
                    Cherry is a patient financing partner that splits your care
                    plan into equal monthly payments with approved credit —
                    no lump sum required. Checking your rate takes about a
                    minute and doesn&rsquo;t affect your credit score. Prefer
                    to pay upfront instead? A discount is available for paying
                    in full.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2 — plan length */}
      <AnimatePresence initial={false}>
        {financing !== null && (
          <motion.div key="step2" {...panelMotion} className="overflow-hidden">
            <div className="mt-8 border-t border-border pt-8">
              <p className="text-small font-semibold uppercase tracking-[0.18em] text-primary">
                Step 2
              </p>
              <h3 className="mt-2 font-heading text-xl font-semibold text-foreground">
                How many months is your care plan?
              </h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {planLengths.map((plan) => (
                  <button
                    key={plan.months}
                    type="button"
                    onClick={() => setMonths(plan.months)}
                    aria-pressed={months === plan.months}
                    className={cn(
                      "rounded-full border-2 px-5 py-2.5 text-small font-medium transition-colors",
                      months === plan.months
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-surface text-foreground-secondary hover:border-primary/40"
                    )}
                  >
                    {plan.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence initial={false}>
        {financing !== null && (
          <motion.div key="result" {...panelMotion} className="overflow-hidden">
            <div className="mt-8 rounded-card bg-primary p-6 text-center md:p-8">
              <p className="text-small font-semibold uppercase tracking-[0.18em] text-white/70">
                Your estimate
              </p>
              {financing !== "no" ? (
                <>
                  <p className="mt-4 font-heading text-3xl font-bold text-white md:text-4xl">
                    {perMonth}
                    <span className="font-body text-lg font-medium text-white/80">
                      /month
                    </span>
                  </p>
                  <p className="mt-2 text-small text-white/80">
                    With Cherry financing: {perMonth}/month for {payments}{" "}
                    payments, with approved credit
                  </p>
                  <p className="mt-1 text-small text-white/80">
                    Or pay in full: {carePlanTotal} — with an upfront-payment
                    discount available
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-4 font-heading text-3xl font-bold text-white md:text-4xl">
                    {carePlanTotal}
                  </p>
                  <p className="mt-2 text-small text-white/80">
                    Paid in full — ask about the discount for paying upfront.
                    Cherry monthly payments remain available if you change
                    your mind.
                  </p>
                </>
              )}
              <p className="mt-5 border-t border-white/15 pt-4 text-small text-white/70">
                Rate may vary based on Cherry credit approval. Check your rate
                without affecting your credit score.
              </p>
              <div className="mt-5">
                {/* Cherry rate-check link placeholder — point at the
                    practice's Cherry application URL once available. */}
                <Button variant="accent" className="gap-2">
                  <Wallet className="h-4 w-4" aria-hidden />
                  Check Your Rate with Cherry
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {financing === null && (
        <p className="mt-6 flex items-center gap-2 text-small text-foreground-muted">
          <BadgeDollarSign className="h-4 w-4 text-accent" aria-hidden />
          Answer above to see your personalized estimate.
        </p>
      )}
    </div>
  );
}
