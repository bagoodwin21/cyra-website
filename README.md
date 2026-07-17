# CYRA Wellness Website

Marketing site for CYRA Wellness (drmondona.com) — a California telemedicine
practice for **women's hormonal and metabolic health** (perimenopause,
menopause, PMDD/PMS, postpartum depression, vaginal pain & dryness, women's
sexual health, weight, and metabolic health, including testosterone for
women), led by Dr. Mondona Goodwin, DO. Proactive, preventative care with
longer appointments and close follow-up.

## Editing the words on the site

**All user-visible copy lives in one file: [`src/content/site-content.ts`](src/content/site-content.ts).**
Headlines, paragraphs, lists, the 3-step "How to Join", the care-plan
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

## Site structure (4 pages)

```
/                    Long-form home page. Sections:
                       hero · philosophy ("more than hot flashes") ·
                       what we treat · testosterone · How to Join (3 steps,
                       #how-to-join) · Care Plan inclusions + pricing
                       (#care-plan) · testimonials · FAQ · final CTA
/about               Dr. Goodwin bio, philosophy, credentials
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
    (site)/               Shared Navbar/Footer layout (home, about, legal)
    book/                 Booking page (own minimal layout)
    layout.tsx            Fonts, metadata defaults, GTM, preconnects
    sitemap.ts            Static: /, /about, /book, legal pages
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

The one-year care plan is **$175 × 13 monthly payments through Cherry** (with
approved credit) **or 5% off when paid upfront** ($2,161.25 vs. the $2,275
total). The numbers live in `carePlanPricing` at the top of
`src/content/site-content.ts`; all displayed dollar amounts derive from them.
Cherry is the only financing partner. Never phrase as "from $X/month".

## Standing content rules

- **California only** — no other states in copy or schema.
- **Cherry is the only financing partner** mentioned anywhere.
- Care plan pricing: monthly Cherry payments **or** a discounted upfront
  payment — never "from $X/month".
- Unconfirmed numbers stay as visible `[PLACEHOLDER]` strings; don't invent
  phone numbers, addresses, or portal URLs.
- Tone: warm, direct, evidence-informed; no cure claims.

## Analytics

GTM loads from `NEXT_PUBLIC_GTM_ID` (disabled until set). Events pushed to the
dataLayer (see `src/lib/analytics.ts`): `book_consult_click` (any CTA to
`/book`, auto-tracked) and `financing_check_rate_click` (the care-plan CTA).

## Deployment (Vercel)

1. Import the GitHub repo in Vercel (framework: Next.js, root directory `/`).
2. Set the environment variables from `.env.example` in Project Settings.
3. Point `drmondona.com` and `www.drmondona.com` at the project;
   `vercel.json` 308-redirects www → apex and sets security/cache headers.
4. Every push to the production branch deploys automatically; PRs get preview URLs.

## Open placeholders

Calendly embed (`src/components/ui/calendly-placeholder.tsx`), the one-hour
consult fee (not yet published as a number — referenced only as a separate
one-time fee in `home.carePlan.note`), professional headshot photography,
patient portal URL, and full content for `/privacy-policy` and
`/terms-of-service`.
