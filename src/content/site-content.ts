/* =========================================================================
   CYRA WELLNESS — SITE CONTENT (the one file you edit)
   =========================================================================

   Dr. Goodwin: this is the ONLY file you need to change to update the words
   on the website. Every headline, paragraph, list item, price, and link
   below maps to something you can see on the site.

   Three simple rules:
     1. Only change the text INSIDE the "quotation marks".
     2. Never delete the quotes, commas, brackets [ ], or braces { }.
     3. Save, and Vercel rebuilds the live site automatically.

   The plain-English comments (the grey lines starting with //) tell you
   exactly where each piece of text appears. See EDITING.md for a friendly
   walk-through.
   ========================================================================= */

/* -------------------------------------------------------------------------
   MONEY / PRICING NUMBERS
   These are numbers (no quotes, no dollar sign) because the site does math
   with them. Change the number only. The dollar amounts shown on the site
   are calculated from these automatically.
   ------------------------------------------------------------------------- */
export const carePlanPricing = {
  monthlyPayment: 175, // Care plan: dollars per monthly Cherry payment
  paymentCount: 13, // Number of monthly payments (Cherry splits 12 months into 13)
  upfrontDiscountPercent: 5, // Percent saved when the plan is paid in full upfront
} as const;

// Derived totals — you do NOT need to edit these; they update on their own.
export const carePlanTotal =
  carePlanPricing.monthlyPayment * carePlanPricing.paymentCount; // 2275
export const carePlanUpfrontTotal =
  carePlanTotal * (1 - carePlanPricing.upfrontDiscountPercent / 100); // 2161.25

