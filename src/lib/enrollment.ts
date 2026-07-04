/**
 * Enrollment eligibility rules and flow state machine.
 *
 * The Medicare gate is a HARD compliance rule: Dr. Mondona's Kaiser
 * enrollment conflict means CYRA cannot enroll Medicare-eligible patients
 * (65+). It is enforced here as pure, tested logic — the UI only renders
 * what this module decides. Do not soften or special-case it in components.
 *
 * The state machine models the repo-side enrollment path (payment selection
 * → care plan agreement → third-party handoff) as a pure reducer so every
 * edge case — declined card, abandoned Cherry application, switching payment
 * method mid-flow — is unit-testable without a browser.
 */

import {
  CarePlan,
  PaymentMethodId,
  PRICE_PENDING_PLACEHOLDER,
  formatUSD,
} from "@/lib/carePlans";

// ---------------------------------------------------------------------------
// Eligibility — the Medicare gate
// ---------------------------------------------------------------------------

/** Patients 65+ are Medicare-eligible and cannot enroll. Hard rule. */
export const MEDICARE_AGE_THRESHOLD = 65;

/**
 * CYRA is an adult practice; minors cannot enroll via the web flow.
 * ASSUMPTION flagged for Brandon's confirmation (see ENROLLMENT_RUNBOOK.md).
 */
export const MINIMUM_ENROLLMENT_AGE = 18;

/** Whole years between `dateOfBirth` (ISO yyyy-mm-dd) and `on`. */
export function ageOnDate(dateOfBirth: string, on: Date): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOfBirth);
  if (!match) {
    throw new Error(
      `ageOnDate: expected ISO date (yyyy-mm-dd), got "${dateOfBirth}"`
    );
  }
  const [, y, m, d] = match;
  const birthYear = Number(y);
  const birthMonth = Number(m);
  const birthDay = Number(d);
  let age = on.getFullYear() - birthYear;
  const beforeBirthday =
    on.getMonth() + 1 < birthMonth ||
    (on.getMonth() + 1 === birthMonth && on.getDate() < birthDay);
  if (beforeBirthday) age -= 1;
  return age;
}

export type EligibilityStatus = "eligible" | "medicare-ineligible" | "minor";

export interface EligibilityResult {
  status: EligibilityStatus;
  eligible: boolean;
  /** Patient-facing message for routed-out patients. */
  message: string | null;
}

export const MEDICARE_DECLINE_MESSAGE =
  "We're sorry — CYRA is unable to enroll patients who are 65 or older. " +
  "Because of physician network enrollment restrictions, we cannot provide " +
  "care to Medicare-eligible patients at this time. We'd encourage you to " +
  "ask your primary care physician for a referral to a menopause specialist " +
  "who accepts Medicare, or search the certified-practitioner directory at " +
  "menopause.org.";

export const MINOR_DECLINE_MESSAGE =
  "CYRA provides care to adults. If you're under 18, please talk with your " +
  "parent or guardian and your pediatrician about the symptoms you're " +
  "experiencing.";

export function checkAgeEligibility(age: number): EligibilityResult {
  if (!Number.isFinite(age) || age < 0) {
    throw new Error(`checkAgeEligibility: invalid age ${age}`);
  }
  if (age >= MEDICARE_AGE_THRESHOLD) {
    return {
      status: "medicare-ineligible",
      eligible: false,
      message: MEDICARE_DECLINE_MESSAGE,
    };
  }
  if (age < MINIMUM_ENROLLMENT_AGE) {
    return { status: "minor", eligible: false, message: MINOR_DECLINE_MESSAGE };
  }
  return { status: "eligible", eligible: true, message: null };
}

/** Convenience: gate directly from a date of birth. */
export function checkEligibilityFromDOB(
  dateOfBirth: string,
  today: Date = new Date()
): EligibilityResult {
  return checkAgeEligibility(ageOnDate(dateOfBirth, today));
}

// ---------------------------------------------------------------------------
// Care plan agreement content — rendered from config, never hardcoded in UI
// ---------------------------------------------------------------------------

export type AgreementSectionId =
  | "care-plan-consent"
  | "deposit-forfeiture"
  | "card-on-file";

export interface AgreementSection {
  id: AgreementSectionId;
  title: string;
  body: string;
  /** Checkbox label the patient must affirmatively acknowledge. */
  acknowledgment: string;
}

