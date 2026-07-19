# CYRA Wellness Website

Marketing site for CYRA Wellness (drmondona.com) — a California, **membership-based**
telemedicine practice for **women's hormonal conditions throughout life, not
just menopause** (perimenopause, menopause, PMS/PMDD, postpartum depression,
vaginal dryness & pain, sexual health & libido, weight & metabolic health,
fatigue, sleep, and contraception, including testosterone for women), led by
Dr. Mondona Goodwin, DO — a board-certified Internal Medicine physician and
Menopause Society Certified Practitioner (MSCP). Proactive, evidence-based care
that works alongside your PCP and OB/GYN, with longer appointments and close
follow-up.

## Editing the words on the site

**All user-visible copy lives in one file: [`src/content/site-content.ts`](src/content/site-content.ts).**
Headlines, paragraphs, lists, the 3-step "How to Join", the membership
inclusions, pricing numbers, FAQ, testimonials, and contact info are all
there. Pages only handle layout — they read their text from that file.

If you're not a developer, read **[EDITING.md](EDITING.md)** — a plain-English
guide to changing text on github.com and letting Vercel redeploy.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (design tokens in `src/app/globals.css` + `tailwind.config.ts`)
- Framer Motion (page transitions, card lift, FAQ accordion)
- Fonts: Playfair Display (headings) + Quicksand (body) + Alex Brush (script accent)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the IDs you have (all optional in dev)
npm run dev                  # http://localhost:3000
npm run build                # production build
```

## Site structure (6 pages)

```
/                    Long-form home page. Sections:
                       hero · philosophy ("more than hot flashes") ·
                       collaborative approach (works with PCP/OB-GYN) ·
                       what we treat · testosterone · "Is CYRA right for you?" ·
                       How to Join (3 steps, #how-to-join) · Membership
                       inclusions + pricing (#membership) · insurance & cost
                       savings · compare teaser · testimonials · FAQ · final CTA
/about               Dr. Goodwin first-person bio, credentials (DO, Internal
                       Medicine board certification, MSCP)
/compare             How CYRA compares to other menopause/HRT platforms —
                       dimensions, side-by-side table, deeper dives, checklist
/book                Distraction-free "Request More Information" page
                       (Calendly placeholder), own minimal layout
/privacy-policy      Placeholder (content to be finalized)
/terms-of-service    Placeholder (content to be finalized)
```

```
src/
  content/
    site-content.ts       ← THE ONE FILE to edit for all copy + pricing
  app/
    (site)/               Shared Navbar/Footer layout (home, about, compare, legal)
    book/                 Booking page (own minimal layout)
    layout.tsx            Fonts, metadata defaults, GTM, preconnects
    sitemap.ts            Static: /, /about, /compare, /book, legal pages
    robots.ts             Allow all, disallow /api/
    opengraph-image.tsx   Branded OG card (next/og)
  components/
    ui/                   Button, Badge, Card, Section, FAQ, testimonials, etc.
    layout/               Navbar, Footer, MobileBookBar, PageTransition
    analytics/            GTM snippet + click listener
    seo/                  JsonLd component
  lib/                    site (adapter over content), SEO/schema builders,
                          analytics, fonts, utils
```

## Pricing (confirmed)

The one-year membership is **$175 × 13 monthly payments through Cherry** (with
approved credit) **or 5% off when paid upfront** ($2,161.25 vs. the $2,275
total). The one-time **comprehensive consultation fee is $399** (charged once,
before enrolling). All four numbers live in `carePlanPricing` at the top of
`src/content/site-content.ts` (the key name is unchanged; every displayed dollar
amount derives from them). Cherry is the only financing partner. Never phrase as
"from $X/month".

## Standing content rules

- **California only** — no other states in copy or schema.
- **Cherry is the only financing partner** mentioned anywhere. The GoodRx /
  coupon / manufacturer / supplement savings in the "Insurance & cost savings"
  section reduce **medication** costs — they are not financing; keep that
  distinction clean.
- **Membership** is the user-facing term (not "care plan"); membership is
  cash-pay, though insurance is used for labs/prescriptions when possible.
- Membership pricing: monthly Cherry payments **or** a discounted upfront
  payment — never "from $X/month".
- Unconfirmed numbers stay as visible `[PLACEHOLDER]` strings; don't invent
  phone numbers, addresses, or portal URLs.
- Tone: warm, direct, evidence-informed; no cure claims.

## Analytics

GTM loads from `NEXT_PUBLIC_GTM_ID` (disabled until set). Events pushed to the
dataLayer (see `src/lib/analytics.ts`): `book_consult_click` (any CTA to
`/book`, auto-tracked), `financing_check_rate_click` (the membership CTA),
`compare_page_view` (the /compare page), and `compare_table_scroll` (first
horizontal scroll of the comparison table).

## Deployment (Vercel)

1. Import the GitHub repo in Vercel (framework: Next.js, root directory `/`).
2. Set the environment variables from `.env.example` in Project Settings.
3. Point `drmondona.com` and `www.drmondona.com` at the project;
   `vercel.json` 308-redirects www → apex and sets security/cache headers.
4. Every push to the production branch deploys automatically; PRs get preview URLs.

## Open placeholders

Calendly embed (`src/components/ui/calendly-placeholder.tsx`), professional
headshot photography, patient portal URL, and full content for
`/privacy-policy` and `/terms-of-service`. (The comprehensive consultation
fee is confirmed at $399 — `carePlanPricing.consultFee`.)
