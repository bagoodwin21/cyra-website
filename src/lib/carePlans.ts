/**
 * Single source of truth for CYRA care plan configuration.
 *
 * Every dollar figure, payment term, and deposit/forfeiture rule in the app
 * derives from this module. Nothing else may hardcode a price — pages and
 * components import from here so a pricing change is a one-file edit.
 *
 * All money is stored as integer USD cents to keep arithmetic exact.
 *
 * ── PRICING CONFIRMATION GATE ──────────────────────────────────────────────
 * Pricing changed around 2025-07-01 and the figures below are the last
 * referenced numbers, NOT confirmed as current. Until Brandon verifies them
 * and flips `confirmed: true` on each item, patient-facing marketing surfaces
 * render placeholders instead of dollar amounts, and the enrollment flow
 * shows a "pricing pending confirmation" banner. See ENROLLMENT_RUNBOOK.md
 * § "Pricing confirmation checklist".
 */

/** Rendered wherever a price is needed but not yet confirmed. */
export const PRICE_PENDING_PLACEHOLDER = "[PRICE PENDING CONFIRMATION]";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CherryTerms {
  /** Cherry splits a 12-month care plan into months + 1 equal payments. */
  paymentCount: number;
  /**
   * Practice-side merchant fee Cherry charges CYRA (~6%). Internal
   * economics only — never patient-facing and never added to patient price.
   */
  merchantFeeRate: number;
}

export interface DepositPolicy {
  /**
   * Deposit collected at care plan agreement. `null` = amount not yet
   * confirmed by Brandon; agreement UI renders a visible placeholder.
   */
  amountCents: number | null;
  /** Patient-facing forfeiture terms shown in the care plan agreement. */
  forfeitureTerms: string;
}

export interface CarePlan {
  id: string;
  name: string;
  /** Care plan length in months. */
  months: number;
  /** Full price of the care plan in cents. */
  totalCents: number;
  /**
   * Pay-in-full discount in cents off `totalCents`. `null` = discount
   * exists in marketing copy but the amount is unconfirmed.
   */
  payInFullDiscountCents: number | null;
  cherry: CherryTerms;
  deposit: DepositPolicy;
  /** True only once Brandon confirms the figures are the live prices. */
  confirmed: boolean;
  includes: string[];
  note: string;
}

export interface StartVisit {
  id: string;
  name: string;
  priceCents: number;
  durationMinutes: number;
  confirmed: boolean;
}

// ---------------------------------------------------------------------------
// Plan definitions
// ---------------------------------------------------------------------------

/**
 * The one-time comprehensive Start Visit required before care plan
 * enrollment. $399 is the figure currently published on the live site;
 * flagged unconfirmed pending Brandon's post-July-1 pricing verification.
 */
export const startVisit: StartVisit = {
  id: "start-visit",
  name: "Start Visit",
  priceCents: 39_900,
  durationMinutes: 60,
  confirmed: false,
};

/**
 * The 12-month care plan. $2,275 via Cherry's 13-payment structure
 * (= $175/payment exactly) is the last referenced figure — UNCONFIRMED,
 * see module banner.
 */
export const carePlan12Month: CarePlan = {
  id: "care-plan-12-month",
  name: "12-Month Care Plan",
  months: 12,
  totalCents: 227_500,
  payInFullDiscountCents: null,
  cherry: {
    paymentCount: 13,
    merchantFeeRate: 0.06,
  },
  deposit: {
    amountCents: null,
    forfeitureTerms:
      "Your deposit reserves your enrollment and Dr. Mondona's clinical " +
      "time. If you cancel enrollment before your first clinical visit, " +
      "your deposit is forfeited. Once your care plan begins, the deposit " +
      "is applied toward your care plan total.",
  },
  confirmed: false,
  includes: [
    "Ongoing physician management by Dr. Mondona",
    "Quarterly follow-up visits (minimum)",
    "Lab review and protocol adjustments",
    "Patient portal messaging access",
    "Prescription management",
  ],
  note: "Medication costs are separate through your pharmacy",
};

/** All care plans on offer. Extend as new tiers launch. */
export const carePlans: CarePlan[] = [carePlan12Month];

