import { describe, expect, it } from "vitest";
import { carePlan12Month } from "@/lib/carePlans";
import {
  AGREEMENT_SECTION_IDS,
  AgreementSectionId,
  EnrollmentState,
  MEDICARE_AGE_THRESHOLD,
  MEDICARE_DECLINE_MESSAGE,
  MINIMUM_ENROLLMENT_AGE,
  ageOnDate,
  allSectionsAcknowledged,
  buildAgreementSections,
  checkAgeEligibility,
  checkEligibilityFromDOB,
  enrollmentReducer,
  initialEnrollmentState,
} from "@/lib/enrollment";

const allAcknowledged: Record<AgreementSectionId, boolean> = {
  "care-plan-consent": true,
  "deposit-forfeiture": true,
  "card-on-file": true,
};

const eligible = checkAgeEligibility(52);

function stateAt(
  step: "payment-selection" | "agreement" | "handoff",
  method: "pay-in-full" | "cherry" = "pay-in-full"
): EnrollmentState {
  let s = initialEnrollmentState(carePlan12Month.id);
  s = enrollmentReducer(s, { type: "SUBMIT_ELIGIBILITY", result: eligible });
  if (step === "payment-selection") return s;
  s = enrollmentReducer(s, { type: "SELECT_PAYMENT_METHOD", method });
  if (step === "agreement") return s;
  return enrollmentReducer(s, {
    type: "ACKNOWLEDGE_AGREEMENT",
    acknowledgments: allAcknowledged,
  });
}

describe("ageOnDate", () => {
  it("computes whole years, birthday-exact", () => {
    const today = new Date(2026, 6, 3); // 2026-07-03
    expect(ageOnDate("1961-07-03", today)).toBe(65); // 65th birthday today
    expect(ageOnDate("1961-07-04", today)).toBe(64); // birthday tomorrow
    expect(ageOnDate("1961-07-02", today)).toBe(65);
    expect(ageOnDate("2008-07-04", today)).toBe(17);
  });

  it("rejects non-ISO input", () => {
    expect(() => ageOnDate("07/03/1961", new Date())).toThrow();
    expect(() => ageOnDate("", new Date())).toThrow();
  });
});

describe("Medicare gate — HARD rule, 65+", () => {
  it("declines exactly at the threshold and above", () => {
    expect(MEDICARE_AGE_THRESHOLD).toBe(65);
    expect(checkAgeEligibility(64).eligible).toBe(true);
    expect(checkAgeEligibility(65).eligible).toBe(false);
    expect(checkAgeEligibility(65).status).toBe("medicare-ineligible");
    expect(checkAgeEligibility(80).eligible).toBe(false);
  });

  it("declines on the patient's 65th birthday, from DOB", () => {
    const today = new Date(2026, 6, 3);
    expect(checkEligibilityFromDOB("1961-07-03", today).eligible).toBe(false);
    expect(checkEligibilityFromDOB("1961-07-04", today).eligible).toBe(true);
  });

  it("gives routed-out patients a clear message", () => {
    const result = checkAgeEligibility(70);
    expect(result.message).toBe(MEDICARE_DECLINE_MESSAGE);
    expect(result.message).toMatch(/65 or older/);
  });

  it("also declines minors", () => {
    expect(MINIMUM_ENROLLMENT_AGE).toBe(18);
    expect(checkAgeEligibility(17).status).toBe("minor");
    expect(checkAgeEligibility(18).eligible).toBe(true);
  });

  it("rejects nonsense ages instead of guessing", () => {
    expect(() => checkAgeEligibility(-1)).toThrow();
    expect(() => checkAgeEligibility(NaN)).toThrow();
  });
});

