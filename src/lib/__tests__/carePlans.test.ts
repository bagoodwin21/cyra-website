import { describe, expect, it } from "vitest";
import {
  PRICE_PENDING_PLACEHOLDER,
  carePlan12Month,
  carePlans,
  cherryNetToPracticeCents,
  cherryPaymentSchedule,
  cherryPerPaymentCents,
  displayPrice,
  formatUSD,
  getCarePlan,
  payInFullTotalCents,
  splitIntoPayments,
  startVisit,
} from "@/lib/carePlans";

describe("splitIntoPayments", () => {
  it("splits an even total into identical payments", () => {
    expect(splitIntoPayments(227_500, 13)).toEqual(Array(13).fill(17_500));
  });

  it("always sums exactly to the total (remainder to first payment)", () => {
    expect(splitIntoPayments(100, 3)).toEqual([34, 33, 33]);
    expect(splitIntoPayments(227_501, 13)).toEqual([
      17_501,
      ...Array(12).fill(17_500),
    ]);
    for (const [total, count] of [
      [227_500, 13],
      [999_999, 7],
      [1, 13],
      [0, 5],
    ] as const) {
      const schedule = splitIntoPayments(total, count);
      expect(schedule.reduce((a, b) => a + b, 0)).toBe(total);
      expect(schedule).toHaveLength(count);
    }
  });

  it("keeps every recurring payment identical after the first", () => {
    const [, ...rest] = splitIntoPayments(227_599, 13);
    expect(new Set(rest).size).toBe(1);
  });

  it("rejects fractional cents and invalid counts", () => {
    expect(() => splitIntoPayments(100.5, 13)).toThrow();
    expect(() => splitIntoPayments(-1, 13)).toThrow();
    expect(() => splitIntoPayments(100, 0)).toThrow();
    expect(() => splitIntoPayments(100, 1.5)).toThrow();
  });
});

describe("12-month care plan config", () => {
  it("uses Cherry's 13-payment structure (months + 1)", () => {
    expect(carePlan12Month.cherry.paymentCount).toBe(
      carePlan12Month.months + 1
    );
    expect(carePlan12Month.cherry.paymentCount).toBe(13);
  });

  it("totals $2,275 splitting to exactly $175 per Cherry payment", () => {
    expect(carePlan12Month.totalCents).toBe(227_500);
    expect(cherryPerPaymentCents(carePlan12Month)).toBe(17_500);
  });

  it("Cherry schedule sums exactly to the plan total", () => {
    const schedule = cherryPaymentSchedule(carePlan12Month);
    expect(schedule.reduce((a, b) => a + b, 0)).toBe(
      carePlan12Month.totalCents
    );
  });

  it("nets ~94% to the practice after Cherry's 6% merchant fee", () => {
    expect(carePlan12Month.cherry.merchantFeeRate).toBe(0.06);
    expect(cherryNetToPracticeCents(carePlan12Month)).toBe(213_850);
  });

  it("pay-in-full equals the total until a discount is confirmed", () => {
    expect(carePlan12Month.payInFullDiscountCents).toBeNull();
    expect(payInFullTotalCents(carePlan12Month)).toBe(
      carePlan12Month.totalCents
    );
    const discounted = {
      ...carePlan12Month,
      payInFullDiscountCents: 10_000,
    };
    expect(payInFullTotalCents(discounted)).toBe(217_500);
  });

  it("is registered and findable by id", () => {
    expect(carePlans).toContain(carePlan12Month);
    expect(getCarePlan("care-plan-12-month")).toBe(carePlan12Month);
    expect(getCarePlan("nope")).toBeUndefined();
  });
});

describe("pricing confirmation gate", () => {
  it("no plan may be confirmed while its deposit amount is unknown", () => {
    for (const plan of carePlans) {
      if (plan.confirmed) {
        expect(plan.deposit.amountCents).not.toBeNull();
      }
    }
  });

  it("care plan pricing is still flagged unconfirmed (flip only after Brandon verifies)", () => {
    // If this test starts failing because you confirmed pricing: also set
    // the deposit amount and pay-in-full discount, then update this test.
    expect(carePlan12Month.confirmed).toBe(false);
    expect(startVisit.confirmed).toBe(false);
  });

  it("displayPrice never renders an unconfirmed figure", () => {
    expect(displayPrice(227_500, false)).toBe(PRICE_PENDING_PLACEHOLDER);
    expect(displayPrice(227_500, true)).toBe("$2,275");
  });
});

describe("formatUSD", () => {
  it("formats whole dollars without cents", () => {
    expect(formatUSD(227_500)).toBe("$2,275");
    expect(formatUSD(39_900)).toBe("$399");
    expect(formatUSD(0)).toBe("$0");
  });

  it("keeps cents when present", () => {
    expect(formatUSD(123)).toBe("$1.23");
    expect(formatUSD(17_501)).toBe("$175.01");
  });

  it("rejects fractional cents", () => {
    expect(() => formatUSD(1.5)).toThrow();
  });
});
