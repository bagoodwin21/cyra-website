# CYRA HubSpot Automation Playbook

Every automated email in the enrollment journey: what triggers it, when it
sends, when it stops, and the full draft copy to paste into HubSpot.
Companion to `ENROLLMENT_RUNBOOK.md` (stage numbers below refer to it).

**Status: DRAFT — review every email with Dr. Mondona before activating**
(clinical accuracy + legal review). Copy is written in CYRA's site voice:
warm, direct, physician-led, honest about money.

## ⚠️ Ground rules (read before building)

1. **No PHI in automated email.** Emails describe *process* (your call,
   your visit, your next step) — never symptoms, results, diagnoses, or
   treatment. Quiz results stay on the website; emails link to process
   pages only.
2. **No care-plan dollar figures in emails.** Pricing lives in
   `src/lib/carePlans.ts` and on `/pricing` — emails link there instead of
   hardcoding numbers that will drift. **One exception:** the $399
   consultation fee appears in Workflow 3 (patients must know the charge
   before booking). If that fee ever changes, HubSpot is now a place to
   update — it's flagged in the runbook pricing checklist.
3. **Form links come from OptiMantra, never HubSpot.** Consent packets
   and intake forms are patient-specific secure links — they belong in
   OptiMantra's own transactional emails, which also track completion in
   the chart. HubSpot's job is the *heads-up*: every email that precedes
   an OptiMantra send names the sender ("watch for an email from
   OptiMantra — that's our patient portal") so the unfamiliar sender
   doesn't get ignored or spam-foldered. Two emails, two jobs: HubSpot
   sets expectations, OptiMantra delivers the secure link.
4. **Marketing vs. transactional.** Workflows 1 and the re-engagement
   emails are marketing (unsubscribe required, marketing-contact status).
   Workflows 2–7 are operational/transactional follow-ups to an active
   patient relationship — still include an unsubscribe, but send from the
   practice inbox with a monitored reply-to (hello@drmondona.com).
4. **HubSpot terminology:** these are **Workflows** (contact-based
   automation), not "Sequences" (HubSpot's 1:1 sales-rep tool). Build
   under Automation → Workflows.

## Setup prerequisites

**Custom contact property** — `enrollment_status` (dropdown). This single
property drives everything; Brandon updates it manually after each human
touchpoint until the OptiMantra webhook automates parts of it:

| Value | Set when | Set by |
| --- | --- | --- |
| `lead` | Quiz/form capture | HubSpot form (default) |
| `discovery_booked` | Discovery call booked | Calendly↔HubSpot integration |
| `invited_to_book` | Post-call: good fit, sent /eligibility | Brandon, right after the call |
| `consult_booked` | Initial consultation booked & paid | Brandon (or OptiMantra webhook, runbook Stage 8) |
| `plan_proposed` | Post-consult: care plan proposed, sent /enroll | Brandon |
| `cherry_pending` | Chose Cherry, approval not yet confirmed | Brandon |
| `enrolled` | Agreement signed + payment secured | Brandon |
| `declined` | Chose not to proceed (any stage) | Brandon |
| `ineligible_medicare` | 65+ routed out | Brandon |

**Lifecycle mapping:** `lead` → Lead · `discovery_booked` → Opportunity ·
`enrolled` → Customer.

**Integrations:** HubSpot form IDs in Vercel env (runbook Stage 1),
Calendly↔HubSpot connected (Stage 2), OptiMantra outbound webhook
optional but recommended to auto-set `consult_booked` (Stage 8).

**Suppression rule (add to every workflow):** exit immediately if
`enrollment_status` = `declined`, `ineligible_medicare`, or `enrolled`
(except Workflow 6, which targets `enrolled`).

---

## Workflow map

| # | Name | Trigger (enrollment_status) | Emails | Goal / exit |
| --- | --- | --- | --- | --- |
| 1 | Quiz lead nurture | `lead` | 4 over 14 days | Book discovery call |
| 2 | Discovery call prep | `discovery_booked` | 1 | Show up prepared |
| 3 | Book your consultation | `invited_to_book` | 3 over 7 days | Book + pay consult |
| 4 | Consultation prep | `consult_booked` | 1 (+ reminder note) | Show up prepared |
| 5 | Enrollment follow-through | `plan_proposed` | 3 over 7 days | Complete /enroll |
| 6 | Welcome & onboarding | `enrolled` | 1 | Sign consent, engage |
| 7 | Cherry application rescue | `cherry_pending` > 24h | 1 | Finish or switch |

Exit for 1, 3, 5, 7: the moment `enrollment_status` advances.

---

## Workflow 1 — Quiz lead nurture

**Trigger:** quiz form submission (`enrollment_status` = `lead`).
**Exit:** `discovery_booked` or beyond; unsubscribe.

### Email 1.1 — immediately

**Subject:** Your assessment results (and what they actually mean)

Hi {{contact.firstname}},

Thanks for taking the CYRA symptom assessment. Your results are on the
screen you just saw — but here's the part that matters more than any
score: if your symptoms are affecting your life, they're worth
evaluating. "Normal for your age" is a description, not a treatment plan.

CYRA is the telemedicine practice of Dr. Mondona Goodwin, DO — a
California physician who specializes in exactly this: perimenopause,
menopause, hormone therapy, and midlife weight changes.

The first step is a free 15-minute discovery call. No charge, no
commitment — just a conversation about what you're experiencing and an
honest answer about whether we can help.

[Book your free discovery call →](https://drmondona.com/book)

— The CYRA Wellness team

### Email 1.2 — day 3

**Subject:** "Your labs are normal." Then why do you feel like this?

Hi {{contact.firstname}},

If you've heard some version of "everything looks fine" while feeling
anything but fine, you're in the majority of women we talk to.

Standard lab ranges are built for the average population — not for what's
optimal for you, at your age and stage. Dr. Mondona reads your labs in
the context of your symptoms, your history, and your goals. That's the
difference between being screened and being treated.

If that resonates, the discovery call is free and takes 15 minutes.

[Book your free discovery call →](https://drmondona.com/book)

— The CYRA Wellness team

### Email 1.3 — day 7

**Subject:** What a discovery call is (and isn't)

Hi {{contact.firstname}},

Quick and honest, because we know "book a call" can feel like a sales
trap:

**What it is:** 15 minutes. You describe what's going on. We tell you —
truthfully — whether CYRA is the right fit, what care would look like,
and exactly what it costs. Then you decide, on your own time.

**What it isn't:** a hard sell, a commitment, or a charge. Some women we
talk to aren't a fit for CYRA, and we say so.

[Book your free discovery call →](https://drmondona.com/book)

— The CYRA Wellness team

### Email 1.4 — day 14 (last touch)

**Subject:** Still thinking about it? That's okay.

Hi {{contact.firstname}},

No pressure from us — deciding to take your symptoms seriously is a
process, and you're allowed to take your time.

Two things worth knowing while you think:

- Care at CYRA is a structured 12-month care plan with a physician who
  answers to you, not an insurance company. Transparent pricing is at
  [drmondona.com/pricing](https://drmondona.com/pricing), including
  monthly payment options through Cherry.
- The discovery call stays free. Whenever you're ready:
  [drmondona.com/book](https://drmondona.com/book)

We'll leave you be after this one — you can always find us.

— The CYRA Wellness team

---

## Workflow 2 — Discovery call prep

**Trigger:** `discovery_booked` (via Calendly integration).
**Note:** let Calendly send the calendar invite + 24h/1h reminders; this
email is the *what to expect* layer, not the reminder.

### Email 2.1 — immediately after booking

**Subject:** You're booked — here's how to get the most from your call

Hi {{contact.firstname}},

Your discovery call is confirmed — the calendar invite is in your inbox.

It's 15 minutes, free, and here's how we'll spend it:

1. **Your story.** What you're experiencing, how long, what you've tried.
2. **Honest fit.** Whether CYRA's approach matches what you need — and if
   it doesn't, we'll say so.
3. **The practical stuff.** How care works, what it costs, and what your
   next step would be. No surprises later.

**Worth jotting down beforehand:** your main symptoms and roughly when
they started, any hormone tests or treatments you've had, and the one
question you most want answered.

Need to reschedule? Use the link in your calendar invite.

Talk soon,
Brandon
CYRA Wellness

---

## Workflow 3 — Book your consultation

**Trigger:** Brandon sets `invited_to_book` right after a good-fit call.
**Exit:** `consult_booked`; or `declined` / `ineligible_medicare`.
**⚠️ Contains the $399 figure — sync if pricing changes.**

### Email 3.1 — within the hour after the call

**Subject:** Your next step: book your initial consultation

Hi {{contact.firstname}},

Great talking with you today. Based on our conversation, the next step is
your initial consultation with Dr. Mondona — the comprehensive visit
where your care actually begins.

**Book here:** [drmondona.com/eligibility](https://drmondona.com/eligibility)
(a quick eligibility confirmation, then straight to scheduling)

**What the consultation is:** a full 60 minutes with Dr. Mondona — your
complete history reviewed in depth, lab orders tailored to you, initial
protocol recommendations, and a written care plan proposal.

**What it costs:** $399, charged when you book. It reserves your visit
and your doctor's time. To be fully transparent: it's non-refundable, but
you can reschedule if something comes up — and completing the
consultation carries no obligation to continue with a care plan.

Questions before you book? Just reply to this email.

Brandon
CYRA Wellness

### Email 3.2 — day 3, if not booked

**Subject:** Holding your spot — and answering the usual questions

Hi {{contact.firstname}},

Following up from our call — here are the three questions almost everyone
asks before booking, answered straight:

**"What if Dr. Mondona finds I'm not a fit?"** Then you'll know that,
plus what she'd suggest instead — the consultation stands on its own,
with no obligation to continue.

**"Is the care plan a big lump sum?"** It doesn't have to be. Care plans
can be split into monthly payments through Cherry, our financing partner
— checking your rate takes a minute and doesn't affect your credit score.

**"Can insurance help?"** We're cash-pay (that's how the visits stay
60 minutes), but many PPO plans reimburse out-of-network care — we
provide the paperwork (a superbill), and HSA/FSA funds generally apply.

Ready when you are:
[drmondona.com/eligibility](https://drmondona.com/eligibility)

Brandon
CYRA Wellness

### Email 3.3 — day 7, last nudge

**Subject:** No rush — but don't let it drift

Hi {{contact.firstname}},

I'll stop nudging after this one. The pattern we see most often: women
wait until symptoms get louder before acting, and then wish they'd
started sooner.

Whenever you're ready, your booking link is here:
[drmondona.com/eligibility](https://drmondona.com/eligibility)

And if the timing just isn't right — or something's holding you back that
I can help with — reply and tell me. I read every response.

Brandon
CYRA Wellness

---

## Workflow 4 — Consultation prep

**Trigger:** `consult_booked` (manual, or OptiMantra webhook).
**Note:** OptiMantra should own the appointment reminders; this email is
preparation. If OptiMantra reminders aren't configured, add a day-before
reminder email here.

### Email 4.1 — immediately after booking

**Subject:** You're booked with Dr. Mondona — how to prepare

Hi {{contact.firstname}},

Your initial consultation is confirmed. This is a real, unhurried
60-minute visit — here's how to make it count:

1. **Complete your intake forms.** You'll get a separate email from
   **OptiMantra** — that's our patient portal, and it's really us. It
   holds your secure forms link; if you don't see it within the hour,
   check spam or reply here and we'll resend. Dr. Mondona reads
   everything in advance — the more you share, the deeper the visit goes.
2. **Upload any past labs or records** you have, even old ones. They
   help establish your baseline.
3. **Tech check:** you'll get a video-visit link; a phone, tablet, or
   computer with a camera and a quiet spot is all you need.

**What happens during the visit:** your full history and symptoms in
depth, labs ordered for your situation, initial recommendations, and —
if it's right for you — a personalized care plan proposal to consider.
No decisions required on the spot.

See you soon,
The CYRA Wellness team

---

## Workflow 5 — Enrollment follow-through

**Trigger:** Brandon sets `plan_proposed` after the consultation.
**Exit:** `enrolled`, `cherry_pending`, or `declined`.

### Email 5.1 — same day as the consultation

**Subject:** Your care plan from Dr. Mondona — next steps

Hi {{contact.firstname}},

It was a pleasure having you with Dr. Mondona today. Your personalized
care plan proposal is ready to act on whenever you are.

**Enroll here:** [drmondona.com/enroll](https://drmondona.com/enroll)

The enrollment page walks you through your two payment options:

- **Monthly payments through Cherry** — equal payments with approved
  credit; checking your rate takes about a minute and doesn't affect
  your credit score.
- **Pay in full** — one payment on your card on file (ask us about the
  upfront-payment option).

You'll also review your care plan agreement there — the same terms we
discussed, in writing, no surprises.

Questions about anything in the plan? Reply here or bring them to us
directly — that's what we're for.

Brandon
CYRA Wellness

### Email 5.2 — day 3, if not enrolled

**Subject:** If it's the numbers, let's talk numbers

Hi {{contact.firstname}},

If you're still deciding, it's usually about money — so here's everything
that helps:

- **Cherry financing** splits your care plan into equal monthly payments
  with approved credit. Soft credit check only:
  [check your rate](https://drmondona.com/pricing).
- **HSA/FSA funds** generally apply to CYRA care — that's pre-tax money.
- **Out-of-network reimbursement:** many PPO plans reimburse part of
  physician care like this. We provide the superbill and point you to
  services that file the claim for you.

And if something other than money is giving you pause — reply and say so.
Dr. Mondona would rather answer a hard question than have you sit with
it.

Brandon
CYRA Wellness

### Email 5.3 — day 7

**Subject:** Where did you land?

Hi {{contact.firstname}},

Checking in one last time about your care plan. Three honest options:

1. **Ready?** [drmondona.com/enroll](https://drmondona.com/enroll)
2. **Have questions?** Reply — or grab 10 minutes with me and we'll talk
   it through.
3. **Not the right time?** Tell me that too, and I'll stop following up.
   Your consultation results and proposal don't expire overnight — the
   door stays open.

Brandon
CYRA Wellness

---

## Workflow 6 — Welcome & onboarding

**Trigger:** `enrolled` (agreement acknowledged + payment secured).

### Email 6.1 — immediately

**Subject:** Welcome to CYRA — here's what happens next

Hi {{contact.firstname}},

You're officially enrolled — welcome. Dr. Mondona and the team are
genuinely glad you're here. Your next steps, in order:

1. **Sign your care plan agreement.** A separate email from
   **OptiMantra** (our patient portal — it's really us) has your secure
   signing link. It's the same agreement you reviewed at enrollment; the
   portal copy is your official signed record. Don't see it within the
   hour? Check spam, or reply here and we'll resend.
2. **Watch for your care plan schedule** — we'll set your first
   follow-up with Dr. Mondona and map out your labs.
3. **Use the portal messaging** anytime — questions between visits are
   part of your care plan, not an extra.

One more thing worth saving: if you have a PPO plan, ask us about
superbills for out-of-network reimbursement, and remember HSA/FSA funds
generally apply.

Welcome aboard,
Brandon & the CYRA Wellness team

---

## Workflow 7 — Cherry application rescue

**Trigger:** `cherry_pending` for more than 24 hours (Brandon sets it when
a patient chose Cherry at /enroll; Cherry emails us on approval — if that
email arrived, Brandon advances the status instead and this never sends).

### Email 7.1 — 24–48h after choosing Cherry

**Subject:** Almost there — finish setting up your payment plan

Hi {{contact.firstname}},

You chose monthly payments through Cherry for your care plan — smart way
to spread it out. It looks like the application didn't quite get
finished, which happens all the time (life interrupts).

Two easy ways forward:

- **Pick up where you left off:** reopen your Cherry application link
  (about a minute to finish; soft credit check only).
- **Changed your mind?** You can switch to pay-in-full at
  [drmondona.com/enroll](https://drmondona.com/enroll), or reply here and
  we'll sort it together.

Your care plan is reserved either way — we just can't start until payment
is set up.

Brandon
CYRA Wellness

---

## Also worth automating (not email)

- **Internal notification:** workflow on `enrollment_status` →
  `cherry_pending` or `plan_proposed` that creates a HubSpot task for
  Brandon ("check Cherry dashboard EOD" / "follow up in 3 days") — the
  human steps in the runbook get reminders too.
- **Declined-lead long game:** contacts at `declined` join a low-touch
  quarterly newsletter list (education, no pitch). People come back when
  symptoms escalate; be the practice they remember.
- **Ineligible (65+) courtesy:** a single send with the referral
  resources (their PCP, menopause.org directory) mirroring the
  `/eligibility` decline screen — then suppress from all marketing.

## Deliverability — keeping these out of spam

The worry "they booked via Calendly, so our email is cold" is the wrong
model: someone who booked a call with you *expects* your email, and that
expectation (prompt, relevant, gets opened and replied to) is what
mailbox providers actually measure. The real spam risks are technical
and stylistic. In priority order:

1. **Authenticate the sending domain — this is 90% of it.** In HubSpot,
   connect `drmondona.com` as the email sending domain and publish the
   DKIM records it gives you; also set up SPF and a DMARC policy in DNS
   (start with `p=none` to monitor, tighten later). Unauthenticated mail
   is what actually lands in spam — Gmail/Yahoo now require
   authentication from bulk senders outright.
2. **Send the high-stakes emails as 1:1, not marketing blasts.** Emails
   3.1 (booking link after the call) and 5.1 (care plan next steps)
   should come from Brandon's real inbox — either literally, or via
   HubSpot with a connected Gmail/Workspace inbox so they send through
   Google's own servers. Personal 1:1 mail from a real mailbox has the
   best deliverability there is. Keep HubSpot marketing email for the
   nurture workflows (1, and re-engagement).
3. **Text the most critical link.** The post-discovery-call booking link
   (Workflow 3) shouldn't depend on email at all — Brandon says "I'm
   texting you the link right now" while still on the call, and sends it
   via the practice's texting line. Email 3.1 becomes the backup copy.
   A link received during the conversation can't go to spam.
4. **Prime the patient.** On the discovery call and the quiz results
   page: "You'll get an email from hello@drmondona.com — add us to your
   contacts so nothing gets lost." One sentence, meaningful lift.
5. **Style matters:** plain-text-looking emails (like the drafts above —
   no image banners, few links), a monitored reply-to that encourages
   real replies (replies are the strongest positive signal a mailbox
   provider sees), unsubscribe link + physical practice address on
   marketing sends (CAN-SPAM requires both), and prune contacts who
   never open after Workflow 1 ends.
6. **Verify before going live:** send each workflow email to a
   mail-tester.com address and to test accounts at Gmail/Outlook/Yahoo;
   fix anything flagged before enrolling real contacts.

## What stays manual (by design)

Brandon flips `enrollment_status` after the discovery call, after the
consultation, at Cherry confirmation, and at enrollment — those are
judgment moments, not automation targets. The OptiMantra webhook (runbook
Stage 8) can eventually auto-set `consult_booked`; everything else stays
human until there's a reason to change it.
