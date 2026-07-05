export const siteConfig = {
  name: "CYRA Wellness",
  url: "https://drmondona.com",
  tagline: "Physician-led hormone care, built around you",
  description:
    "CYRA Wellness is a California cash-pay telemedicine practice specializing in perimenopause, menopause, hormone replacement therapy (including testosterone), and midlife weight management. Led by Dr. Mondona Goodwin, DO.",
  physician: "Dr. Mondona Goodwin, DO",
  licensedStates: "Licensed in California",
  /**
   * Practice SMS number for "text us" links (E.164, e.g. +18055551234).
   * Set NEXT_PUBLIC_SMS_NUMBER; text-us UI stays hidden until it's real.
   */
  smsNumber: process.env.NEXT_PUBLIC_SMS_NUMBER ?? "",
  disclaimer:
    "CYRA Wellness provides cash-pay telemedicine services. We do not accept insurance.",
};

/**
 * HubSpot Forms API destination for lead-capture tools (quiz email gate).
 * Set NEXT_PUBLIC_HUBSPOT_PORTAL_ID / NEXT_PUBLIC_HUBSPOT_FORM_ID (see
 * .env.example) and the submission in src/lib/hubspot.ts starts posting
 * for real; until then it degrades to a silent no-op.
 */
export const hubspotConfig = {
  portalId: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID ?? "[HUBSPOT_PORTAL_ID]",
  formId: process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID ?? "[HUBSPOT_FORM_ID]",
};

/** Real dollar total for the 12-month care plan. Placeholder pending pricing confirmation. */
export const carePlanTotal = "[CARE_PLAN_TOTAL]";

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "What We Treat", href: "/what-we-treat" },
  { label: "About Us", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Compare", href: "/compare" },
  { label: "FAQ", href: "/faq" },
];

/** Pages linked from the footer (and sitemap) but not the main nav. */
export const secondaryLinks: NavLink[] = [
  { label: "Symptom Quiz", href: "/quiz" },
  { label: "Patient Resources", href: "/patient-resources" },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];
