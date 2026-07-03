"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { carePlan12Month } from "@/lib/carePlans";
import {
  enrollmentReducer,
  initialEnrollmentState,
} from "@/lib/enrollment";
import { EligibilityStep } from "@/components/enroll/eligibility-step";
import { IneligibleStep } from "@/components/enroll/ineligible-step";
import { PaymentSelectionStep } from "@/components/enroll/payment-selection-step";
import { AgreementStep } from "@/components/enroll/agreement-step";
import { HandoffStep } from "@/components/enroll/handoff-step";
import { CompleteStep } from "@/components/enroll/complete-step";

const stepMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
};

/**
 * The post-discovery-call enrollment flow. All eligibility, money math, and
 * agreement content comes from src/lib — this component only renders state
 * and dispatches events into the tested reducer.
 */
export function EnrollmentFlow() {
  const plan = carePlan12Month;
  const [state, dispatch] = React.useReducer(
    enrollmentReducer,
    plan.id,
    initialEnrollmentState
  );

  return (
    <div className="mx-auto max-w-2xl">
      {!plan.confirmed && (
        <div
          role="status"
          className="mb-8 flex items-start gap-3 rounded-card border-2 border-accent bg-accent/10 p-4"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-foreground" aria-hidden />
          <p className="text-small text-foreground">
            <strong>Pricing pending confirmation.</strong> The figures shown
            are the last referenced numbers and are not yet confirmed as
            current. This page is not linked publicly and should not be shared
            with patients until pricing is confirmed in{" "}
            <code className="text-[0.85em]">src/lib/carePlans.ts</code>.
          </p>
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={state.step} {...stepMotion}>
          {state.step === "eligibility" && (
            <EligibilityStep
              onResult={(result) =>
                dispatch({ type: "SUBMIT_ELIGIBILITY", result })
              }
            />
          )}
          {state.step === "ineligible" && state.eligibility && (
            <IneligibleStep eligibility={state.eligibility} />
          )}
          {state.step === "payment-selection" && (
            <PaymentSelectionStep
              plan={plan}
              paymentIssue={state.paymentIssue}
              selected={state.paymentMethod}
              onSelect={(method) =>
                dispatch({ type: "SELECT_PAYMENT_METHOD", method })
              }
            />
          )}
          {state.step === "agreement" && state.paymentMethod && (
            <AgreementStep
              plan={plan}
              method={state.paymentMethod}
              onBack={() => dispatch({ type: "CHANGE_PAYMENT_METHOD" })}
              onAcknowledge={(acknowledgments) =>
                dispatch({ type: "ACKNOWLEDGE_AGREEMENT", acknowledgments })
              }
            />
          )}
          {state.step === "handoff" && state.paymentMethod && (
            <HandoffStep
              plan={plan}
              method={state.paymentMethod}
              paymentIssue={state.paymentIssue}
              dispatch={dispatch}
            />
          )}
          {state.step === "complete" && state.paymentMethod && (
            <CompleteStep method={state.paymentMethod} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
