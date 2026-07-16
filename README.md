# CYRA Wellness Website

Marketing site for CYRA Wellness (drmondona.com) — a California cash-pay
telemedicine practice specializing in perimenopause, menopause, HRT
(including testosterone), and midlife weight management, led by
Dr. Mondona Goodwin, DO.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (design tokens in `src/app/globals.css` + `tailwind.config.ts`)
- Framer Motion (page transitions, quiz steps, card lift, FAQ accordion)
- shadcn/ui-style components (`src/components/ui`)
- next/font: Playfair Display (headings) + Inter (body), latin subset only

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the IDs you have (all optional in dev)
npm run dev                  # http://localhost:3000
npm run build                # production build
npm run analyze              # build with bundle treemaps (.next/analyze/)
```

## Project structure

```
src/
  app/
    (site)/               # All standard pages (shared Navbar/Footer layout)
      what-we-treat/
        [condition]/      # One template statically generates all condition
                          # pages + their per-condition OG images
      quiz/               # Hormone symptom assessment (standalone route)
      compare/            # Comparison page + client table component
    book/                 # Distraction-free booking page (own minimal layout)
    layout.tsx            # Fonts, metadata defaults, GTM, preconnects
    sitemap.ts            # Auto-generated from nav/condition data
    robots.ts             # Allow all, disallow /api/
    opengraph-image.tsx   # Default branded OG card (next/og)
  components/
    ui/                   # Button, Badge, Card, Section, FAQ, carousel, etc.
    layout/               # Navbar, Footer, PageTransition
    quiz/                 # Quiz steps (question, email gate, results)
    pricing/              # Care plan cost estimator
    analytics/            # GTM snippet, click listener, page-view tracker
    seo/                  # JsonLd component
  data/                   # Editable content JSON (testimonials, comparison)
  lib/                    # site config, conditions content, quiz scoring,
                          # SEO/schema builders, analytics, HubSpot client
```

## Editing content

### Testimonials

Edit `src/data/testimonials.json`. Each entry is:

```json
{ "quote": "…", "name": "First L.", "location": "City, CA" }
```

The home page carousel picks them up automatically.

### Pricing

Constants live in two places:

- `src/lib/site.ts` — `carePlanPricing` (monthly payment, Cherry payment
  count, upfront discount percent). `carePlanTotal` and
  `carePlanUpfrontTotal` derive from it automatically, and both the
  pricing page cards and the `/pricing#estimator` calculator read from
  this single source — change the numbers once, they update everywhere.
- `src/app/(site)/pricing/page.tsx` — the `tiers` array (Start Visit price,
  monthly care plan price, included features).

### Comparison table

Edit `src/data/comparison.json`. `platforms` is the column order; each row has
a `criterion` and one cell per platform with an optional `verdict`
(`"yes" | "no" | "partial"`) and optional `note`. Keep cell order matched to
`platforms`, with CYRA first (the first column gets the highlighted sticky
treatment).

### Adding a new condition page

1. Add an entry to `src/lib/conditions.ts` keyed by the URL slug — fill in
   every field of `ConditionInfo` (content sections, symptoms, FAQs).
2. Map the slug to an icon in `src/lib/condition-icons.ts`.
3. Done — the page, its OG image, home-page tile, /what-we-treat card,
   sitemap entry, and quiz recommendation targets all generate from that data.

To make the quiz recommend the new condition, tag relevant answer options
with the new slug in `src/lib/quiz.ts`.

### Standing content rules

- **California only** — no other states in licensing, FAQ, or schema copy.
- **Cherry is the only financing partner** mentioned anywhere.
- Cherry pricing is monthly payments with approved credit **or** a discounted
  upfront payment — never "from $X/month".
- Unconfirmed numbers stay as visible `[PLACEHOLDER]`-style strings; don't
  invent values.

## Analytics

GTM loads from `NEXT_PUBLIC_GTM_ID` (disabled until set). Events pushed to
the dataLayer (see `src/lib/analytics.ts`): `book_consult_click`,
`quiz_start`, `quiz_complete`, `quiz_result_tier`, `compare_page_view`,
`compare_table_scroll`, `financing_check_rate_click`, `condition_page_view`.

## Deployment (Vercel)

1. Import the GitHub repo in Vercel (framework: Next.js, root directory `/`).
2. Set the environment variables from `.env.example` in Project Settings.
3. Point `drmondona.com` and `www.drmondona.com` at the project;
   `vercel.json` 308-redirects www → apex and sets security/cache headers.
4. Every push to `main` deploys automatically; PRs get preview URLs.

## Open placeholders

Calendly embed (`src/components/ui/calendly-placeholder.tsx`), Cherry
rate-check widget (`/pricing`), HubSpot portal/form IDs, professional
membership badges, patient portal URL, new-patient checklist PDF,
photography, and full content for `/why-cyra`, `/privacy-policy`, and
`/terms-of-service`. Care plan pricing is confirmed (see `carePlanPricing`
in `src/lib/site.ts`).
