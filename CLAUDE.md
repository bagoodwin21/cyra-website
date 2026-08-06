# CYRA Wellness website

Marketing site for CYRA Wellness (drmondona.com), Dr. Mondona Goodwin's
California telemedicine practice for women's hormonal health. Next.js 14
(App Router) + TypeScript + Tailwind. Deployed on Cloudflare Workers via
OpenNext — every push to `main` goes live automatically.

## Editing content (most common task)

Every user-visible word on the site lives in ONE file:
`src/content/site-content.ts`. It is organized by page and section with
plain-English comments. Pages contain layout only. To change any headline,
paragraph, list, price, or FAQ answer, edit that file — nothing else.
EDITING.md explains the file for non-developers.

Pricing numbers live at the top of the same file (`carePlanPricing`).
Dollar amounts shown on the site (totals, the Cherry calculator amount)
are computed from them — change the number once, everything updates.

If Dr. Goodwin asks for a change in plain English, make the edit for her,
verify, and push. Keep her wording and meaning; polish lightly for the web.

## Verify before pushing

Run `npm install` (first time) and `npm run build`. The build must pass
with no errors. A failed build never reaches the live site (Cloudflare
keeps the previous version), but do not push a broken build.

## Standing content rules — never violate these

- **California only.** No other states, anywhere.
- **Cherry is the only financing partner.** GoodRx, coupons, manufacturer
  programs, and HRT Club are medication cost savings or pharmacy options —
  never call them financing.
- Confirmed pricing: $399 one-hour consultation (credited toward
  membership if enrolling within 14 days); membership $2,275, paid as
  13 payments of $175 through Cherry (one at signing, then 12 monthly)
  or $2,160 upfront. Never phrase pricing as "from $X/month", and say
  "13 payments", never "13 months" or "13 monthly payments".
- **Membership dollar amounts stay OFF public marketing pages**
  (Dr. Goodwin's decision, Aug 2026). Pricing is discussed on the free
  Discovery Call or by text. The numbers appear in exactly three
  places: the /book/consultation scheduler disclosure (immediately
  before payment — never remove it), the Terms of Service, and the
  signed agreement. The pricing-visible copy is kept in comments
  marked BACKUP in site-content.ts in case she reverses this. Do not
  put dollar amounts back on marketing pages without her explicit
  direction.
- Primary booking CTAs say **"Get Started"** (the /book page heading is
  "Book Your Visit"). Both booking paths — free Discovery Call and the
  $399 consultation — must stay visible on /book.
- The $399 consultation is the PRIMARY booking path ("most patients
  start here"); the free Discovery Call is the optional, secondary
  on-ramp — never frame it as a required first step.
- The free Discovery Call is about the practice — it is NOT a medical
  appointment and no medical advice is given (that line always stays).
  It is run by the Patient Care Coordinator, never Dr. Goodwin. The
  site copy says "our team" / "my team" rather than naming the
  coordinator's title (Dr. Goodwin's decision, Aug 2026) — but never
  state or imply that Dr. Goodwin is on the call. The explicit
  coordinator disclosure lives in the Calendly booking form checkbox.
- Practice texting number: 805-387-9078 (editable in the content file
  as brand.smsNumber/smsDisplay).
- **Never invent facts**: no made-up prices, phone numbers, addresses,
  credentials, statistics, medical claims, or testimonials. Unconfirmed
  values stay as visible [PLACEHOLDER] text until Dr. Goodwin confirms
  them. Credentials are: DO, board-certified in Internal Medicine,
  Menopause Society Certified Practitioner (MSCP), 10+ years. No "MD".
- Warm, evidence-informed tone in Dr. Goodwin's first person on the home
  and about pages. No cure claims.
- Use em-dashes sparingly. Prefer commas, periods, or parentheses;
  reach for an em-dash only when nothing else reads as well.

## Structure

- `src/content/site-content.ts` — ALL copy (the only edit surface)
- `src/app/(site)/` — pages: home, about, compare (+ legal placeholders)
- `src/app/book/` — distraction-free booking page
- `src/components/` — UI, layout, pricing (Cherry calculator), analytics
- `src/lib/` — site config adapter, SEO/schema builders, analytics
- Env vars (all optional; features hide until set): see `.env.example`
