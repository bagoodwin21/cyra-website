/**
 * Superbill data model for out-of-network reimbursement delivery.
 *
 * CYRA is cash-pay; patients submit superbills to their insurer (directly,
 * or via Sheer Health / Reimbursify) for potential OON reimbursement. This
 * module defines the structured record and validation so a superbill can be
 * generated consistently from visit data — the actual issuance today happens
 * in OptiMantra (see ENROLLMENT_RUNBOOK.md § Superbills).
 *
 * Supported services (telehealth, modifier -95):
 *   99205-95 — new patient E/M, high complexity (the Start Visit)
 *   99215-95 — established patient E/M (care plan follow-ups)
 *
 * All money is integer USD cents, consistent with src/lib/carePlans.ts.
 */

import { startVisit } from "@/lib/carePlans";

// ---------------------------------------------------------------------------
// Service / code definitions
// ---------------------------------------------------------------------------

export const TELEHEALTH_MODIFIER = "95";

/** POS 10: telehealth provided in the patient's home (the CYRA default). */
export const PLACE_OF_SERVICE_TELEHEALTH_HOME = "10";
/** POS 02: telehealth provided other than in the patient's home. */
export const PLACE_OF_SERVICE_TELEHEALTH_OTHER = "02";

export type PlaceOfService =
  | typeof PLACE_OF_SERVICE_TELEHEALTH_HOME
  | typeof PLACE_OF_SERVICE_TELEHEALTH_OTHER;

export interface ServiceDefinition {
  cptCode: string;
  modifiers: string[];
  description: string;
  /**
   * Default charge in cents, or null when the figure is pending
   * confirmation (the 99215 follow-up allocation within a bundled care
   * plan must be confirmed by Brandon before superbills state it).
   */
  defaultChargeCents: number | null;
}

export const SERVICES = {
  /** New patient comprehensive telehealth evaluation — the Start Visit. */
  newPatientTelehealth: {
    cptCode: "99205",
    modifiers: [TELEHEALTH_MODIFIER],
    description:
      "Office or other outpatient visit, new patient, high level of medical " +
      "decision making (synchronous telemedicine)",
    defaultChargeCents: startVisit.priceCents,
  },
  /** Established patient telehealth follow-up within a care plan. */
  establishedPatientTelehealth: {
    cptCode: "99215",
    modifiers: [TELEHEALTH_MODIFIER],
    description:
      "Office or other outpatient visit, established patient, high level of " +
      "medical decision making (synchronous telemedicine)",
    defaultChargeCents: null,
  },
} as const satisfies Record<string, ServiceDefinition>;

export type ServiceKey = keyof typeof SERVICES;

const SUPPORTED_CPT_CODES = new Set<string>(
  Object.values(SERVICES).map((s) => s.cptCode)
);

// ---------------------------------------------------------------------------
// Superbill record
// ---------------------------------------------------------------------------

export interface PracticeInfo {
  name: string;
  providerName: string;
  /** National Provider Identifier — 10 digits. */
  npi: string;
  /** Tax ID (EIN) as printed on the superbill. */
  taxId: string;
  addressLines: string[];
  phone: string;
}

export interface PatientInfo {
  firstName: string;
  lastName: string;
  /** ISO yyyy-mm-dd. */
  dateOfBirth: string;
  addressLines: string[];
}

export interface DiagnosisEntry {
  /** ICD-10-CM code, e.g. "E28.310" (symptomatic premature menopause). */
  icd10: string;
  description: string;
}

export interface ServiceLine {
  /** ISO yyyy-mm-dd date of service. */
  dateOfService: string;
  cptCode: string;
  modifiers: string[];
  description: string;
  placeOfService: PlaceOfService;
  /** 1-based indexes into the superbill's diagnoses array. */
  diagnosisPointers: number[];
  units: number;
  chargeCents: number;
}

export interface Superbill {
  practice: PracticeInfo;
  patient: PatientInfo;
  diagnoses: DiagnosisEntry[];
  lines: ServiceLine[];
  totalChargeCents: number;
  amountPaidCents: number;
  balanceCents: number;
}

// ---------------------------------------------------------------------------
// Builders & validation
// ---------------------------------------------------------------------------

export interface ServiceLineInput {
  service: ServiceKey;
  dateOfService: string;
  diagnosisPointers: number[];
  units?: number;
  /** Required when the service has no confirmed default charge. */
  chargeCents?: number;
  placeOfService?: PlaceOfService;
}

export function buildServiceLine(input: ServiceLineInput): ServiceLine {
  const def = SERVICES[input.service];
  const charge = input.chargeCents ?? def.defaultChargeCents;
  if (charge === null || charge === undefined) {
    throw new Error(
      `buildServiceLine: no confirmed charge for ${def.cptCode}; pass ` +
        "chargeCents explicitly once the figure is confirmed"
    );
  }
  return {
    dateOfService: input.dateOfService,
    cptCode: def.cptCode,
    modifiers: [...def.modifiers],
    description: def.description,
    placeOfService: input.placeOfService ?? PLACE_OF_SERVICE_TELEHEALTH_HOME,
    diagnosisPointers: input.diagnosisPointers,
    units: input.units ?? 1,
    chargeCents: charge,
  };
}

