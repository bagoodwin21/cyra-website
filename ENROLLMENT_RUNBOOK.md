# CYRA Enrollment Runbook

How a patient goes from lead to enrolled care-plan patient, end to end —
what the repo automates, what lives in third-party SaaS (OptiMantra,
HubSpot, Cherry), and every human step in between. Keep this current: if
you change the flow, change this file in the same PR.

**Owner legend:** `[CODE]` this repo · `[SAAS]` third-party configuration ·
`[HUMAN]` a person does it (Brandon = enrollment; Dr. Mondona = clinical).

---

## ⚠️ Pricing confirmation checklist (do this first)

Pricing changed around **July 1** and the figures encoded in
`src/lib/carePlans.ts` are the **last referenced numbers, not confirmed**:

- 12-month care plan: $2,275 total via Cherry's 13-payment structure
  ($175/payment)
- Start Visit: $399 (still rendered on the site because it was already
  published there before this module existed)
- Cherry merchant fee: ~6% (practice-side)
- Deposit amount: **unknown** (`deposit.amountCents: null`)
- Pay-in-full discount: referenced in marketing copy, amount **unknown**

Until confirmed, the site renders `[PRICE PENDING CONFIRMATION]` for care
plan figures and `/enroll` shows a not-for-patients banner.

**Brandon, to go live:**

1. Verify every figure above against the current live pricing.
2. In `src/lib/carePlans.ts`: set `totalCents`, `deposit.amountCents`,
   `payInFullDiscountCents` (or confirm no discount → `0`), and flip
   `confirmed: true` on `carePlan12Month` and `startVisit`.
3. Update the guard test in `src/lib/__tests__/carePlans.test.ts`
   ("care plan pricing is still flagged unconfirmed") — it fails on
   purpose when you flip the flag, so confirmation is a deliberate act.
4. Confirm the follow-up visit (99215-95) charge allocation for
   superbills and set `defaultChargeCents` in `src/lib/superbill.ts`.
5. Also confirm the `MINIMUM_ENROLLMENT_AGE = 18` assumption in
   `src/lib/enrollment.ts` (the 65+ Medicare gate is per spec; the 18
   floor was added as a safety default and needs sign-off).
6. Run `npm test && npm run build` — all green before deploying.

---

## Stage 1 — Lead capture → HubSpot

- `[CODE]` Symptom quiz (`/quiz`) email gate posts to the HubSpot Forms
  API (`src/lib/hubspot.ts`). **Disabled by default**: it silently no-ops
  until `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` / `NEXT_PUBLIC_HUBSPOT_FORM_ID`
  are set (see `.env.example`).
- `[SAAS]` Create the HubSpot form, note portal + form IDs, set the env
  vars in Vercel. Map the form to create/update a Contact.
- `[SAAS]` HubSpot lifecycle stage on capture: `lead`.

## Stage 2 — Discovery / enrollment call (Brandon)

- `[CODE]` `/book` renders a Calendly embed placeholder
  (`src/components/ui/calendly-placeholder.tsx`); wire it by setting
  `NEXT_PUBLIC_CALENDLY_URL`.
- `[SAAS]` Calendly event type for the 15-minute discovery call, routed
  to Brandon; enable the Calendly↔HubSpot integration so bookings update
  the contact (lifecycle → `opportunity` or equivalent).
- `[HUMAN]` Brandon runs the call, explains the care plan, pricing, and
  payment options, and sends the patient the enrollment link (`/enroll`).
  **Do not send `/enroll` until the pricing checklist above is done.**

## Stage 3 — Payment selection

- `[CODE]` `/enroll` step 1 is the eligibility gate (see Medicare gate
  below); step 2 presents **pay in full (card on file)** vs **Cherry
  (13 payments)** with all math derived from `src/lib/carePlans.ts`.
- `[CODE]` Payment-path edge cases (declined card, declined/abandoned
  Cherry application, switching method or plan mid-flow) are modeled and
  tested in `src/lib/enrollment.ts`. Switching payment method invalidates
  the patient's agreement acknowledgment by design — they re-agree under
  the new terms.
- `[SAAS]` Cherry: get the practice's patient application URL from the
  Cherry dashboard and set `NEXT_PUBLIC_CHERRY_APPLICATION_URL`; until
  then the handoff step tells the patient the care coordinator will text
  the link. The `/pricing` page also has a slot for Cherry's rate-check
  widget embed (`NEXT_PUBLIC_CHERRY_MERCHANT_ID`).
- `[HUMAN]` Cherry application outcomes (approved / declined / abandoned)
  are visible in the Cherry dashboard — there is **no webhook into this
  repo**. Brandon checks the dashboard same-day and follows up on
  abandoned applications.

## Stage 4 — Care plan agreement

