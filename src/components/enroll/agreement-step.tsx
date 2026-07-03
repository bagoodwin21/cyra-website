"use client";

import * as React from "react";
import { ArrowLeft, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarePlan, PaymentMethodId } from "@/lib/carePlans";
import {
  AgreementSectionId,
  allSectionsAcknowledged,
  buildAgreementSections,
} from "@/lib/enrollment";

interface AgreementStepProps {
  plan: CarePlan;
  method: PaymentMethodId;
  onBack: () => void;
  onAcknowledge: (
    acknowledgments: Partial<Record<AgreementSectionId, boolean>>
  ) => void;
}

/**
 * Care plan agreement: consent, deposit/forfeiture, and card-on-file
 * authorization, rendered entirely from config via buildAgreementSections.
 * Every section requires an affirmative checkbox before continuing.
 */
export function AgreementStep({
  plan,
  method,
  onBack,
  onAcknowledge,
}: AgreementStepProps) {
  const sections = React.useMemo(
    () => buildAgreementSections(plan, method),
    [plan, method]
  );
  const [acknowledgments, setAcknowledgments] = React.useState<
    Partial<Record<AgreementSectionId, boolean>>
  >({});

  const complete = allSectionsAcknowledged(acknowledgments);

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-small font-medium text-foreground-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Change payment option
      </button>

      <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
        Your care plan agreement
      </h1>
      <p className="text-body-copy mt-3">
        Please read each section and check the box to confirm. Your full
        agreement is also completed and stored in our patient portal
        (OptiMantra) as part of enrollment.
      </p>

      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <div
            key={section.id}
            className="rounded-card border border-border bg-surface p-6 shadow-card"
          >
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {section.title}
            </h2>
            <p className="text-body-copy mt-3">{section.body}</p>
            <label className="mt-5 flex cursor-pointer items-start gap-3 border-t border-border pt-4">
              <input
                type="checkbox"
                checked={acknowledgments[section.id] === true}
                onChange={(e) =>
                  setAcknowledgments((prev) => ({
                    ...prev,
                    [section.id]: e.target.checked,
                  }))
                }
                className="mt-1 h-5 w-5 shrink-0 accent-primary"
              />
              <span className="text-small font-medium text-foreground">
                {section.acknowledgment}
              </span>
            </label>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button
          size="lg"
          disabled={!complete}
          onClick={() => onAcknowledge(acknowledgments)}
          className="gap-2"
        >
          <FileCheck className="h-5 w-5" aria-hidden />
          I agree — continue
        </Button>
        {!complete && (
          <p className="mt-3 text-small text-foreground-muted">
            Check all three boxes above to continue.
          </p>
        )}
      </div>
    </div>
  );
}