export interface SuperbillInput {
  practice: PracticeInfo;
  patient: PatientInfo;
  diagnoses: DiagnosisEntry[];
  lines: ServiceLine[];
  amountPaidCents: number;
}

export function buildSuperbill(input: SuperbillInput): Superbill {
  const totalChargeCents = input.lines.reduce(
    (sum, line) => sum + line.chargeCents * line.units,
    0
  );
  const superbill: Superbill = {
    practice: input.practice,
    patient: input.patient,
    diagnoses: input.diagnoses,
    lines: input.lines,
    totalChargeCents,
    amountPaidCents: input.amountPaidCents,
    balanceCents: totalChargeCents - input.amountPaidCents,
  };
  const errors = validateSuperbill(superbill);
  if (errors.length > 0) {
    throw new Error(`buildSuperbill: invalid superbill — ${errors.join("; ")}`);
  }
  return superbill;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const NPI_PATTERN = /^\d{10}$/;
const ICD10_PATTERN = /^[A-TV-Z]\d[0-9A-Z](\.[0-9A-Z]{1,4})?$/;

/** Returns a list of problems; empty array = valid. */
export function validateSuperbill(bill: Superbill): string[] {
  const errors: string[] = [];

  if (!NPI_PATTERN.test(bill.practice.npi)) {
    errors.push(`practice NPI must be 10 digits (got "${bill.practice.npi}")`);
  }
  if (!bill.practice.taxId.trim()) errors.push("practice taxId is required");
  if (!ISO_DATE.test(bill.patient.dateOfBirth)) {
    errors.push("patient dateOfBirth must be ISO yyyy-mm-dd");
  }
  if (bill.diagnoses.length === 0) {
    errors.push("at least one ICD-10 diagnosis is required");
  }
  bill.diagnoses.forEach((dx, i) => {
    if (!ICD10_PATTERN.test(dx.icd10)) {
      errors.push(`diagnosis ${i + 1}: "${dx.icd10}" is not a valid ICD-10 code`);
    }
  });
  if (bill.lines.length === 0) errors.push("at least one service line is required");
  bill.lines.forEach((line, i) => {
    const label = `line ${i + 1}`;
    if (!SUPPORTED_CPT_CODES.has(line.cptCode)) {
      errors.push(`${label}: unsupported CPT code "${line.cptCode}"`);
    }
    if (!line.modifiers.includes(TELEHEALTH_MODIFIER)) {
      errors.push(`${label}: telehealth modifier -95 is required`);
    }
    if (!ISO_DATE.test(line.dateOfService)) {
      errors.push(`${label}: dateOfService must be ISO yyyy-mm-dd`);
    }
    if (!Number.isInteger(line.units) || line.units < 1) {
      errors.push(`${label}: units must be a positive integer`);
    }
    if (!Number.isInteger(line.chargeCents) || line.chargeCents < 0) {
      errors.push(`${label}: chargeCents must be non-negative integer cents`);
    }
    if (line.diagnosisPointers.length === 0) {
      errors.push(`${label}: at least one diagnosis pointer is required`);
    }
    for (const pointer of line.diagnosisPointers) {
      if (
        !Number.isInteger(pointer) ||
        pointer < 1 ||
        pointer > bill.diagnoses.length
      ) {
        errors.push(`${label}: diagnosis pointer ${pointer} is out of range`);
      }
    }
  });

  const expectedTotal = bill.lines.reduce(
    (sum, line) => sum + line.chargeCents * line.units,
    0
  );
  if (bill.totalChargeCents !== expectedTotal) {
    errors.push(
      `totalChargeCents ${bill.totalChargeCents} does not match line sum ${expectedTotal}`
    );
  }
  if (
    !Number.isInteger(bill.amountPaidCents) ||
    bill.amountPaidCents < 0
  ) {
    errors.push("amountPaidCents must be non-negative integer cents");
  }
  if (bill.balanceCents !== bill.totalChargeCents - bill.amountPaidCents) {
    errors.push("balanceCents must equal totalChargeCents - amountPaidCents");
  }

  return errors;
}

/**
 * CYRA practice info for superbill headers. NPI/EIN are placeholders until
 * provided via env — validation will reject a superbill built with
 * placeholder values, which is intentional: no real superbill should ship
 * without them.
 */
export const cyraPracticeInfo: PracticeInfo = {
  name: "CYRA Wellness",
  providerName: "Dr. Mondona Goodwin, DO",
  npi: process.env.CYRA_PROVIDER_NPI ?? "[NPI_PENDING]",
  taxId: process.env.CYRA_PRACTICE_EIN ?? "",
  addressLines: ["[Practice address pending]"],
  phone: "[Practice phone pending]",
};