/**
 * Builds the three agreement sections for a plan + selected payment method.
 * Presented AFTER the initial consultation, when Dr. Mondona has proposed
 * the care plan and the consultation fee has already been charged.
 * The unconfirmed care plan total renders a visible pending placeholder;
 * the deposit (= the consultation fee) renders its real figure because it
 * was already published and already charged at booking.
 */
export function buildAgreementSections(
  plan: CarePlan,
  method: PaymentMethodId
): AgreementSection[] {
  const total = plan.confirmed
    ? formatUSD(plan.totalCents)
    : PRICE_PENDING_PLACEHOLDER;
  const deposit = formatUSD(plan.deposit.amountCents);
  const notCredited = plan.deposit.creditedTowardPlanTotal
    ? ""
    : " This total is in addition to your initial consultation fee, " +
      "which is not applied toward it.";

  const paymentDescription =
    method === "cherry"
      ? `financed through Cherry in ${plan.cherry.paymentCount} equal ` +
        "payments, subject to Cherry credit approval"
      : "charged in full to your card on file";

  return [
    {
      id: "care-plan-consent",
      title: `${plan.name} — Consent to Care Plan Terms`,
      body:
        `You are enrolling in the ${plan.name} (${plan.months} months of ` +
        `physician-led care) for a total investment of ${total}, ` +
        `${paymentDescription}.${notCredited} Your care plan includes: ` +
        plan.includes.join("; ") +
        `. ${plan.note}. CYRA Wellness is a cash-pay practice and does not ` +
        "bill insurance; superbills are available for potential " +
        "out-of-network reimbursement.",
      acknowledgment:
        "I have read and consent to the care plan terms described above.",
    },
    {
      id: "deposit-forfeiture",
      title: "Deposit & Forfeiture Terms",
      body:
        `Your enrollment deposit is the ${deposit} initial consultation ` +
        `fee. ${plan.deposit.forfeitureTerms}`,
      acknowledgment:
        "I understand and accept the deposit and forfeiture terms.",
    },
    {
      id: "card-on-file",
      title: "Card-on-File Authorization",
      body:
        "You authorize CYRA Wellness to keep a payment card securely on " +
        "file and to charge it for the amounts you agree to in this " +
        "enrollment" +
        (method === "cherry"
          ? " (your care plan payments are made to Cherry under your " +
            "Cherry payment plan; your initial consultation fee was " +
            "already charged when you booked)"
          : " (your care plan total; your initial consultation fee was " +
            "already charged when you booked)") +
        ". You may update your card at any time by contacting the practice.",
      acknowledgment:
        "I authorize CYRA Wellness to charge my card on file as described.",
    },
  ];
}

export const AGREEMENT_SECTION_IDS: AgreementSectionId[] = [
  "care-plan-consent",
  "deposit-forfeiture",
  "card-on-file",
];

/** True only when every agreement section has been affirmatively checked. */
export function allSectionsAcknowledged(
  acknowledgments: Partial<Record<AgreementSectionId, boolean>>
): boolean {
  return AGREEMENT_SECTION_IDS.every((id) => acknowledgments[id] === true);
}

// ---------------------------------------------------------------------------
// Enrollment flow state machine
// ---------------------------------------------------------------------------

export type EnrollmentStep =
  | "eligibility"
  | "ineligible"
  | "payment-selection"
  | "agreement"
  | "handoff"
  | "complete";

export type PaymentIssue =
  | "card-declined"
  | "cherry-declined"
  | "cherry-abandoned";

export interface EnrollmentState {
  step: EnrollmentStep;
  planId: string;
  eligibility: EligibilityResult | null;
  paymentMethod: PaymentMethodId | null;
  /**
   * Payment method the agreement was acknowledged under. Switching methods
   * (or plans) invalidates the acknowledgment — the terms the patient
   * checked no longer match what they'd be charged.
   */
  acknowledgedFor: PaymentMethodId | null;
  /** Unresolved payment problem the UI must surface. */
  paymentIssue: PaymentIssue | null;
}

export type EnrollmentEvent =
  | { type: "SUBMIT_ELIGIBILITY"; result: EligibilityResult }
  | { type: "SELECT_PAYMENT_METHOD"; method: PaymentMethodId }
  | { type: "SWITCH_PLAN"; planId: string }
  | {
      type: "ACKNOWLEDGE_AGREEMENT";
      acknowledgments: Partial<Record<AgreementSectionId, boolean>>;
    }
  | { type: "CHANGE_PAYMENT_METHOD" }
  | { type: "CARD_AUTHORIZED" }
  | { type: "CARD_DECLINED" }
  | { type: "CHERRY_APPROVED" }
  | { type: "CHERRY_DECLINED" }
  | { type: "CHERRY_ABANDONED" }
  | { type: "RESUME_CHERRY" };