- `[CODE]` `/enroll` step 3 renders the agreement from config
  (`buildAgreementSections` in `src/lib/enrollment.ts`): care plan
  consent, deposit/forfeiture terms, and card-on-file authorization.
  All three require affirmative checkboxes; partial acknowledgment never
  advances (tested).
- `[SAAS]` The **legally operative** signed agreement lives in
  OptiMantra: upload the care plan agreement as a consent form there and
  send it in the new-patient packet. The web flow's acknowledgment is the
  patient-experience layer, not the signature of record.
- `[HUMAN]` Brandon charges the deposit to the card on file (in
  OptiMantra's payment processing) once the agreement is signed.
- ⚠️ `[CODE]` Acknowledgments are currently **client-side state only** —
  they are not persisted anywhere. Persisting them (e.g. to HubSpot or a
  backend) is future work; until then the OptiMantra-signed consent is
  the durable record.

## Stage 5 — OptiMantra consent + clinical scheduling

- `[SAAS]` OptiMantra: new-patient consent packet (telehealth consent,
  practice policies, care plan agreement), card-on-file collection via
  the patient portal, and scheduling of the Start Visit with Dr. Mondona.
  Set `NEXT_PUBLIC_OPTIMANTRA_PORTAL_URL` so the `/enroll` handoff step
  links straight to the portal.
- `[HUMAN]` Care coordinator confirms: consents signed, payment secured
  (card charged or Cherry plan active), visit on the calendar. Only then
  is enrollment complete.

## Stage 6 — Post-visit: superbill + out-of-network reimbursement

- `[CODE]` `src/lib/superbill.ts` defines the structured superbill record
  (CPT **99205-95** new patient / **99215-95** established, telehealth
  POS 10, ICD-10 diagnoses, validation). It intentionally refuses to
  build a superbill with placeholder NPI/EIN or an unconfirmed 99215
  charge — set `CYRA_PROVIDER_NPI` / `CYRA_PRACTICE_EIN` before
  generating any real one.
- `[SAAS]` Today, superbills are generated in OptiMantra (billing →
  superbill) on patient request. The repo model exists so generation can
  be automated later without re-deciding the data shape.
- `[HUMAN]` On request, staff sends the superbill plus reimbursement
  guidance: patients can self-submit or use **Sheer Health** or
  **Reimbursify** to file the out-of-network claim. Remind them
  reimbursement is possible-not-promised (matches FAQ copy).

## Stage 7 — HubSpot lifecycle + outreach

- `[SAAS]` On enrollment completion, Brandon (or a HubSpot workflow keyed
  off the Calendly/Cherry integrations) moves the contact's lifecycle
  stage to `customer` and enrolls them in the post-enrollment sequence;
  non-enrolling leads go to the nurture sequence.
- `[CODE]` Nothing in the repo writes lifecycle stages today. If/when
  built, it must sit behind a config flag, default-off, sandbox-first —
  same policy as every SaaS integration here.

---

## Medicare gate (compliance — do not weaken)

Patients **65 or older cannot enroll** (Dr. Mondona's Kaiser enrollment
conflict → no Medicare-eligible patients). Enforced in
`src/lib/enrollment.ts` (`checkAgeEligibility`, threshold
`MEDICARE_AGE_THRESHOLD = 65`, boundary-tested including the 65th
birthday itself) and surfaced as the first step of `/enroll`, which
routes declined patients to alternatives (their PCP, menopause.org
directory). The state machine ignores any event that would skip the gate.

`[HUMAN]` The gate also applies off-line: Brandon screens age on the
discovery call, and OptiMantra intake should capture DOB so a booking
that slipped past the web flow is still caught before the visit.

## Guardrails for future SaaS integrations

- No live API keys in the repo; secrets only via env.
- Any HubSpot/Cherry/OptiMantra API code ships behind a config flag,
  uses sandbox/test mode, and stays **disabled by default** pending
  Brandon's review (the HubSpot forms submission already follows this:
  unset env → no-op).
- Money and compliance logic changes require tests in the same PR
  (`npm test`).

## Quick reference — env vars

| Variable | Enables |
| --- | --- |
| `NEXT_PUBLIC_CALENDLY_URL` | Discovery-call embed on `/book` |
| `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` / `NEXT_PUBLIC_HUBSPOT_FORM_ID` | Quiz lead capture → HubSpot |
| `NEXT_PUBLIC_CHERRY_MERCHANT_ID` | Cherry rate-check widget on `/pricing` |
| `NEXT_PUBLIC_CHERRY_APPLICATION_URL` | Cherry application link in `/enroll` handoff |
| `NEXT_PUBLIC_OPTIMANTRA_PORTAL_URL` | OptiMantra portal link in `/enroll` handoff |
| `CYRA_PROVIDER_NPI` / `CYRA_PRACTICE_EIN` | Valid superbill generation |
| `NEXT_PUBLIC_GTM_ID` | Analytics |