describe("agreement sections", () => {
  it("always presents consent, deposit/forfeiture, and card-on-file", () => {
    for (const method of ["pay-in-full", "cherry"] as const) {
      const sections = buildAgreementSections(carePlan12Month, method);
      expect(sections.map((s) => s.id)).toEqual(AGREEMENT_SECTION_IDS);
      for (const section of sections) {
        expect(section.acknowledgment.length).toBeGreaterThan(0);
      }
    }
  });

  it("describes the selected payment path", () => {
    const cherry = buildAgreementSections(carePlan12Month, "cherry");
    expect(cherry[0].body).toContain("13 equal payments");
    const full = buildAgreementSections(carePlan12Month, "pay-in-full");
    expect(full[0].body).toContain("charged in full to your card on file");
  });

  it("renders a visible placeholder for the unconfirmed total, never a guessed figure", () => {
    const sections = buildAgreementSections(carePlan12Month, "pay-in-full");
    expect(sections[0].body).toContain("[PRICE PENDING CONFIRMATION]");
    expect(sections[0].body).not.toContain("$2,275");
  });

  it("describes the deposit as the already-charged $399 consultation fee, not credited", () => {
    const sections = buildAgreementSections(carePlan12Month, "pay-in-full");
    expect(sections[1].body).toContain("$399 initial consultation fee");
    expect(sections[1].body).toContain("non-refundable");
    expect(sections[1].body).toContain("not applied toward your care plan total");
    // The consent section states the total excludes the consult fee.
    expect(sections[0].body).toContain(
      "in addition to your initial consultation fee"
    );
    // Card-on-file: consult fee already charged at booking, both methods.
    for (const method of ["pay-in-full", "cherry"] as const) {
      expect(buildAgreementSections(carePlan12Month, method)[2].body).toContain(
        "already charged when you booked"
      );
    }
  });

  it("shows the real total once the plan is confirmed", () => {
    const confirmed = { ...carePlan12Month, confirmed: true };
    const sections = buildAgreementSections(confirmed, "pay-in-full");
    expect(sections[0].body).toContain("$2,275");
  });

  it("allSectionsAcknowledged requires every box", () => {
    expect(allSectionsAcknowledged(allAcknowledged)).toBe(true);
    expect(allSectionsAcknowledged({})).toBe(false);
    expect(
      allSectionsAcknowledged({ ...allAcknowledged, "card-on-file": false })
    ).toBe(false);
  });
});

