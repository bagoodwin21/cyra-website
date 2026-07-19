import { content } from "@/content/site-content";
import { siteConfig } from "@/lib/site";

/**
 * JSON-LD builders for the schema.org markup used across the site.
 * Note: CYRA serves California only — keep areaServed in sync with
 * siteConfig.licensedStates. All human-readable copy comes from the
 * editable content file (src/content/site-content.ts).
 */

const physicianEntity = {
  "@type": "Physician",
  name: siteConfig.physician,
  honorificSuffix: "DO",
  medicalSpecialty: ["Gynecologic", "Endocrinology", "PrimaryCare"],
  description:
    "Board-certified in Internal Medicine and a Menopause Society Certified Practitioner (MSCP), specializing in women's hormonal and metabolic health — perimenopause, menopause, PMDD, PMS, postpartum depression, sexual health, testosterone for women, and weight management.",
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Board Certification",
      name: "Board-Certified in Internal Medicine",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Certification",
      name: "Menopause Society Certified Practitioner (MSCP)",
    },
  ],
  url: `${siteConfig.url}/about`,
  worksFor: {
    "@type": "MedicalBusiness",
    name: siteConfig.name,
    url: siteConfig.url,
  },
};

/** MedicalBusiness schema for the home page. */
export function medicalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    email: siteConfig.email,
    priceRange: "$$",
    areaServed: {
      "@type": "State",
      name: "California",
    },
    // Telehealth-only practice — no physical patient location.
    serviceType: "Telemedicine",
    employee: physicianEntity,
    availableService: content.home.whatWeTreat.items.map((item) => ({
      "@type": "MedicalTherapy",
      name: `${item.title} Care`,
      description: item.body,
    })),
  };
}

/** Physician schema for the /about page. */
export function physicianSchema() {
  return {
    "@context": "https://schema.org",
    ...physicianEntity,
  };
}

export interface SchemaFAQ {
  question: string;
  answer: string;
}

/** FAQPage schema from a flat list of Q&As. */
export function faqPageSchema(faqs: readonly SchemaFAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