/** Formats a number as US dollars, keeping cents only when non-zero. */
export function formatUsd(amount: number): string {
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

/* -------------------------------------------------------------------------
   THE CONTENT
   ------------------------------------------------------------------------- */
export const content = {
  /* =======================================================================
     BRAND & GLOBAL — used in the browser tab, footer, and search results
     ======================================================================= */
  brand: {
    name: "CYRA Wellness", // Practice name (appears in the header and footer)
    // Short phrase under the logo in the footer
    tagline: "Proactive, personalized care for women's hormonal health",
    // One-sentence description used by Google and social media previews
    description:
      "CYRA Wellness is a California telemedicine practice for women's hormonal and metabolic health — perimenopause, menopause, PMDD, PMS, postpartum depression, sexual health, and weight — led by Dr. Mondona Goodwin, DO.",
    website: "https://drmondona.com", // Live website address (leave as-is unless the domain changes)
    physician: "Dr. Mondona Goodwin, DO", // Full name + credentials
    licensedStates: "Licensed in California", // Where care is offered — California only
    // Contact email shown in the footer and on the booking page
    email: "hello@drmondona.com",
    // Fine-print line at the bottom of the site
    disclaimer:
      "CYRA Wellness provides cash-pay telemedicine to patients located in California. We do not accept insurance.",
    // Copyright line at the very bottom
    copyright: "© 2025 CYRA Wellness",
  },

  /* =======================================================================
     NAVIGATION — the links in the top menu and the main button
     ======================================================================= */
  nav: {
    // Menu links. "href" is where each one goes; the "#" links jump to a
    // section on the home page. Keep the "/" and "#" symbols as they are.
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "How to Join", href: "/#how-to-join" },
      { label: "Care Plan", href: "/#care-plan" },
    ],
    // The words on the main action button (top-right and mobile bar)
    cta: "Request More Information",
  },

  /* =======================================================================
     HOME PAGE
     ======================================================================= */
  home: {
    // ---- HERO: the very top of the home page ----
    hero: {
      eyebrow: "women's hormonal health", // Small script line above the headline
      // The big headline. The word(s) inside the *asterisks* are shown in
      // an italic accent color — keep the asterisks around them.
      headline: "Hormone care that takes control of your *whole* health.",
      // Supporting paragraph under the headline
      subheadline:
        "Proactive, preventative care for perimenopause, menopause, and the hormonal shifts that shape how you feel. Longer appointments, a plan built around you, and a physician who follows closely — by secure video across California.",
      primaryCta: "Request More Information", // Main button text
      secondaryCta: "How to Join", // Second button text (jumps to the steps)
      // Short trust points shown as a row under the buttons
      trustPoints: [
        "Women's Hormonal Health",
        "Testosterone Included",
        "Longer Appointments",
        "California Telehealth",
      ],
    },

    // ---- PHILOSOPHY: "more than hot flashes" ----
    philosophy: {
      label: "Our Approach", // Small label above the heading
      heading: "Hormone health is about far more than hot flashes.",
      // Main paragraphs of the philosophy section
      body: [
        "Your hormones don't just affect how you feel day to day — they shape your bones, your weight, your heart health, your risk of insulin resistance and diabetes, your cholesterol, and even your memory and focus. When we treat them thoughtfully, we're protecting all of it.",
        "That's why CYRA is built around a proactive, preventative approach: longer appointments, careful follow-up, and a plan designed for your long-term health, not just the symptom in front of us. We're not just treating symptoms — we're taking control of your health.",
      ],
      // The pull-quote in larger text
      pullQuote:
        "We're not just treating symptoms — we're taking control of your health.",
      // The grid of what hormone health touches (short labels)
      affects: [
        { title: "Bone strength", body: "Protecting bone density as hormones shift." },
        { title: "Weight & metabolism", body: "Addressing the metabolic changes behind midlife weight gain." },
        { title: "Heart health", body: "Supporting cardiovascular health and healthy cholesterol." },
        { title: "Blood sugar", body: "Watching insulin resistance and diabetes risk early." },
        { title: "Mood & cognition", body: "Steadier mood, energy, and mental clarity." },
        { title: "Sexual health", body: "Comfort, libido, and intimacy addressed openly." },
      ],
    },

    // ---- WHAT WE TREAT: the simple grid of conditions ----
    whatWeTreat: {
      label: "What We Treat",
      heading: "Comprehensive care for women's hormonal and metabolic health.",
      // Each card: a title and a one-line description
      items: [
        {
          title: "Perimenopause",
          body: "The years of shifting hormones before your last period — caught early and managed with intention.",
        },
        {
          title: "Menopause",
          body: "Personalized hormone therapy and support for this next chapter of your health.",
        },
        {
          title: "PMDD & PMS",
          body: "Real relief for the mood, physical, and cyclical symptoms that disrupt your month.",
        },
        {
          title: "Postpartum Depression",
          body: "Thoughtful, hormone-informed care during one of the most demanding times in your life.",
        },
        {
          title: "Vaginal Pain & Dryness",
          body: "Effective treatment for discomfort that too often goes unaddressed.",
        },
        {
          title: "Women's Sexual Health",
          body: "Libido, energy, and intimacy — discussed openly and treated seriously.",
        },
        {
          title: "Weight Gain",
          body: "Root-cause care for hormonal and metabolic weight changes, not just calories.",
        },
        {
          title: "Metabolic Health",
          body: "Insulin resistance, cholesterol, and long-term prevention as part of your whole picture.",
        },
      ],
    },

    // ---- TESTOSTERONE: the often-overlooked section ----
    testosterone: {
      label: "Often Overlooked",
      heading: "Yes, women need testosterone too.",
      body: [
        "It's rarely discussed, but women have testosterone — and it matters. Levels decline steadily across a woman's lifetime, and that decline can quietly affect your mood, your energy, and your libido.",
        "When your symptoms and labs support it, Dr. Goodwin includes testosterone as a core part of your care, with careful dosing and monitoring. It's one of the most underused tools in women's hormone health.",
      ],
    },

    // ---- HOW TO JOIN: the 3 prominent steps ----
    howToJoin: {
      label: "Getting Started",
      heading: "How to join CYRA — in three steps.",
      intro:
        "Joining is simple and unhurried. Here's exactly what to expect from your first conversation to lasting change.",
      steps: [
        {
          title: "Start the conversation",
          // Optional short label shown next to the step title
          meta: "Free call or book directly",
          body: "Schedule a call with our patient coordinator to learn how the practice works — or, if you're ready, book your one-hour consult directly.",
        },
        {
          title: "Your one-hour consult",
          meta: "60 minutes",
          body: "A comprehensive review of your history, your symptoms, and your goals with Dr. Goodwin — resulting in a personalized treatment plan built for you.",
        },
        {
          title: "Begin your care plan",
          meta: "1 year",
          body: "Hormone changes are gradual — most take 8 to 12 weeks to take full effect — so your care plan runs a full year to create real, lasting change. Once enrolled, you'll have follow-up appointments every 4 to 6 weeks (sooner if needed) and direct communication with Dr. Goodwin between visits.",
        },
      ],
    },

    // ---- CARE PLAN: what's included + pricing ----
    carePlan: {
      label: "The Care Plan",
      heading: "Everything your year of care includes.",
      intro:
        "Your care plan is a full year of close, personalized support — not a subscription you have to think about. Here's what's included:",
      // The checklist of what's included
      includes: [
        "Follow-up visits — as many as you need",
        "Unlimited direct messaging with Dr. Goodwin",
        "35% off professional-grade supplements",
        "Personalized nutrition guidance",
        "Strength training guidance",
        "Lifestyle recommendations",
      ],
      // Pricing box heading
      pricingHeading: "Simple, transparent pricing",
      pricingSubhead:
        "Your one-year care plan, with two ways to pay. Financing is available through Cherry.",
      // The two payment options. The prices are calculated from the numbers
      // at the top of this file — you don't type them here.
      options: {
        financing: {
          label: "Monthly with Cherry",
          // e.g. "$175/mo"
          price: `${formatUsd(carePlanPricing.monthlyPayment)}/mo`,
          detail: `${carePlanPricing.paymentCount} monthly payments with approved credit, through Cherry`,
        },
        upfront: {
          label: "Pay in full",
          // e.g. "$2,161.25"
          price: formatUsd(carePlanUpfrontTotal),
          detail: `Save ${carePlanPricing.upfrontDiscountPercent}% off the ${formatUsd(
            carePlanTotal,
          )} total when you pay upfront`,
        },
      },
      // Small print under the pricing box
      note: "The one-hour consult is a separate, one-time fee and is required before enrolling in a care plan. Medication and lab costs are billed separately.",
    },

    // ---- TESTIMONIALS: short patient quotes ----
    testimonials: {
      label: "Patient Stories",
      heading: "Women who finally felt heard.",
      // Each quote: the words, the person's name, and their city.
      // (These are examples — replace with real, approved testimonials.)
      items: [
        {
          quote:
            "After years of being told my symptoms were just part of getting older, Dr. Goodwin actually listened — and built a plan around me. I finally feel like myself again.",
          name: "Sarah M.",
          location: "Thousand Oaks, CA",
        },
        {
          quote:
            "The longer appointments changed everything. It was a real conversation about my body and a plan we made together, not fifteen rushed minutes.",
          name: "Michelle R.",
          location: "Los Angeles, CA",
        },
        {
          quote:
            "Having Dr. Goodwin a message away between visits made me feel genuinely cared for. The Cherry financing made it completely doable, too.",
          name: "Jennifer K.",
          location: "San Diego, CA",
        },
      ],
    },

    // ---- FAQ: a short list of common questions ----
    faq: {
      label: "Questions & Answers",
      heading: "Frequently asked questions",
      // Each item: a question and its answer. Keep it to 6-8.
      items: [
        {
          question: "Where do you provide care?",
          answer:
            "CYRA is a telemedicine practice serving women located in California. Every visit happens over secure video — from home, work, or anywhere private in the state.",
        },
        {
          question: "How do I get started?",
          answer:
            "Two ways: schedule a call with our patient coordinator to learn how the practice works, or book your one-hour consult with Dr. Goodwin directly. From there, you'll receive a personalized treatment plan and can begin your care plan.",
        },
        {
          question: "What happens during the one-hour consult?",
          answer:
            "Dr. Goodwin does a comprehensive review of your health history, your symptoms, and your goals, then builds a personalized treatment plan. A full hour means nothing gets rushed.",
        },
        {
          question: "Why does the care plan run a full year?",
          answer:
            "Hormone changes are gradual — most treatments take 8 to 12 weeks to take full effect. A full year gives your body the time it needs to reach real, lasting change, with close follow-up along the way.",
        },
        {
          question: "How often will I see Dr. Goodwin?",
          answer:
            "Once you're enrolled, you'll have follow-up appointments every 4 to 6 weeks — sooner if you need them — plus direct messaging with Dr. Goodwin between visits.",
        },
        {
          question: "Do you prescribe testosterone for women?",
          answer:
            "Yes. Women have testosterone, and it affects mood, energy, and libido. When your labs and symptoms support it, Dr. Goodwin includes testosterone as a core part of your care, with careful dosing and monitoring.",
        },
        {
          question: "How does payment and financing work?",
          answer: `The one-year care plan is ${formatUsd(
            carePlanPricing.monthlyPayment,
          )} per month for ${carePlanPricing.paymentCount} payments through Cherry with approved credit, or ${formatUsd(
            carePlanUpfrontTotal,
          )} when you pay in full (a ${carePlanPricing.upfrontDiscountPercent}% savings). Cherry is our financing partner; checking your rate doesn't affect your credit score.`,
        },
        {
          question: "Do you take insurance?",
          answer:
            "No — CYRA is a cash-pay practice by design, which is what makes longer appointments and truly personalized care possible. Care plan services are often eligible for HSA and FSA funds; we can provide documentation on request.",
        },
      ],
    },

    // ---- FINAL CALL TO ACTION at the bottom of the home page ----
    finalCta: {
      heading: "Your best health starts with one conversation.",
      body: "Reach out to learn more about the practice, or book your consult with Dr. Goodwin.",
      cta: "Request More Information",
      // Small line beneath the button
      footnote: "California | Cash-Pay Telehealth | Board-Certified Physician",
    },
  },

  /* =======================================================================
     ABOUT PAGE
     ======================================================================= */
  about: {
    label: "About",
    heading: "Meet Dr. Goodwin",
    subheadline:
      "A physician who believes women's hormonal health deserves time, attention, and a plan built around the whole person.",
    // Name and credential badges next to the bio
    name: "Dr. Mondona Goodwin, DO",
    badges: [
      "Board-Certified Physician",
      "Doctor of Osteopathic Medicine",
      "Licensed in California",
    ],
    // The label under the photo placeholder (replace the image later)
    photoCaption: "Professional headshot placeholder — warm and approachable",
    // The bio paragraphs
    bio: [
      "Dr. Mondona Goodwin trained as a Doctor of Osteopathic Medicine — a path she chose because osteopathic medicine starts from the premise that the body is one interconnected system, not a collection of separate complaints. Through her board certification and years of practice, one pattern kept repeating: women arriving with real, life-altering symptoms and leaving with a shrug or the words 'that's just part of getting older.'",
      "Women's hormonal health became her focus because it sits exactly where that dismissal is most common — and where good medicine can change the most. Hormones touch sleep, mood, weight, bones, heart health, and identity all at once, yet the average visit gives them fifteen rushed minutes and a single lab value.",
      "Her approach is proactive and preventative. She doesn't treat a hot flash; she treats a woman — her metabolism and her mood alongside her hormones, her long-term risks alongside her symptoms, her goals alongside her labs. Longer appointments and close follow-up aren't a luxury in her practice; they're how good hormone care actually works.",
      "What she wants every patient to feel when a visit ends is simple: heard, taken seriously, and clear on the plan — with a physician who will still be there at the next visit, and the one after that.",
    ],
    // The pull-quote and signature
    quote:
      "I kept seeing women being told their symptoms were 'normal.' They weren't. And there was so much we could do about it.",
    signature: "Dr. Goodwin",
    // Credential chips shown in a row
    credentials: [
      "Doctor of Osteopathic Medicine (DO)",
      "Board-Certified Physician",
      "California Medical License",
    ],
    // The call-to-action band at the bottom of the About page
    cta: {
      heading: "Meet her yourself.",
      body: "The easiest way to know if CYRA is right for you is to start the conversation.",
      button: "Request More Information",
    },
  },

  /* =======================================================================
     BOOK / CONTACT PAGE
     ======================================================================= */
  book: {
    heading: "Request More Information",
    subheadline:
      "Tell us a little about you and what you're hoping to change. Our patient coordinator will reach out to help you schedule a call or book your one-hour consult with Dr. Goodwin.",
    // Short reassurance points
    reassurances: [
      "No commitment required",
      "Speak with our patient coordinator first, or book your consult directly",
      "Get your questions answered before enrolling",
    ],
    // The label inside the scheduling placeholder box
    schedulerLabel: "Scheduling embed — request info or book your consult",
    // The line under the scheduler
    emailPrompt: "Prefer to reach out directly? Email us at",
  },

  /* =======================================================================
     FOOTER
     ======================================================================= */
  footer: {
    quickLinksHeading: "Quick Links",
    contactHeading: "Contact",
    locationChip: "California Telehealth",
  },

  /* =======================================================================
     LEGAL LINKS (bottom of every page)
     ======================================================================= */
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ],
} as const;

export type SiteContent = typeof content;
