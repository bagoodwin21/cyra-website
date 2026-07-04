# CYRA Enrollment Runbook

How a patient goes from lead to enrolled care-plan patient, end to end —
what the repo automates, what lives in third-party SaaS (OptiMantra,
HubSpot, Cherry), and every human step in between. Keep this current: if
you change the flow, change this file in the same PR.

**Owner legend:** `[CODE]` this repo · `[SAAS]` third-party configuration ·
`[HUMAN]` a person does it (Brandon = enrollment; Dr. Mondona = clinical).

**Flow order (confirmed by Brandon 2026-07-04):** discovery call →
eligibility check → patient books the initial consultation and **pays the
consultation fee at booking** → consultation with Dr. Mondona → care plan
proposed → agreement + payment selection → balance paid / Cherry plan
starts → care plan begins. The agreement comes AFTER the consultation,
not before.

---

## ⚠️ Pricing confirmation checklist (do this first)

Pricing changed around **July 1** and the figures encoded in
`src/lib/carePlans.ts` are the **last referenced numbers, not confirmed**:

- 12-month care plan: $2,275 total via Cherry's 13-payment structure
  ($175/payment) — **in addition to** the consultation fee, which is
  never credited toward this total
- Initial consultation (Start Visit): $399, charged at booking (still
  rendered on the site because it was already published there)
- Cherry merchant fee: ~6% (practice-side)
- Deposit: **resolved 2026-07-04** — the $399 consultation fee doubles as
  the marketing "deposit"; non-refundable, not credited, not financed
- Pay-in-full discount: referenced in marketing copy, amount **unknown**

Until confirmed, the site renders `[PRICE PENDING CONFIRMATION]` for care
plan figures and `/enroll` shows a not-for-patients banner.

**Brandon, to go live:**

1. Verify the care plan total and consultation fee against current live
   pricing.
2. In `src/lib/carePlans.ts`: set `totalCents`, `payInFullDiscountCents`
   (or confirm no discount → `0`), and flip `confirmed: true` on
   `carePlan12Month` and `startVisit`.
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
- `[HUMAN]` Brandon runs the call, screens for fit **including age (the
  Medicare gate applies here first — see below)**, explains the care
  plan, pricing, and what the consultation fee covers, then sends the
  patient the eligibility/booking link (`/eligibility`).

## Stage 3 — Eligibility check → consultation booked & paid

- `[CODE]` `/eligibility` runs the Medicare gate (DOB → 65+ routed out,
  under-18 routed out) **before the patient pays anything**, then routes
  eligible patients to the consultation booking link
  (`NEXT_PUBLIC_OPTIMANTRA_BOOKING_URL`; until set, it tells them the
  care coordinator will send the link).
- `[SAAS]` OptiMantra online booking for the initial consultation with
  **payment collected at booking** ($399 — marketed as the enrollment
  deposit). Booking must capture DOB so the Medicare gate has a backstop
  in the EHR.
- `[HUMAN]` No-shows/cancellations: the consultation fee is
  non-refundable per the deposit terms; handle exceptions case-by-case.

## Stage 4 — Initial consultation (Dr. Mondona)

- `[HUMAN]` Comprehensive evaluation (bills as CPT 99205-95 for the
  superbill), labs ordered, care plan proposed. **No obligation**: a
  patient who stops here owes nothing further and gets no ongoing care.
- `[HUMAN]` If the care plan is a fit, Brandon/coordinator sends the
  enrollment link (`/enroll`). **Do not send `/enroll` until the pricing
  checklist above is done.**

## Stage 5 — Care plan agreement + payment selection (`/enroll`)

- `[CODE]` `/enroll` (post-consultation): a backstop eligibility gate,
  then **pay in full (card on file)** vs **Cherry (13 payments)** with
  all math from `src/lib/carePlans.ts`, then the agreement rendered from
  config (`buildAgreementSections`): care plan consent, deposit/
  forfeiture terms (the already-charged $399 consult fee — explicitly
  not credited toward the total), and card-on-file authorization. All
  three require affirmative checkboxes; partial acknowledgment never
  advances (tested).
- `[CODE]` Payment-path edge cases (declined card, declined/abandoned
  Cherry application, switching method or plan mid-flow) are modeled and
  tested in `src/lib/enrollment.ts`. Switching payment method invalidates
  the patient's acknowledgment by design — they re-agree under the new
  terms.
- `[SAAS]` Cherry finances the **care plan total only** — the $399 was
  already charged at booking. (Including it in Cherry financing was
  considered and parked: it would mean refunding the booking charge,
  which Fiserv penalizes, or not charging at booking, which raises
  no-show risk.) Get the practice application URL from the Cherry
  dashboard → `NEXT_PUBLIC_CHERRY_APPLICATION_URL`; the `/pricing` page
  also has a slot for Cherry's rate-check widget
  (`NEXT_PUBLIC_CHERRY_MERCHANT_ID`).
