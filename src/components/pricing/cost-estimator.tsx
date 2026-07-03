"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeDollarSign, Info, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  carePlans,
  cherryPerPaymentCents,
  displayPrice,
  formatUSD,
  payInFullTotalCents,
} from "@/lib/carePlans";
import { cn } from "@/lib/utils";

type FinancingChoice = "yes" | "no" | "info";

const financingOptions: { value: FinancingChoice; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "info", label: "Tell me more about financing" },
];

const panelMotion = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

export function CostEstimator() {
  const [financing, setFinancing] = React.useState<FinancingChoice | null>(null);
  const [planId, setPlanId] = React.useState(carePlans[0].id);

  // All figures derive from src/lib/carePlans.ts; unconfirmed pricing
  // renders visible placeholders instead of numbers.
  const plan = carePlans.find((p) => p.id === planId) ?? carePlans[0];
  const payments = plan.cherry.paymentCount;
  const perMonth = plan.confirmed
    ? formatUSD(cherryPerPaymentCents(plan))
    : "[X]";
  const fullTotal = displayPrice(payInFullTotalCents(plan), plan.confirmed);

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
                {carePlans.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPlanId(option.id)}
                    aria-pressed={planId === option.id}
                    className={cn(
                      "rounded-full border-2 px-5 py-2.5 text-small font-medium transition-colors",
                      planId === option.id
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-surface text-foreground-secondary hover:border-primary/40"
                    )}
                  >
                    {option.months} months
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
                    Or pay in full: {fullTotal} — with an upfront-payment
                    discount available
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-4 font-heading text-3xl font-bold text-white md:text-4xl">
                    {fullTotal}
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
                <Button
                  variant="accent"
                  className="gap-2"
                  data-analytics-event="financing_check_rate_click"
                >
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
