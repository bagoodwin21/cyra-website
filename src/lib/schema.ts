import { conditions, type ConditionInfo } from "@/lib/conditions";
import { siteConfig } from "@/lib/site";

/**
 * JSON-LD builders for the schema.org markup used across the site.
 * Note: CYRA serves California only — keep areaServed in sync with
 * siteConfig.licensedStates.
 */

const physicianEntity = {
  "@type": "Physician",
  name: "Dr. Mondona Goodwin, DO",
  honorificSuffix: "DO",
  medicalSpecialty: ["Endocrinology", "PrimaryCare"],
  description:
    "Board-certified DO specializing in perimenopause, menopause, hormone replacement therapy (including testosterone for women), thyroid health, and midlife weight management.",
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
    email: "hello@drmondona.com",
    priceRange: "$$",
    areaServed: {
      "@type": "State",
      name: "California",
    },
    // Telehealth-only practice — no physical patient location.
    serviceType: "Telemedicine",
    employee: physicianEntity,
    availableService: Object.entries(conditions).map(([slug, info]) => ({
      "@type": "MedicalTherapy",
      name: `${info.title} Care`,
      url: `${siteConfig.url}/what-we-treat/${slug}`,
      description: info.description,
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
export function faqPageSchema(faqs: SchemaFAQ[]) {
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

/** MedicalCondition + MedicalTherapy schema pair for a condition page. */
export function conditionSchema(slug: string, info: ConditionInfo) {
  const url = `${siteConfig.url}/what-we-treat/${slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalCondition",
        name: info.title,
        url,
        description: info.summary,
        signOrSymptom: info.symptoms.map((symptom) => ({
          "@type": "MedicalSymptom",
          name: symptom,
        })),
        possibleTreatment: {
          "@type": "MedicalTherapy",
          name: `${info.title} Treatment at CYRA Wellness`,
        },
      },
      {
        "@type": "MedicalTherapy",
        name: `${info.title} Treatment at CYRA Wellness`,
        url,
        description: info.treatment.join(" "),
        provider: {
          "@type": "MedicalBusiness",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
    ],
  };
}
