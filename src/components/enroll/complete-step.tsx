import { CheckCircle2 } from "lucide-react";
import { PaymentMethodId } from "@/lib/carePlans";

interface CompleteStepProps {
  method: PaymentMethodId;
}

export function CompleteStep({ method }: CompleteStepProps) {
  const nextSteps = [
    method === "cherry"
      ? "We confirm your Cherry approval (usually same day)."
      : "We confirm your card on file and your care plan payment (usually same day).",
    "You'll sign your care plan agreement through our patient portal (OptiMantra) — that signed copy is your official record.",
    "Your care plan begins and we schedule your first follow-up with Dr. Mondona.",
    "After visits, we can provide superbills for potential out-of-network reimbursement.",
  ];

  return (
    <div className="text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="mt-5 font-heading text-2xl font-semibold text-foreground md:text-3xl">
        You&rsquo;re enrolled — welcome to CYRA
      </h1>
      <p className="text-body-copy mx-auto mt-3 max-w-md">
        Here&rsquo;s what happens next:
      </p>
      <ol className="mx-auto mt-6 max-w-md space-y-3 text-left">
        {nextSteps.map((step, i) => (
          <li key={step} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-small font-semibold text-primary">
              {i + 1}
            </span>
            <span className="text-body-copy">{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-small text-foreground-muted">
        Questions in the meantime?{" "}
        <a
          href="mailto:hello@drmondona.com"
          className="font-medium text-primary hover:text-primary-light"
        >
          hello@drmondona.com
        </a>
      </p>
    </div>
  );
}
