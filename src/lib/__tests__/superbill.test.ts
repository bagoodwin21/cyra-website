import { describe, expect, it } from "vitest";
import { startVisit } from "@/lib/carePlans";
import {
  PLACE_OF_SERVICE_TELEHEALTH_HOME,
  PracticeInfo,
  SERVICES,
  TELEHEALTH_MODIFIER,
  buildServiceLine,
  buildSuperbill,
  cyraPracticeInfo,
  validateSuperbill,
} from "@/lib/superbill";

const practice: PracticeInfo = {
  name: "CYRA Wellness",
  providerName: "Dr. Mondona Goodwin, DO",
  npi: "1234567890",
  taxId: "12-3456789",
  addressLines: ["123 Main St", "Los Angeles, CA 90001"],
  phone: "(555) 555-5555",
};

const patient = {
  firstName: "Jane",
  lastName: "Doe",
  dateOfBirth: "1974-05-01",
  addressLines: ["456 Oak Ave", "San Diego, CA 92101"],
};

const diagnoses = [
  { icd10: "E28.310", description: "Symptomatic premature menopause" },
  { icd10: "N95.1", description: "Menopausal and female climacteric states" },
];

describe("service definitions", () => {
  it("supports 99205-95 (new patient) and 99215-95 (established), telehealth", () => {
    expect(SERVICES.newPatientTelehealth.cptCode).toBe("99205");
    expect(SERVICES.establishedPatientTelehealth.cptCode).toBe("99215");
    for (const service of Object.values(SERVICES)) {
      expect(service.modifiers).toContain(TELEHEALTH_MODIFIER);
    }
  });

  it("prices the new-patient visit from the Start Visit config", () => {
    expect(SERVICES.newPatientTelehealth.defaultChargeCents).toBe(
      startVisit.priceCents
    );
  });
});

describe("buildServiceLine", () => {
  it("builds a new-patient telehealth line with defaults", () => {
    const line = buildServiceLine({
      service: "newPatientTelehealth",
      dateOfService: "2026-07-10",
      diagnosisPointers: [1],
    });
    expect(line.cptCode).toBe("99205");
    expect(line.modifiers).toEqual(["95"]);
    expect(line.placeOfService).toBe(PLACE_OF_SERVICE_TELEHEALTH_HOME);
    expect(line.units).toBe(1);
    expect(line.chargeCents).toBe(startVisit.priceCents);
  });

  it("refuses an established-patient line without an explicit charge", () => {
    // The 99215 allocation within a bundled care plan is unconfirmed —
    // silently defaulting a dollar figure here would be a money bug.
    expect(() =>
      buildServiceLine({
        service: "establishedPatientTelehealth",
        dateOfService: "2026-10-01",
        diagnosisPointers: [1],
      })
    ).toThrow(/no confirmed charge/);
  });

  it("accepts an explicit charge once confirmed", () => {
    const line = buildServiceLine({
      service: "establishedPatientTelehealth",
      dateOfService: "2026-10-01",
      diagnosisPointers: [1, 2],
      chargeCents: 20_000,
    });
    expect(line.cptCode).toBe("99215");
    expect(line.chargeCents).toBe(20_000);
  });
});

describe("buildSuperbill", () => {
  it("computes totals and balance exactly", () => {
    const bill = buildSuperbill({
      practice,
      patient,
      diagnoses,
      lines: [
        buildServiceLine({
          service: "newPatientTelehealth",
          dateOfService: "2026-07-10",
          diagnosisPointers: [1, 2],
        }),
        buildServiceLine({
          service: "establishedPatientTelehealth",
          dateOfService: "2026-10-01",
          diagnosisPointers: [1],
          chargeCents: 20_000,
        }),
      ],
      amountPaidCents: 59_900,
    });
    expect(bill.totalChargeCents).toBe(39_900 + 20_000);
    expect(bill.balanceCents).toBe(0);
    expect(validateSuperbill(bill)).toEqual([]);
  });

  it("throws on an invalid superbill instead of emitting it", () => {
    expect(() =>
      buildSuperbill({
        practice,
        patient,
        diagnoses: [],
        lines: [
          buildServiceLine({
            service: "newPatientTelehealth",
            dateOfService: "2026-07-10",
            diagnosisPointers: [1],
          }),
        ],
        amountPaidCents: 0,
      })
    ).toThrow(/diagnosis/);
  });
});

describe("validateSuperbill", () => {
  function validBill() {
    return buildSuperbill({
      practice,
      patient,
      diagnoses,
      lines: [
        buildServiceLine({
          service: "newPatientTelehealth",
          dateOfService: "2026-07-10",
          diagnosisPointers: [1],
        }),
      ],
      amountPaidCents: 39_900,
    });
  }

  it("rejects a malformed NPI", () => {
    const bill = { ...validBill(), practice: { ...practice, npi: "12345" } };
    expect(validateSuperbill(bill).join()).toMatch(/NPI/);
  });

  it("rejects invalid ICD-10 codes", () => {
    const bill = {
      ...validBill(),
      diagnoses: [{ icd10: "not-a-code", description: "?" }],
    };
    expect(validateSuperbill(bill).join()).toMatch(/ICD-10/);
  });

  it("rejects unsupported CPT codes and missing telehealth modifier", () => {
    const base = validBill();
    const badCpt = {
      ...base,
      lines: [{ ...base.lines[0], cptCode: "99213" }],
    };
    expect(validateSuperbill(badCpt).join()).toMatch(/unsupported CPT/);
    const noModifier = {
      ...base,
      lines: [{ ...base.lines[0], modifiers: [] }],
    };
    expect(validateSuperbill(noModifier).join()).toMatch(/modifier -95/);
  });

  it("rejects out-of-range diagnosis pointers", () => {
    const base = validBill();
    const bill = {
      ...base,
      lines: [{ ...base.lines[0], diagnosisPointers: [3] }],
    };
    expect(validateSuperbill(bill).join()).toMatch(/out of range/);
  });

  it("rejects a total that doesn't match the line sum", () => {
    const bill = { ...validBill(), totalChargeCents: 1 };
    expect(validateSuperbill(bill).join()).toMatch(/does not match/);
  });

  it("rejects fractional or negative money", () => {
    const base = validBill();
    const fractional = {
      ...base,
      lines: [{ ...base.lines[0], chargeCents: 100.5 }],
    };
    expect(validateSuperbill(fractional).join()).toMatch(/integer cents/);
    const negativePaid = { ...base, amountPaidCents: -1, balanceCents: base.totalChargeCents + 1 };
    expect(validateSuperbill(negativePaid).join()).toMatch(/amountPaidCents/);
  });

  it("fails on placeholder practice identifiers — no real superbill without NPI/EIN", () => {
    const bill = { ...validBill(), practice: cyraPracticeInfo };
    const errors = validateSuperbill(bill);
    expect(errors.length).toBeGreaterThan(0);
  });
});
