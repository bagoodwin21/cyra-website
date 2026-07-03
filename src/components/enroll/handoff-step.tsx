"use client";

import * as React from "react";
import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarePlan, PaymentMethodId, handoffConfig } from "@/lib/carePlans";
import { EnrollmentEvent, PaymentIssue } from "@/lib/enrollment";

interface HandoffStepProps {
  plan: CarePlan;
  method: PaymentMethodId;
  paymentIssue: PaymentIssue | null;
  dispatch: (event: EnrollmentEvent) => void;
}

/**
 * Post-agreement handoff to the third-party systems that actually take
 * payment: Cherry (financing application) or OptiMantra (secure card on
 * file). Links come from handoffConfig and are null until Brandon wires the
 * real URLs — the manual instructions below are the documented fallback.
 */
export function HandoffStep({
  plan,
  method,
  paymentIssue,
  dispatch,
}: HandoffStepProps) {
  return (
    <div className="text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ShieldCheck className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="mt-5 font-heading text-2xl font-semibold text-foreground md:text-3xl">
        {method === "cherry"
          ? "Set up your Cherry payment plan"
          : "Add your card on file"}
      </h1>

      {method === "cherry" ? (
        <>
          <p className="text-body-copy mx-auto mt-4 max-w-md">
            Complete your Cherry application to set up your{" "}
            {plan.cherry.paymentCount}-payment plan. It takes about a minute
            and checking your rate doesn&rsquo;t affect your credit score.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            {handoffConfig.cherryApplicationUrl ? (
              <a
                href={handoffConfig.cherryApplicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="accent" size="lg" className="gap-2">
                  Open Cherry Application
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </Button>
              </a>
            ) : (
              <p className="rounded-card border border-border bg-surface p-4 text-small text-foreground-secondary">
                Our care coordinator will text you your secure Cherry
                application link right after this step.
              </p>
            )}
            <Button
              size="lg"
              onClick={() => dispatch({ type: "CHERRY_APPROVED" })}
            >
              I&rsquo;ve completed my Cherry application
            </Button>
            {paymentIssue === "cherry-abandoned" && (
              <Button
                variant="secondary"
                onClick={() => dispatch({ type: "RESUME_CHERRY" })}
              >
                Resume my application
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="text-body-copy mx-auto mt-4 max-w-md">
            You&rsquo;ll add your card securely through our patient portal
            (OptiMantra) — we never take card details over the phone or by
            email. Your card is charged once your care plan begins.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            {handoffConfig.optiMantraPortalUrl ? (
              <a
                href={handoffConfig.optiMantraPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="accent" size="lg" className="gap-2">
                  Open Patient Portal
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </Button>
              </a>
            ) : (
              <p className="rounded-card border border-border bg-surface p-4 text-small text-foreground-secondary">
                Our care coordinator will email you a secure patient-portal
                link to add your card right after this step.
              </p>
            )}
            <Button
              size="lg"
              onClick={() => dispatch({ type: "CARD_AUTHORIZED" })}
            >
              I&rsquo;ve added my card
            </Button>
          </div>
        </>
      )}

      <p className="mx-auto mt-8 max-w-md text-small text-foreground-muted">
        Our care coordinator confirms every payment setup before your care
        plan begins — if anything doesn&rsquo;t go through, we&rsquo;ll reach
        out to sort it together.
      </p>

      <button
        type="button"
        onClick={() => dispatch({ type: "CHANGE_PAYMENT_METHOD" })}
        className="mt-6 inline-flex items-center gap-1.5 text-small font-medium text-foreground-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Choose a different payment option
      </button>
    </div>
  );
}