- `[HUMAN]` **Cherry emails the practice when a patient is approved** —
  act on that email same-day (confirm the plan is active, move to
  consent signature). No email is sent for declined or abandoned
  applications, so absence of an approval email is not a decline: if a
  patient chose Cherry and no email arrives by end of day, check the
  Cherry dashboard and follow up (resume the application or switch them
  to pay-in-full — the `/enroll` flow supports both).
- `[SAAS]` Cherry's practice portal has an "Integrations & Apps" page
  for API keys used by Cherry-approved third-party software. That key is
  a credential — never put it in this repo or any `NEXT_PUBLIC_` env
  var. If OptiMantra or an automation tool (Zapier/Make) appears on
  Cherry's approved list, wiring it there could surface application
  status inside the EHR or push outcomes to HubSpot automatically;
  check the list and document what it offers before creating a key.
- ⚠️ `[CODE]` Web acknowledgments are **client-side state only** — not
  persisted. The OptiMantra-signed agreement (next stage) is the durable
  record.

## Stage 6 — Signed agreement + payment secured → care plan begins

- `[SAAS]` The **legally operative** signed agreement lives in
  OptiMantra: upload the care plan agreement as a consent form there and
  send it after the web acknowledgment. The web flow is the
  patient-experience layer, not the signature of record.
- ⚠️ **Agreement change procedure** — the agreement text exists in TWO
  places that must stay in sync: the repo template
  (`buildAgreementSections` in `src/lib/enrollment.ts`, pulling terms
  and figures from `src/lib/carePlans.ts`) and the OptiMantra consent
  document patients actually sign. Any wording or terms change updates
  both in the same sitting; git history is the audit trail of what the
  web version said on any given date.
- `[HUMAN]` Coordinator confirms: agreement signed in OptiMantra, and
  payment secured — care plan total charged to the card on file, or
  Cherry plan active (approval email received). Only then does the care
  plan begin and the first follow-up get scheduled.

## Stage 7 — Post-visit: superbill + out-of-network reimbursement

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

## Stage 8 — HubSpot lifecycle + outreach

- `[SAAS]` On enrollment completion, Brandon (or a HubSpot workflow keyed
  off the Calendly/Cherry integrations) moves the contact's lifecycle
  stage to `customer` and enrolls them in the post-enrollment sequence;
  non-enrolling leads go to the nurture sequence.
- `[SAAS]` **Automation option:** OptiMantra supports outbound webhooks
  (Settings → Marketing → CRM Integration → "Add New Out-Bound
  Webhook"), e.g. trigger "When an Appointment is Booked" → HubSpot,
  which can flip the lifecycle stage and start the sequence with no
  human step. Send the **minimum** fields (name, email, appointment
  type/status) — no clinical data into the CRM, and any middleman
  (Zapier/Make) needs a BAA. While configuring, check whether a
  consent-signed or tag-based trigger exists: that would give HubSpot a
  timestamped record of the signed agreement too.
- `[CODE]` Nothing in the repo writes lifecycle stages today. If/when
  built, it must sit behind a config flag, default-off, sandbox-first —
  same policy as every SaaS integration here.

---

## Medicare gate (compliance — do not weaken)

Patients **65 or older cannot enroll** (Dr. Mondona's Kaiser enrollment
conflict → no Medicare-eligible patients). Enforced in
`src/lib/enrollment.ts` (`checkAgeEligibility`, threshold
`MEDICARE_AGE_THRESHOLD = 65`, boundary-tested including the 65th
birthday itself) and applied at **three** points, in order:

1. `[HUMAN]` Brandon screens age on the discovery call.
2. `[CODE]` `/eligibility` gates by DOB **before the patient pays the
   consultation fee** — this is the one that prevents taking money from
   someone we can't treat.
3. `[CODE]` `/enroll` re-runs the same gate as a backstop, and
   `[SAAS]` OptiMantra intake captures DOB so a slip-through is caught
   before the visit.

Declined patients get routed-out messaging with alternatives (their PCP,
menopause.org directory). The state machine ignores any event that would
skip the gate.

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
| `NEXT_PUBLIC_OPTIMANTRA_BOOKING_URL` | Consultation booking link on `/eligibility` |
| `NEXT_PUBLIC_CHERRY_MERCHANT_ID` | Cherry rate-check widget on `/pricing` |
| `NEXT_PUBLIC_CHERRY_APPLICATION_URL` | Cherry application link in `/enroll` handoff |
| `NEXT_PUBLIC_OPTIMANTRA_PORTAL_URL` | OptiMantra portal link in `/enroll` handoff |
| `CYRA_PROVIDER_NPI` / `CYRA_PRACTICE_EIN` | Valid superbill generation |
| `NEXT_PUBLIC_GTM_ID` | Analytics |