describe("enrollment state machine", () => {
  it("happy path: pay-in-full to complete", () => {
    let s = stateAt("handoff", "pay-in-full");
    expect(s.step).toBe("handoff");
    expect(s.acknowledgedFor).toBe("pay-in-full");
    s = enrollmentReducer(s, { type: "CARD_AUTHORIZED" });
    expect(s.step).toBe("complete");
  });

  it("happy path: Cherry to complete", () => {
    let s = stateAt("handoff", "cherry");
    s = enrollmentReducer(s, { type: "CHERRY_APPROVED" });
    expect(s.step).toBe("complete");
  });

  it("ineligible patients are routed out and stay out", () => {
    let s = initialEnrollmentState(carePlan12Month.id);
    s = enrollmentReducer(s, {
      type: "SUBMIT_ELIGIBILITY",
      result: checkAgeEligibility(66),
    });
    expect(s.step).toBe("ineligible");
    const after = enrollmentReducer(s, {
      type: "SELECT_PAYMENT_METHOD",
      method: "cherry",
    });
    expect(after).toEqual(s);
  });

  it("the eligibility gate cannot be skipped by stale events", () => {
    const start = initialEnrollmentState(carePlan12Month.id);
    for (const event of [
      { type: "SELECT_PAYMENT_METHOD", method: "cherry" },
      { type: "ACKNOWLEDGE_AGREEMENT", acknowledgments: allAcknowledged },
      { type: "CARD_AUTHORIZED" },
      { type: "CHERRY_APPROVED" },
    ] as const) {
      expect(enrollmentReducer(start, event)).toEqual(start);
    }
  });

  it("partial acknowledgment never advances past the agreement", () => {
    const s = stateAt("agreement");
    const after = enrollmentReducer(s, {
      type: "ACKNOWLEDGE_AGREEMENT",
      acknowledgments: { "care-plan-consent": true },
    });
    expect(after.step).toBe("agreement");
    expect(after.acknowledgedFor).toBeNull();
  });

  it("declined card returns to payment selection with the issue surfaced", () => {
    let s = stateAt("handoff", "pay-in-full");
    s = enrollmentReducer(s, { type: "CARD_DECLINED" });
    expect(s.step).toBe("payment-selection");
    expect(s.paymentIssue).toBe("card-declined");
  });

  it("switching payment method after a declined card requires re-acknowledgment", () => {
    let s = stateAt("handoff", "pay-in-full");
    s = enrollmentReducer(s, { type: "CARD_DECLINED" });
    s = enrollmentReducer(s, {
      type: "SELECT_PAYMENT_METHOD",
      method: "cherry",
    });
    expect(s.step).toBe("agreement");
    expect(s.acknowledgedFor).toBeNull(); // terms changed — must re-agree
    // And the machine refuses Cherry completion without re-acknowledgment.
    expect(enrollmentReducer(s, { type: "CHERRY_APPROVED" }).step).toBe(
      "agreement"
    );
  });

  it("re-selecting the same method keeps the existing acknowledgment", () => {
    let s = stateAt("handoff", "pay-in-full");
    s = enrollmentReducer(s, { type: "CHANGE_PAYMENT_METHOD" });
    expect(s.step).toBe("payment-selection");
    s = enrollmentReducer(s, {
      type: "SELECT_PAYMENT_METHOD",
      method: "pay-in-full",
    });
    expect(s.acknowledgedFor).toBe("pay-in-full");
  });

  it("abandoned Cherry application is flagged and resumable", () => {
    let s = stateAt("handoff", "cherry");
    s = enrollmentReducer(s, { type: "CHERRY_ABANDONED" });
    expect(s.step).toBe("handoff");
    expect(s.paymentIssue).toBe("cherry-abandoned");
    const resumed = enrollmentReducer(s, { type: "RESUME_CHERRY" });
    expect(resumed.paymentIssue).toBeNull();
    expect(resumed.step).toBe("handoff");
  });

  it("abandoned Cherry can also switch to pay-in-full (re-acknowledging)", () => {
    let s = stateAt("handoff", "cherry");
    s = enrollmentReducer(s, { type: "CHERRY_ABANDONED" });
    s = enrollmentReducer(s, { type: "CHANGE_PAYMENT_METHOD" });
    expect(s.step).toBe("payment-selection");
    s = enrollmentReducer(s, {
      type: "SELECT_PAYMENT_METHOD",
      method: "pay-in-full",
    });
    expect(s.step).toBe("agreement");
    expect(s.acknowledgedFor).toBeNull();
    expect(s.paymentIssue).toBeNull();
  });

  it("declined Cherry routes back to payment selection", () => {
    let s = stateAt("handoff", "cherry");
    s = enrollmentReducer(s, { type: "CHERRY_DECLINED" });
    expect(s.step).toBe("payment-selection");
    expect(s.paymentIssue).toBe("cherry-declined");
  });

  it("switching plans mid-flow resets payment method and acknowledgment", () => {
    let s = stateAt("agreement", "cherry");
    s = enrollmentReducer(s, { type: "SWITCH_PLAN", planId: "future-plan" });
    expect(s.planId).toBe("future-plan");
    expect(s.step).toBe("payment-selection");
    expect(s.paymentMethod).toBeNull();
    expect(s.acknowledgedFor).toBeNull();
  });

  it("switching to the same plan is a no-op", () => {
    const s = stateAt("agreement", "cherry");
    expect(
      enrollmentReducer(s, { type: "SWITCH_PLAN", planId: carePlan12Month.id })
    ).toEqual(s);
  });

  it("payment events for the wrong method are ignored", () => {
    const cherry = stateAt("handoff", "cherry");
    expect(enrollmentReducer(cherry, { type: "CARD_DECLINED" })).toEqual(cherry);
    expect(enrollmentReducer(cherry, { type: "CARD_AUTHORIZED" })).toEqual(
      cherry
    );
    const card = stateAt("handoff", "pay-in-full");
    expect(enrollmentReducer(card, { type: "CHERRY_APPROVED" })).toEqual(card);
    expect(enrollmentReducer(card, { type: "CHERRY_ABANDONED" })).toEqual(card);
  });

  it("completed enrollments are immutable to further events", () => {
    let s = stateAt("handoff", "pay-in-full");
    s = enrollmentReducer(s, { type: "CARD_AUTHORIZED" });
    for (const event of [
      { type: "CARD_DECLINED" },
      { type: "SELECT_PAYMENT_METHOD", method: "cherry" },
      { type: "SWITCH_PLAN", planId: "other" },
      { type: "CHANGE_PAYMENT_METHOD" },
    ] as const) {
      expect(enrollmentReducer(s, event)).toEqual(s);
    }
  });
});