export function getCarePlan(id: string): CarePlan | undefined {
  return carePlans.find((plan) => plan.id === id);
}

// ---------------------------------------------------------------------------
// Payment methods
// ---------------------------------------------------------------------------

export type PaymentMethodId = "pay-in-full" | "cherry";

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  description: string;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: "pay-in-full",
    label: "Pay in full",
    description:
      "One payment charged to your card on file when your care plan begins.",
  },
  {
    id: "cherry",
    label: "Monthly payments with Cherry",
    description:
      "Cherry, our patient financing partner, splits your care plan into " +
      "equal payments with approved credit. Checking your rate takes about " +
      "a minute and doesn't affect your credit score.",
  },
];

// ---------------------------------------------------------------------------
// Money math — pure, exact, and tested (src/lib/__tests__/carePlans.test.ts)
// ---------------------------------------------------------------------------

/**
 * Splits a total into `count` payments that sum exactly to the total.
 * Every payment is the floor of the even split; the remainder cents are
 * added to the FIRST payment so later autopay amounts are identical.
 */
export function splitIntoPayments(totalCents: number, count: number): number[] {
  if (!Number.isInteger(totalCents) || totalCents < 0) {
    throw new Error(`splitIntoPayments: invalid totalCents ${totalCents}`);
  }
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`splitIntoPayments: invalid payment count ${count}`);
  }
  const base = Math.floor(totalCents / count);
  const remainder = totalCents - base * count;
  return Array.from({ length: count }, (_, i) =>
    i === 0 ? base + remainder : base
  );
}

/** Per-payment schedule for a plan financed through Cherry. */
export function cherryPaymentSchedule(plan: CarePlan): number[] {
  return splitIntoPayments(plan.totalCents, plan.cherry.paymentCount);
}

/** The recurring Cherry payment amount (payments after the first). */
export function cherryPerPaymentCents(plan: CarePlan): number {
  const schedule = cherryPaymentSchedule(plan);
  return schedule[schedule.length - 1];
}

/** What the patient pays if they pay in full (discount applied when known). */
export function payInFullTotalCents(plan: CarePlan): number {
  return plan.totalCents - (plan.payInFullDiscountCents ?? 0);
}

/**
 * What CYRA nets on a Cherry-financed plan after Cherry's merchant fee.
 * Internal economics only — never patient-facing.
 */
export function cherryNetToPracticeCents(plan: CarePlan): number {
  return Math.round(plan.totalCents * (1 - plan.cherry.merchantFeeRate));
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/** "$2,275" for whole-dollar amounts, "$2,274.99" otherwise. */
export function formatUSD(cents: number): string {
  if (!Number.isInteger(cents)) {
    throw new Error(`formatUSD: expected integer cents, got ${cents}`);
  }
  const dollars = cents / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Price string for patient-facing marketing surfaces: the real figure once
 * confirmed, a visible placeholder until then. Never silently publishes an
 * unconfirmed price.
 */
export function displayPrice(
  cents: number,
  confirmed: boolean
): string {
  return confirmed ? formatUSD(cents) : PRICE_PENDING_PLACEHOLDER;
}

/**
 * "$399" — rendered as-is even while unconfirmed because this figure was
 * already published on the live site before this module existed; gating it
 * behind the placeholder would regress live copy. Remove this exception
 * once Brandon confirms post-July-1 pricing.
 */
export const startVisitPriceLabel = formatUSD(startVisit.priceCents);

// ---------------------------------------------------------------------------
// Third-party handoff configuration
// ---------------------------------------------------------------------------

/**
 * Deep-link destinations for the post-agreement handoff. All disabled by
 * default (empty env → null) pending Brandon wiring the real URLs — the UI
 * renders documented manual-step instructions instead of dead links.
 * No live API calls are made from this module.
 */
export const handoffConfig = {
  /** Cherry patient application link from the Cherry practice dashboard. */
  cherryApplicationUrl:
    process.env.NEXT_PUBLIC_CHERRY_APPLICATION_URL || null,
  /** OptiMantra patient portal / consent packet link. */
  optiMantraPortalUrl:
    process.env.NEXT_PUBLIC_OPTIMANTRA_PORTAL_URL || null,
};
