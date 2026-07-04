"use client";

import * as React from "react";
import { AlertCircle, CreditCard, Wallet } from "lucide-react";
import {
  CarePlan,
  PaymentMethodId,
  cherryPerPaymentCents,
  formatUSD,
  payInFullTotalCents,
  paymentMethods,
} from "@/lib/carePlans";
import { PaymentIssue } from "@/lib/enrollment";
import { cn } from "@/lib/utils";

interface PaymentSelectionStepProps {
  plan: CarePlan;
  paymentIssue: PaymentIssue | null;
  selected: PaymentMethodId | null;
  onSelect: (method: PaymentMethodId) => void;
}

const issueMessages: Record<PaymentIssue, string> = {
  "card-declined":
    "Your card couldn't be charged. You can try a different card with the pay-in-full option, or switch to monthly payments with Cherry.",
  "cherry-declined":
    "Cherry wasn't able to approve your application this time. You can choose the pay-in-full option instead, or contact us to talk through alternatives.",
  "cherry-abandoned":
    "Your Cherry application wasn't finished. You can pick up where you left off, or choose a different payment option below.",
};

const methodIcons: Record<PaymentMethodId, typeof Wallet> = {
  "pay-in-full": CreditCard,
  cherry: Wallet,
};

export function PaymentSelectionStep({
  plan,
  paymentIssue,
  selected,
  onSelect,
}: PaymentSelectionStepProps) {
  const perPayment = formatUSD(cherryPerPaymentCents(plan));
  const payInFull = formatUSD(payInFullTotalCents(plan));

  const methodDetail: Record<PaymentMethodId, string> = {
    "pay-in-full": `${payInFull} total${
      plan.payInFullDiscountCents === null
        ? " — ask about the upfront-payment discount"
        : ""
    }`,
    cherry: `${perPayment} × ${plan.cherry.paymentCount} payments (${formatUSD(
      plan.totalCents
    )} total), with approved credit`,
  };

  return (
    <div>
      <h1 className="text-center font-heading text-2xl font-semibold text-foreground md:text-3xl">
        How would you like to pay for your {plan.name.toLowerCase()}?
      </h1>

      {paymentIssue && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-card border border-border bg-accent/10 p-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-foreground" aria-hidden />
          <p className="text-small text-foreground">{issueMessages[paymentIssue]}</p>
        </div>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {paymentMethods.map((method) => {
          const Icon = methodIcons[method.id];
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelect(method.id)}
              aria-pressed={selected === method.id}
              className={cn(
                "rounded-card border-2 bg-surface p-6 text-left shadow-card transition-colors",
                selected === method.id
                  ? "border-primary"
                  : "border-border hover:border-primary/40"
              )}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="mt-4 block font-heading text-xl font-semibold text-foreground">
                {method.label}
              </span>
              <span className="mt-2 block font-body text-lg font-semibold text-primary">
                {methodDetail[method.id]}
              </span>
              <span className="text-body-copy mt-3 block">{method.description}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-center text-small text-foreground-muted">
        Checking your rate with Cherry doesn&rsquo;t affect your credit score.
        Either way, your next step is reviewing your care plan agreement.
      </p>
      <p className="mt-2 text-center text-small text-foreground-muted">
        Your initial consultation fee was charged at booking and is separate
        from your care plan total.
      </p>
    </div>
  );
}