export function initialEnrollmentState(planId: string): EnrollmentState {
  return {
    step: "eligibility",
    planId,
    eligibility: null,
    paymentMethod: null,
    acknowledgedFor: null,
    paymentIssue: null,
  };
}

/**
 * Pure reducer. Invalid events for the current step return state unchanged
 * (defensive: a stale UI can never skip the gate or the agreement).
 */
export function enrollmentReducer(
  state: EnrollmentState,
  event: EnrollmentEvent
): EnrollmentState {
  switch (event.type) {
    case "SUBMIT_ELIGIBILITY": {
      if (state.step !== "eligibility") return state;
      return event.result.eligible
        ? { ...state, step: "payment-selection", eligibility: event.result }
        : { ...state, step: "ineligible", eligibility: event.result };
    }

    case "SELECT_PAYMENT_METHOD": {
      if (state.step !== "payment-selection" && state.step !== "agreement") {
        return state;
      }
      const switched = state.paymentMethod !== event.method;
      return {
        ...state,
        step: "agreement",
        paymentMethod: event.method,
        // Terms changed → previous acknowledgment no longer applies.
        acknowledgedFor: switched ? null : state.acknowledgedFor,
        paymentIssue: switched ? null : state.paymentIssue,
      };
    }

    case "SWITCH_PLAN": {
      // Allowed any time before handoff completes; resets everything the
      // patient agreed to, since price and terms differ per plan.
      if (state.step === "ineligible" || state.step === "complete") {
        return state;
      }
      if (event.planId === state.planId) return state;
      return {
        ...state,
        planId: event.planId,
        step: state.step === "eligibility" ? "eligibility" : "payment-selection",
        paymentMethod: null,
        acknowledgedFor: null,
        paymentIssue: null,
      };
    }

    case "CHANGE_PAYMENT_METHOD": {
      // Back-navigation from agreement or handoff (e.g. patient reconsiders
      // Cherry at the application step). Acknowledgment is kept — it stays
      // valid for the method it was given under and is invalidated by
      // SELECT_PAYMENT_METHOD if the patient actually switches.
      if (state.step !== "agreement" && state.step !== "handoff") {
        return state;
      }
      return { ...state, step: "payment-selection" };
    }

    case "ACKNOWLEDGE_AGREEMENT": {
      if (state.step !== "agreement" || state.paymentMethod === null) {
        return state;
      }
      // Partial acknowledgment never advances the flow.
      if (!allSectionsAcknowledged(event.acknowledgments)) return state;
      return {
        ...state,
        step: "handoff",
        acknowledgedFor: state.paymentMethod,
      };
    }

    case "CARD_AUTHORIZED": {
      if (state.step !== "handoff" || state.paymentMethod !== "pay-in-full") {
        return state;
      }
      return { ...state, step: "complete", paymentIssue: null };
    }

    case "CARD_DECLINED": {
      if (state.step !== "handoff" || state.paymentMethod !== "pay-in-full") {
        return state;
      }
      // Back to payment selection: patient can retry the card or switch to
      // Cherry. Their acknowledgment stays valid for pay-in-full only.
      return {
        ...state,
        step: "payment-selection",
        paymentIssue: "card-declined",
      };
    }

    case "CHERRY_APPROVED": {
      if (state.step !== "handoff" || state.paymentMethod !== "cherry") {
        return state;
      }
      return { ...state, step: "complete", paymentIssue: null };
    }

    case "CHERRY_DECLINED": {
      if (state.step !== "handoff" || state.paymentMethod !== "cherry") {
        return state;
      }
      return {
        ...state,
        step: "payment-selection",
        paymentIssue: "cherry-declined",
      };
    }

    case "CHERRY_ABANDONED": {
      // Patient left the Cherry application unfinished. Keep them at
      // handoff but flag it so staff/UI can prompt resume-or-switch.
      if (state.step !== "handoff" || state.paymentMethod !== "cherry") {
        return state;
      }
      return { ...state, paymentIssue: "cherry-abandoned" };
    }

    case "RESUME_CHERRY": {
      if (state.paymentIssue !== "cherry-abandoned") return state;
      return { ...state, paymentIssue: null };
    }

    default: {
      // Exhaustiveness guard — a new event type must be handled above.
      const _exhaustive: never = event;
      void _exhaustive;
      return state;
    }
  }
}
