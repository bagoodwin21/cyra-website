/* =========================================================================
   CYRA WELLNESS SITE CONTENT (the one file you edit)
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
  monthlyPayment: 175, // Membership: dollars per monthly Cherry payment
  paymentCount: 13, // Number of monthly payments (Cherry splits 12 months into 13)
  upfrontTotal: 2160, // Flat price when the year is paid in full upfront
  consultFee: 399, // One-hour initial consult fee (charged once, before enrolling)
} as const;

// Derived totals. You do NOT need to edit these; they update on their own.
export const carePlanTotal =
  carePlanPricing.monthlyPayment * carePlanPricing.paymentCount; // 2275
export const carePlanUpfrontTotal = carePlanPricing.upfrontTotal; // 2160
// Percent saved by paying upfront, for display (rounds to a whole number)
export const upfrontSavingsPercent = Math.round(
  (1 - carePlanUpfrontTotal / carePlanTotal) * 100,
); // 5

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
     BRAND & GLOBAL (used in the browser tab, footer, and search results)
     ======================================================================= */
  brand: {
    name: "CYRA Wellness", // Practice name (appears in the header and footer)
    // Short phrase under the logo in the footer
    tagline: "Proactive, personalized care for women's hormonal health",
    // One-sentence description used by Google and social media previews
    description:
      "CYRA Wellness is a California membership-based telemedicine practice offering bioidentical hormone therapy for women's hormonal conditions throughout life: perimenopause, menopause, PMS/PMDD, postpartum depression, sexual health, and metabolic health. It is led by Dr. Mondona Goodwin, DO, a Menopause Society Certified Practitioner.",
    website: "https://drmondona.com", // Live website address (leave as-is unless the domain changes)
    physician: "Dr. Mondona Goodwin, DO", // Full name + credentials
    licensedStates: "Licensed in California", // Where care is offered (California only)
    // Contact email shown in the footer and on the booking page
    email: "hello@drmondona.com",
    // Practice texting number. smsNumber is the machine format (keep the +1
    // and no spaces); smsDisplay is how it reads on the site.
    smsNumber: "+18053879078",
    smsDisplay: "805-387-9078",
    // Instagram profile link shown in the footer
    instagramUrl: "https://www.instagram.com/drmondona/",
    // Fine-print line at the bottom of the site
    disclaimer:
      "CYRA Wellness is a membership-based, cash-pay practice serving patients located in California. Membership is not billed to insurance, though your insurance is used whenever possible for laboratory testing and prescriptions.",
    // Copyright line at the very bottom
    copyright: "© 2026 CYRA Wellness",
  },

  /* =======================================================================
     NAVIGATION (the links in the top menu and the main button)
     ======================================================================= */
  nav: {
    // Menu links. "href" is where each one goes; the "#" links jump to a
    // section on the home page. Keep the "/" and "#" symbols as they are.
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "How to Join", href: "/#how-to-join" },
      { label: "Membership", href: "/#membership" },
      { label: "Compare", href: "/compare" },
    ],
    // The words on the main action button (top-right and mobile bar)
    cta: "Get Started",
  },

  /* =======================================================================
     HOME PAGE
     ======================================================================= */
  home: {
    // ---- HERO: the very top of the home page ----
    hero: {
      // The big headline. The word(s) inside the *asterisks* are shown in
      // an italic accent color, so keep the asterisks around them.
      headline: "Personalized hormone care for women at *every stage*.",
      // Supporting paragraph under the headline
      subheadline:
        "A membership-based practice for women navigating hormonal conditions throughout life, not just menopause. Longer appointments, a plan built around you, and a physician who follows closely, by secure video across California.",
      primaryCta: "Get Started", // Main button text
      secondaryCta: "How to Join", // Second button text (jumps to the steps)
      // Short trust points shown as a row under the buttons
      trustPoints: [
        "Women's Hormonal Health",
        "Bioidentical Estrogen, Progesterone & Testosterone",
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
        "Your hormones don't just affect how you feel day to day. They shape your bones, your weight, your heart health, your risk of insulin resistance and diabetes, your cholesterol, and even your memory and focus. My goal isn't simply to prescribe hormones; it's to help you feel better today while protecting your long-term health.",
        "That's why I built CYRA around a proactive, evidence-based approach: longer appointments, careful follow-up, and a plan designed for your long-term cardiometabolic health, not just the symptom in front of us. I'm not just treating symptoms; together we take control of your whole health.",
        "This is care for every stage of your hormonal life: your 30s, 40s, 50s, and beyond. Whether it's PMDD in your cycling years, the hormonal shifts that can linger after having a baby, perimenopause, or menopause, these are chapters of one story. When it's the right fit, that means full bioidentical hormone therapy tailored to you, with estrogen, progesterone, and testosterone when appropriate.",
      ],
      // The pull-quote in larger text
      pullQuote:
        "I'm not just treating symptoms — together we take control of your whole health.",
      // The grid of what hormone health touches (short labels)
      affects: [
        { title: "Bone strength", body: "Protecting bone density as hormones shift." },
        { title: "Weight & metabolism", body: "Addressing the hormonal and metabolic changes behind stubborn weight gain at any age." },
        { title: "Heart health", body: "Supporting cardiovascular health and healthy cholesterol." },
        { title: "Blood sugar", body: "Watching insulin resistance and diabetes risk early." },
        { title: "Mood & cognition", body: "Lifting the brain fog: steadier mood, energy, and mental clarity." },
        { title: "Sexual health", body: "Comfort, libido, and intimacy addressed openly." },
      ],
    },

    // ---- COLLABORATIVE APPROACH: works alongside your PCP and OB/GYN ----
    collaborative: {
      label: "Working Together",
      heading: "A collaborative approach to your care.",
      // First-person paragraphs from Dr. Goodwin
      body: [
        "Think of me as your women's hormone specialist, someone who works alongside your primary care physician and OB/GYN rather than in place of them. Your PCP remains essential for routine and preventive care and other conditions, and your OB/GYN continues your gynecologic care and screenings.",
        "When it's helpful, I'm glad to communicate and coordinate directly with your physicians, so your care stays seamless, connected, and centered around you.",
      ],
    },

    // ---- WHAT WE TREAT: the simple grid of conditions ----
    whatWeTreat: {
      label: "What We Treat",
      heading: "Care for hormonal conditions throughout life, not just menopause.",
      // Each card: a title and a one-line description
      items: [
        {
          title: "Perimenopause",
          body: "Night sweats, disrupted sleep, and shifting cycles in the years before your last period, caught early and managed with intention.",
        },
        {
          title: "Menopause",
          body: "Personalized bioidentical hormone therapy for this next chapter of your health, with estrogen, progesterone, and testosterone when appropriate.",
        },
        {
          title: "PMS & PMDD",
          body: "PMDD is a real, treatable condition: severe mood symptoms like rage, despair, or anxiety in the week or two before your period that lift once it starts. I treat it seriously, alongside the physical and cyclical symptoms that disrupt your month.",
        },
        {
          title: "Postpartum & Beyond",
          body: "Postpartum depression and the hormonal changes that follow having a baby, shifts that can linger for months or even years. If you've never quite felt like yourself since the baby, you belong here.",
        },
        {
          title: "Vaginal Dryness & Pain",
          body: "Effective treatment for discomfort that too often goes unaddressed.",
        },
        {
          title: "Sexual Health & Libido",
          body: "Libido, energy, and intimacy: discussed openly and treated seriously.",
        },
        {
          title: "Weight Gain",
          body: "Root-cause care for hormonal and metabolic weight changes, including GLP-1 medications when appropriate, not just calories.",
        },
        {
          title: "Metabolic Health",
          body: "Insulin resistance, cholesterol, GLP-1 medication management, and long-term prevention as part of your whole picture.",
        },
        {
          title: "Fatigue",
          body: "Persistent low energy that hormones, sleep, and metabolism can all drive, evaluated as a whole and not dismissed.",
        },
        {
          title: "Sleep Issues",
          body: "Trouble falling or staying asleep, addressed as part of your hormonal and metabolic picture.",
        },
        {
          title: "Contraception",
          body: "Guidance on contraception that fits your health, your stage of life, and your goals.",
        },
      ],
    },

    // ---- TESTOSTERONE: the often-overlooked section ----
    testosterone: {
      label: "Often Overlooked",
      heading: "Yes, women need testosterone too.",
      body: [
        "Full bioidentical hormone therapy for women centers on estrogen and progesterone, and I use both as core parts of care when they're right for you. But there's a third hormone that's rarely discussed: women have testosterone too, and it matters. Levels decline steadily across a woman's lifetime, and that decline can quietly affect your mood, your energy, and your libido.",
        "When your symptoms and labs support it, I include testosterone as a core part of your care, with careful dosing and monitoring. It's one of the most underused tools in women's hormone health.",
      ],
    },

    // ---- IS CYRA RIGHT FOR YOU: the six differentiators ----
    rightForYou: {
      label: "Is CYRA Right for You?",
      heading: "Built for women who want more from their care.",
      intro: "You'll feel at home here if you're looking for:",
      items: [
        "Specialized expertise in women's hormone health",
        "Longer, thoughtful appointments",
        "Direct access to your physician",
        "Personalized care, not one-size-fits-all protocols",
        "Close follow-up throughout your treatment",
        "A focus on both symptom relief and long-term prevention",
      ],
    },

    // ---- HOW TO JOIN: the 3 prominent steps ----
    howToJoin: {
      label: "Getting Started",
      heading: "How to join CYRA in three steps.",
      intro:
        "Joining is simple and unhurried. Here's exactly what to expect from your first conversation to lasting change.",
      steps: [
        {
          title: "Book your consultation",
          // Optional short label shown next to the step title
          meta: "Most patients start here",
          body: "Book your 60-minute comprehensive consultation with me directly. Most patients are seen within the same week. Want to learn about the practice, membership, or pricing first? Schedule a free Discovery Call with our Patient Care Coordinator, or text us at 805-387-9078. The Discovery Call is about the practice. It isn't a medical appointment, and no medical advice is given.",
        },
        {
          title: "Your comprehensive consultation",
          // Shows the length and the one-time consult fee (from carePlanPricing.consultFee)
          meta: `60 minutes · ${formatUsd(carePlanPricing.consultFee)}`,
          body: "A completely nonbinding hour with me, with no obligation to join afterward. Together we'll review your medical history, current symptoms, previous treatments, lifestyle, goals, and lab history, answer your questions, and walk through evidence-based treatment options. You'll leave with a clear understanding of my recommendations, and the fee is credited toward your membership when you enroll within 14 days.",
        },
        {
          title: "Begin your membership",
          meta: "1-year model",
          body: "Hormone therapy is rarely fixed in one visit, and most adjustments take 8 to 12 weeks to show their full effect, so membership follows a one-year model built for real, lasting change. You'll have follow-up appointments every 4 to 6 weeks (sooner if needed) and direct messaging with me between visits.",
        },
      ],
    },

    // ---- MEMBERSHIP: what's included + pricing ----
    // (Section shows on the home page as "Membership" at the #membership anchor.
    //  The key is still named "carePlan" in code; leave it, only the words matter.)
    carePlan: {
      label: "Membership",
      heading: "Everything your membership includes.",
      intro:
        "Your membership is a full year of close, personalized support: direct access to me, not a subscription you have to think about. Here's what's included:",
      // The checklist of what's included
      includes: [
        "A personalized hormone treatment plan tailored to you",
        "Unlimited follow-up appointments, as many as you need",
        "Direct messaging with me, not intermediate staff (I usually reply within a few hours)",
        "Ongoing treatment adjustments as your body responds",
        "Support between visits",
        "Personalized nutrition counseling",
        "Strength training guidance",
        "Personalized exercise recommendations",
        "35% off professional-grade supplements",
      ],
      // Pricing box heading
      pricingHeading: "Simple, transparent pricing",
      pricingSubhead:
        "Your one-year membership after your initial consultation, with two ways to pay. Financing is available through Cherry.",
      // The two payment options. The prices are calculated from the numbers
      // at the top of this file, so you don't type them here.
      options: {
        financing: {
          label: "Monthly with Cherry",
          // e.g. "$175/mo"
          price: `${formatUsd(carePlanPricing.monthlyPayment)}/mo`,
          detail: `${carePlanPricing.paymentCount} monthly payments at 0% interest with approved credit, through Cherry`,
        },
        upfront: {
          label: "Pay in full",
          // e.g. "$2,160"
          price: formatUsd(carePlanUpfrontTotal),
          detail: `Save ${upfrontSavingsPercent}% off the ${formatUsd(
            carePlanTotal,
          )} total when you pay upfront`,
        },
      },
      // Small print under the pricing box. The consult price is pulled from
      // carePlanPricing.consultFee at the top of this file; change it there.
      note: `Your first step is the comprehensive consultation, a separate, one-time fee of ${formatUsd(
        carePlanPricing.consultFee,
      )}. The prices above are everything you pay after your consultation. Medications and labs aren't included in membership. Most are covered through your insurance, and I work to keep any out-of-pocket costs low. After your first year, most patients transition to a lower-cost maintenance membership to keep their results going.`,
      // ---- Cherry payment calculator (interactive box under the pricing cards) ----
      calculator: {
        heading: "Financing through Cherry", // Title above the Cherry box
        // Line under the title. The dollar amount and payment count come from
        // the pricing numbers at the top of this file.
        subhead: `Split your membership into ${carePlanPricing.paymentCount} interest-free monthly payments of ${formatUsd(
          carePlanPricing.monthlyPayment,
        )} with approved credit. Applying takes about a minute and won't affect your credit score.`,
        // The button that takes patients to Cherry's application page
        ctaLabel: "Apply with Cherry",
        applyUrl: "https://pay.withcherry.com/cyra-wellness-pc",
        // Your practice's Cherry account ID (from the Cherry dashboard).
        // Only change these if Cherry gives you new account details.
        slug: "cyra-wellness-pc",
        accountName: "CYRA Wellness PC",
      },
    },

    // ---- INSURANCE & COST SAVINGS: membership is cash-pay, but costs are kept down ----
    insurance: {
      label: "Insurance & Cost Savings",
      heading: "Membership is cash-pay — but I work to keep your other costs down.",
      intro:
        "Membership itself is a flat, cash-pay fee, with financing available through Cherry. But whenever possible, I use your insurance for laboratory testing and prescriptions. Most labs are covered just as they would be if your PCP ordered them, so they're not an extra expense to worry about, and most hormone medications are covered too. When something isn't, I look for every opportunity to lower the cost.",
      // The savings tools (these reduce medication and supplement costs, but they
      // are NOT financing; Cherry remains the only way to finance membership itself)
      items: [
        "Most labs covered by your insurance, at the same cost as if your PCP ordered them, not an extra expense",
        "Most hormone medications covered by insurance too",
        "About $20–30 per month per hormone through GoodRx if you're paying without insurance",
        "HRT Club, an affordable pharmacy option with cash pricing that doesn't use insurance",
        "Convenient blood draws at Quest locations near you",
        "Manufacturer savings programs and pharmacy coupons",
        "35% off professional-grade supplements",
        "HSA and FSA funds accepted for membership",
        "Superbills provided for possible out-of-network reimbursement",
      ],
      // Keeps the financing-vs-savings distinction clean
      note: "Cherry finances your membership. GoodRx, HRT Club, coupons, and savings programs are pharmacy and cost-saving options that simply reduce what you pay for medications and supplements. They aren't financing.",
    },

    // ---- COMPARE TEASER: small link on the home page to the /compare page ----
    compareTeaser: {
      // The sentence shown above the link
      text: "Weighing CYRA against online HRT platforms and conventional care?",
      // The link words (the link always points to the Compare page)
      cta: "See how CYRA compares to other options",
    },

    // ---- TESTIMONIALS: short patient quotes ----
    testimonials: {
      label: "Patient Reviews",
      heading: "Hear it from our patients.",
      /* ONLY REAL, AUTHORIZED QUOTES GO HERE. Each patient must sign a
         HIPAA marketing authorization before her words appear on the site
         (keep the signed form on file). To add one, copy this pattern
         inside items: [ ] below:

          {
            quote: "Her exact words.",
            name: "First L.",
            location: "City, CA",
          },
      */
      items: [] as { quote: string; name: string; location: string }[],
      // The "read our reviews" button under the quotes. It sends visitors to
      // Google, where reviews carry third-party credibility.
      googleCtaLabel: "Read our reviews on Google",
      googleUrl: "https://maps.app.goo.gl/BbqpKybfbemLE6p97",
    },

    // ---- FAQ: a short list of common questions ----
    faq: {
      label: "Questions & Answers",
      heading: "Frequently asked questions",
      // Each item: a question and its answer. Keep it to a maximum of 10.
      items: [
        {
          question: "Where do you provide care?",
          answer:
            "CYRA is a telemedicine practice serving women located in California. Every visit happens over secure video, from home, work, or anywhere private in the state.",
        },
        {
          question: "How do I get started?",
          answer:
            "Two ways: book a free Discovery Call with our Patient Care Coordinator to learn how the practice, membership, and pricing work, or book your comprehensive consultation with me directly. The Discovery Call is about the practice; it isn't a medical appointment and no medical advice is given, but the coordinator can arrange for practice-related questions to reach me.",
        },
        {
          question: "Is the consultation binding?",
          answer:
            "No. The 60-minute comprehensive consultation is completely nonbinding, with no obligation to join afterward. I review your history, symptoms, and goals and walk through your options, and you'll leave with a clear understanding of my recommendations. Then you decide whether membership is right for you.",
        },
        {
          question: "Why does membership run a full year?",
          answer:
            "Hormone therapy is rarely fixed in one visit, and most adjustments take 8 to 12 weeks to show their full effect. A one-year membership gives your body the time it needs for real, lasting change, with close follow-up along the way: appointments every 4 to 6 weeks (sooner if needed) and direct messaging with me between visits.",
        },
        {
          question: "What happens after my first year?",
          answer:
            "Most patients don't need that same intensity of visits forever. After your first year of close follow-up and fine-tuning, most transition to a lower-cost maintenance membership that keeps your results going with continued access and monitoring. We'll talk through the details as your first year wraps up, once we know what your ongoing care looks like.",
        },
        {
          question: "Do I keep my primary care doctor and OB/GYN?",
          answer:
            "Yes, please do. Think of me as your women's hormone specialist, working alongside your PCP and OB/GYN, not replacing them. Your PCP continues your routine and preventive care, your OB/GYN continues your gynecologic care and screenings, and I'm glad to coordinate with them when it's helpful.",
        },
        {
          question: "Do you prescribe testosterone for women?",
          answer:
            "Yes. Full bioidentical hormone therapy centers on estrogen and progesterone when they're right for you, and women have testosterone too. It affects mood, energy, and libido. When your labs and symptoms support it, I include testosterone as a core part of your care, with careful dosing and monitoring.",
        },
        {
          question: "Do you prescribe GLP-1 medications for weight loss?",
          answer:
            "Yes, when it's clinically appropriate. GLP-1 medications (like semaglutide and tirzepatide) can be a helpful tool for hormonal and metabolic weight changes, and I prescribe them as part of a personalized plan, alongside your hormone therapy, labs, and long-term metabolic health, not as a standalone quick fix.",
        },
        {
          question: "Do you treat PMDD?",
          answer:
            "Yes. PMDD (premenstrual dysphoric disorder) is a real, treatable condition, not “just PMS.” If severe mood symptoms like rage, despair, or anxiety show up in the week or two before your period and lift once it starts, that cyclical pattern is exactly what I evaluate and treat with a hormone-informed approach, rather than dismissing it.",
        },
        {
          question: "What does it cost, and do you take insurance?",
          answer: `Membership itself is cash-pay by design, and that's what makes longer appointments and truly personalized care possible. It's ${formatUsd(
            carePlanPricing.monthlyPayment,
          )} per month for ${carePlanPricing.paymentCount} payments through Cherry with approved credit, or ${formatUsd(
            carePlanUpfrontTotal,
          )} paid in full (a ${upfrontSavingsPercent}% savings). Cherry is our financing partner, and checking your rate doesn't affect your credit score. The comprehensive consultation is a separate, one-time ${formatUsd(
            carePlanPricing.consultFee,
          )} fee, and the membership prices are everything you pay after the consultation. Beyond membership, I work to keep your other costs low: I use your insurance whenever possible for labs and prescriptions. Most labs are covered just as if your PCP ordered them, so they aren't an extra expense, and most hormone medications are covered too. Without insurance, hormones typically run about $20–30 per month each through GoodRx, and I can also send prescriptions through HRT Club, a pharmacy with affordable cash pricing. Blood draws happen at a Quest location near you, we accept HSA and FSA funds for membership, and we provide superbills for possible out-of-network reimbursement. One important note: we are unable to accept patients who are eligible for Medicare.`,
        },
      ],
    },

    // ---- FINAL CALL TO ACTION at the bottom of the home page ----
    finalCta: {
      heading: "Your best health starts with one conversation.",
      body: "Reach out to learn more about the practice, or book your consultation with me.",
      cta: "Get Started",
      // Small line beneath the button
      footnote:
        "California | Membership-Based Telehealth | Menopause Society Certified Practitioner (MSCP)",
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
      "Board-Certified in Internal Medicine",
      "Menopause Society Certified Practitioner (MSCP)",
      "Doctor of Osteopathic Medicine",
      "Licensed in California",
    ],
    // Alt text for the certification badge images shown near the bio
    badgeArt: {
      abimAlt: "American Board of Internal Medicine, Board Certified",
      mscpAlt: "Menopause Society Certified Practitioner",
    },
    // The label under the photo placeholder (replace the image later)
    // Describes the photo for screen readers and search engines
    photoCaption: "Dr. Mondona Goodwin, DO, founder of CYRA Wellness",
    // The bio paragraphs (Dr. Goodwin's own first-person voice)
    bio: [
      "I'm Dr. Mondona Goodwin, a board-certified Internal Medicine physician with more than ten years of clinical experience. I trained as a Doctor of Osteopathic Medicine at LECOM (Lake Erie College of Osteopathic Medicine), a path I chose because osteopathic medicine starts from the premise that the body is one interconnected system, not a collection of separate complaints.",
      "Over the years I've pursued extensive additional training in perimenopause, menopause, hormone therapy, metabolic health, and women's midlife health, and I'm a Menopause Society Certified Practitioner (MSCP). And while menopause is in my certification's name, my patients span every stage: PMDD in your cycling years, the hormonal shifts that linger after a baby, perimenopause, and beyond. One pattern kept repeating in my practice: women arriving with real, life-altering symptoms and leaving with a shrug, or the words 'that's just part of getting older.'",
      "My approach is proactive and evidence-based. I don't treat a hot flash; I treat a woman — her metabolism and her mood alongside her hormones, her long-term risks alongside her symptoms, her goals alongside her labs. When it fits your health, that includes full bioidentical hormone therapy, with estrogen, progesterone, and testosterone when appropriate. And I work as your women's hormone specialist alongside your primary care physician and OB/GYN, coordinating with them so your care stays seamless.",
      "What I want every patient to feel when a visit ends is simple: heard, taken seriously, and clear on the plan, with a physician who will still be there at the next visit, and the one after that.",
    ],
    // The pull-quote and signature (Dr. Goodwin's personal story)
    quote:
      "Creating CYRA Wellness was deeply personal. My own hormonal and weight journey inspired me to build the practice I always wished existed, one centered on personalized, evidence-based care and long-term partnerships with patients. The name is a dedication to my two children, Cyrus and Lily Cyra, and to every woman I care for since.",
    signature: "Dr. Goodwin",
    // Credential chips shown in a row
    credentials: [
      "Doctor of Osteopathic Medicine (DO)",
      "Board-Certified in Internal Medicine",
      "Menopause Society Certified Practitioner (MSCP)",
      "10+ Years of Clinical Experience",
      "California Medical License",
    ],
    // The call-to-action band at the bottom of the About page
    cta: {
      heading: "Meet me yourself.",
      body: "The easiest way to know if CYRA is right for you is to start the conversation.",
      button: "Get Started",
    },
  },

  /* =======================================================================
     COMPARE PAGE  (/compare)
     The page that shows how CYRA differs from other providers: online HRT
     platforms, conventional OB/GYN, and the big menopause telehealth brands.
     Every word on that page is below. The little check / X / dash marks in the
     table come from the "verdict" values (see the note above the table data).
     ======================================================================= */
  compare: {
    // ---- HERO: top of the Compare page ----
    hero: {
      label: "Compare", // Small label above the headline
      heading:
        "Not all hormone telehealth is the same. Here's what to look for.",
      subheadline:
        "The growth of online hormone care has been great for women. But there are meaningful differences in who delivers your care, what's included in your fees, and how your treatment is structured. Here's an honest look.",
      jumpCta: "Jump to comparison", // The button that scrolls down to the table
    },

    // ---- WHAT DIFFERS: the six cards explaining what to compare on ----
    dimensions: {
      label: "Choosing a Platform",
      heading: "What actually differs between platforms",
      intro:
        "Before you compare names, compare on the dimensions that shape your care. These six matter most.",
      // Each card: a short title and a description.
      items: [
        {
          title: "Who delivers your care",
          body: "At CYRA Wellness, it's always the same Board-Certified physician and Menopause Society Certified Practitioner (MSCP), one who gets to know your history rather than a rotating cast of providers.",
        },
        {
          title: "Testosterone access",
          body: "Many platforms either don't offer testosterone for women, require a separate add-on fee, or treat it as secondary. For many women, it's the missing piece.",
        },
        {
          title: "How treatment is structured",
          body: "Month-to-month subscriptions create financial flexibility but also incentivize platforms to retain subscribers rather than graduate them. A one-year membership creates a different dynamic.",
        },
        {
          title: "What's included vs. billed separately",
          body: "Some platforms advertise low monthly costs but charge separately for labs, medications, and follow-ups. Understand total cost of care, not just the subscription fee.",
        },
        {
          title: "Financing options",
          body: "If a membership or subscription is a financial stretch, does the platform offer financing? A Cherry integration matters for accessibility.",
        },
        {
          title: "Continuity of care",
          body: "Do you see the same provider each time, or rotate through whoever is available? Continuity matters in hormone care where your provider needs to know your history and trajectory.",
        },
      ],
    },

    // ---- THE TABLE: heading, intro, and the fine print under the table ----
    comparison: {
      label: "Side by Side",
      heading: "The comparison",
      intro:
        "How CYRA Wellness compares with the major hormone telehealth platforms, criterion by criterion.",
      // The small print shown directly beneath the table
      footnote:
        "Table reflects publicly available information as of July 2026. Platform offerings change. We encourage you to verify directly with any provider before making your decision.",
    },

    // ---- TABLE DATA ----
    // This is the grid itself. "platforms" is the row of column headings
    // (CYRA must stay first because it's the highlighted column). "rows" is one
    // per criterion; each has a "criterion" label and a "cells" list with one
    // cell PER PLATFORM, in the same left-to-right order as "platforms".
    //
    // In each cell you can set:
    //   "verdict": "yes"      → green check
    //             "no"        → red X
    //             "partial"   → amber dash
    //   "note":   optional short text shown under the mark
    // A cell may have a verdict, a note, or both. Keep the number of cells in
    // every row equal to the number of platforms.
    table: {
      platforms: [
        "CYRA Wellness",
        "Midi Health",
        "Alloy",
        "Evernow",
        "Winona",
      ],
      rows: [
        {
          criterion: "Testosterone for Women Included",
          cells: [
            { verdict: "yes", note: "Standard part of care" },
            { verdict: "partial", note: "Available, not emphasized" },
            { verdict: "no", note: "Not standard" },
            { verdict: "partial", note: "Limited" },
            { verdict: "partial", note: "Add-on" },
          ],
        },
        {
          criterion: "Personalized Protocol vs. Standardized",
          cells: [
            { verdict: "yes", note: "Fully personalized" },
            { verdict: "partial", note: "Protocol-based" },
            { verdict: "partial", note: "Algorithm-assisted" },
            { verdict: "partial", note: "App-driven" },
            { verdict: "partial", note: "Standardized tiers" },
          ],
        },
        {
          criterion: "Continuity (Same Provider Every Visit)",
          cells: [
            { verdict: "yes", note: "Always the same Board-Certified MSCP Physician" },
            { verdict: "no", note: "Rotating providers" },
            { verdict: "partial", note: "Not guaranteed" },
            { verdict: "no", note: "Rotating" },
            { verdict: "partial", note: "Not guaranteed" },
          ],
        },
        {
          criterion: "Financing Available (Cherry)",
          cells: [
            { verdict: "yes", note: "Cherry financing" },
            { verdict: "no" },
            { verdict: "no" },
            { verdict: "no" },
            { verdict: "no" },
          ],
        },
        {
          criterion: "Labs Ordered & Reviewed by Same Provider",
          cells: [
            { verdict: "yes" },
            { verdict: "partial" },
            { verdict: "partial" },
            { verdict: "partial" },
            { verdict: "partial" },
          ],
        },
        {
          criterion: "Thyroid in Scope",
          cells: [
            { verdict: "yes" },
            { verdict: "partial" },
            { verdict: "no" },
            { verdict: "no" },
            { verdict: "no" },
          ],
        },
        {
          criterion: "Superbill for OON Reimbursement",
          cells: [
            { verdict: "yes" },
            { verdict: "partial" },
            { verdict: "no" },
            { verdict: "no" },
            { verdict: "no" },
          ],
        },
        {
          criterion: "Where Care Is Available",
          cells: [
            { note: "California only" },
            { note: "All 50 states" },
            { note: "All 50 states" },
            { note: "Most states" },
            { note: "Most states" },
          ],
        },
      ],
    },

    // ---- DEEPER DIVES: the expandable notes on each platform ----
    deeperDives: {
      label: "Deeper Dives",
      heading: "A closer, honest look at each platform",
      intro:
        "These platforms have helped many women access care. Here's what each does well, who it fits, and where CYRA differs.",
      // Each item: the platform "name" (the question you click to open) and its
      // "paragraphs" (one or more paragraphs of text).
      items: [
        {
          name: "Midi Health",
          paragraphs: [
            "Midi has built one of the largest menopause telehealth networks in the country, and their providers are focused specifically on this phase of life. That focus matters.",
            "Where CYRA differs: your care at Midi may not be delivered by the same physician each visit, and you may see different providers across visits. For women who want a specific physician who knows their history and can draw on the full scope of a DO's training, that difference is worth considering.",
          ],
        },
        {
          name: "Alloy Women's Health",
          paragraphs: [
            "Alloy offers physician-designed protocols at an accessible price point, making them a good entry point for women exploring HRT for the first time. Their approach is protocol-driven rather than fully individualized, which works well for straightforward presentations.",
            "Where CYRA differs: if your situation is more complex (multiple symptoms, thyroid involvement, weight management alongside hormone care), CYRA's fully personalized approach and physician continuity offer more flexibility.",
          ],
        },
        {
          name: "Evernow",
          paragraphs: [
            "Evernow has invested heavily in their app experience and data-driven approach. For women who prefer a tech-forward, app-centric workflow, it's a solid option.",
            "Where CYRA differs: Evernow's care is primarily delivered through providers rather than a physician, and is more algorithmically structured, which trades some personalization for scale and consistency.",
          ],
        },
        {
          name: "Winona",
          paragraphs: [
            "Winona focuses specifically on compounded bioidentical hormone therapy and has developed a clear, streamlined process for women who already know they want BHRT.",
            "Where CYRA differs: CYRA isn't compounded-only. Dr. Goodwin works with both FDA-approved and compounded options based on what's clinically appropriate for you, rather than defaulting to one category.",
          ],
        },
      ],
    },

    // ---- CHECKLIST: questions to ask any provider ----
    questions: {
      label: "Your Checklist",
      heading: "Before you choose any platform, ask these questions.",
      intro:
        "Take this list to every consult, including ours. A platform that's confident in its care will welcome all of them.",
      items: [
        "Who will actually be delivering my care?",
        "Will I see the same provider at every visit?",
        "Is testosterone included or is it an add-on?",
        "What's the total monthly cost including labs and medications?",
        "Can I get a superbill for potential insurance reimbursement?",
        "Who do I contact between visits if I have a question?",
        "Are my labs reviewed by my prescribing provider or by a separate reviewer?",
      ],
    },

    // ---- FINAL CALL TO ACTION at the bottom of the Compare page ----
    finalCta: {
      heading: "Want to see if CYRA is the right fit?",
      body: "Reach out to learn more about the practice, including how CYRA works alongside your existing PCP and OB/GYN, or book your consultation with Dr. Goodwin. No pressure to enroll.",
      cta: "Get Started", // Main button
      // The quieter link under the button (always points to the Membership section)
      secondaryLink: "Or read more about how membership works",
    },
  },

  /* =======================================================================
     BOOK / CONTACT PAGE
     ======================================================================= */
  book: {
    heading: "Book Your Visit",
    subheadline:
      "Book your comprehensive consultation with Dr. Goodwin. Or, if you'd like to learn about the practice first, start with a free Discovery Call or a text.",
    // Short reassurance points
    reassurances: [
      "No commitment required: the consultation is completely nonbinding",
      "Start with a free Discovery Call, or book your consultation directly",
      "Get your questions answered before enrolling",
    ],
    // ---- The two booking options shown side by side ----
    discovery: {
      title: "Not ready to book? Start with a free Discovery Call",
      meta: "15 minutes · Free",
      body: "A short call with our Patient Care Coordinator about how the practice, membership, and pricing work. It's about the practice, not a medical appointment, and no medical advice is given.",
      ctaLabel: "Schedule Your Call", // Jumps to the scheduler below
      // Heading shown above the embedded Discovery Call scheduler
      schedulerHeading: "Schedule your free Discovery Call",
    },
    consult: {
      title: "Comprehensive Consultation",
      meta: "60 minutes · $399",
      body: "Your full one-hour visit with Dr. Goodwin: history, symptoms, goals, and an evidence-based plan. Completely nonbinding, and credited toward membership when you enroll within 14 days.",
      ctaLabel: "Book the Consultation", // Jumps to the booking widget below
      // Heading shown above the embedded consultation booking widget
      schedulerHeading: "Book your comprehensive consultation",
      // The OptiMantra patient-access booking link, embedded on the page.
      // Only change this if OptiMantra gives you a new link.
      bookingUrl:
        "https://www.optimantra.com/optimus/om/patientaccess/servicesallV2?pid=OXlDYzY1TWMxTjd1RVJva0JjeUkrZz09&lid=VWtUQmM4YTlJQjR0dFk5YzFQQTdoUT09",
    },
    // The live Calendly scheduling link embedded on this page (Discovery Call).
    calendlyUrl: "https://calendly.com/hello-drmondona/15min",
    // The label inside the scheduling placeholder box (shown only if
    // calendlyUrl above is ever emptied out)
    schedulerLabel: "Scheduling embed: request info or book your consultation",
    // The line under the scheduler
    emailPrompt: "Prefer to reach out directly? Email us at",
    // The texting line under the scheduler (uses the number from brand above)
    textPrompt: "Questions? Text us at",
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
     LEGAL PAGES (the Privacy Policy and Terms of Service pages themselves)

     The full text of both documents lives here. Each page has:
       label         - the small line above the page heading
       title         - the page heading
       effectiveDate - the "Effective ..." line under the heading. Update this
                       whenever you change any wording below.
       intro         - the short paragraph right under the effective date
       sections      - the numbered body. Each one is a "heading" plus a
                       "body" list, where every item in the list becomes its
                       own paragraph on the page.

     To edit: change the words inside the quotes. To add a paragraph, add a
     new "sentence in quotes," to that section's body list. To add a whole
     section, copy an existing { heading: ..., body: [...] } block, commas
     and braces included.

     Please keep these facts straight when editing: the website is marketing
     only, patient health information is covered by the practice's Notice of
     Privacy Practices (a separate document given at intake), and care is
     offered to California residents only.
     ======================================================================= */
  legalPages: {
    // The line at the bottom of both legal pages, before the email address
    questionsPrompt: "Questions about this policy? Email",

    privacy: {
      label: "Legal", // Small label above the page heading
      title: "Privacy Policy", // The page heading
      effectiveDate: "July 25, 2026", // Shown as "Effective July 25, 2026"
      intro:
        "This policy explains how CYRA Wellness handles information in connection with this website.",
      // Prominent link to the HIPAA Notice of Privacy Practices PDF
      documentLink: {
        label: "Read our Notice of Privacy Practices (PDF)",
        href: "/notice-of-privacy-practices.pdf",
      },
      sections: [
        {
          heading: "Who we are",
          body: [
            "CYRA Wellness is the telemedicine practice of Dr. Mondona Goodwin, DO, serving patients located in California. You can reach us by email at hello@drmondona.com or by text at 805-387-9078.",
          ],
        },
        {
          heading: "What this policy covers",
          body: [
            "This policy covers this website, drmondona.com. The website is a marketing site: it describes the practice, publishes our pricing, and points you to ways to get in touch.",
            "It does not cover your medical care. Once you become a patient, the health information created in the course of your care is held in the practice's clinical systems and is governed by HIPAA and by our Notice of Privacy Practices, which you receive during intake. That notice, not this page, governs your medical record.",
          ],
        },
        {
          heading: "Information collected automatically",
          body: [
            "Our site is hosted by Vercel. Like nearly every web host, Vercel keeps standard server logs: IP address, browser and device type, the pages requested, the referring page, and the date and time. These logs help keep the site running, secure, and reasonably fast.",
            "We may also use Google Analytics through Google Tag Manager to see which pages people find useful. Analytics is switched off unless and until a measurement ID is configured for the site. If and when we turn it on, Google receives that usage information under its own privacy policy.",
            "The website does not set any cookies of its own.",
          ],
        },
        {
          heading: "Information you choose to provide",
          body: [
            "The website itself has no forms and no accounts. What it offers are ways to reach the practice, and anything you enter goes to the service provider named below.",
            "Appointment booking: our booking page embeds OptiMantra, the practice's electronic health record and patient portal. Whatever you enter there, including your name, contact details, appointment selection, and payment information, goes to OptiMantra as part of the practice's clinical systems.",
            "Discovery Call scheduling: the free Discovery Call is scheduled through Calendly, which collects the name, email address, and phone number you type into it.",
            "Financing: if you apply for financing, the application happens on Cherry's own systems at withcherry.com, under Cherry's terms and privacy policy. We do not receive or store your application details. The Cherry widget on our site also loads fonts from Google Fonts.",
            "Texting and email: our text links open your own messaging app to write to the practice at 805-387-9078, and our email links open your mail app addressed to hello@drmondona.com.",
          ],
        },
        {
          heading: "How we use information",
          body: [
            "We use it to answer your questions, schedule and confirm appointments, operate and improve the website, and meet our legal and professional obligations. That is the entire list.",
          ],
        },
        {
          heading: "Who we share it with",
          body: [
            "We share information with the service providers named above (Vercel, OptiMantra, Calendly, Cherry, and Google), each only for the job it performs and each under its own privacy terms.",
            "We do not sell or rent personal information, and we do not run third-party advertising on this site. We may disclose information when the law requires it, or when we need to protect the rights and safety of our patients, our staff, or the public.",
          ],
        },
        {
          heading: "A note about texting",
          body: [
            "Standard text messaging is not an encrypted or secure channel. Text us with scheduling and practice questions, and we will move any clinical conversation into the patient portal.",
            "If you text us, you may receive replies from the practice at that number. Message and data rates may apply, and message frequency varies. Reply STOP at any time to opt out, or HELP for help.",
          ],
        },
        {
          heading: "Your health information",
          body: [
            "Please do not send detailed medical information, test results, or images through this website, by text, or by email. Those channels are not built to protect that kind of information.",
            "Health information you share once you are a patient is handled in the practice's clinical systems and is protected under HIPAA and our Notice of Privacy Practices.",
          ],
        },
        {
          heading: "How long we keep information",
          body: [
            "We keep website and contact information only as long as we need it for the purposes described above, or as long as our records and legal obligations require. Hosting logs and any analytics records follow those providers' standard retention periods. Medical records are kept under the separate rules that apply to them.",
          ],
        },
        {
          heading: "Security",
          body: [
            "We use reasonable administrative and technical safeguards, and we choose service providers who do the same. No website or method of transmitting information over the internet is 100% secure, so we cannot guarantee absolute security.",
          ],
        },
        {
          heading: "Children",
          body: [
            "This site is meant for adults. It is not directed to anyone under 18, and we do not knowingly collect information from children.",
          ],
        },
        {
          heading: "Do Not Track",
          body: [
            "Some browsers can send a \"Do Not Track\" signal. There is no common industry standard for interpreting those signals, and this site does not respond to them.",
          ],
        },
        {
          heading: "California residents",
          body: [
            "Our services are offered only to people located in California. Whether or not we are legally required to, we will honor reasonable requests to access, correct, or delete the personal information we hold about you from the website. Email hello@drmondona.com and we will respond within a reasonable time.",
            "If you are a patient, requests about your medical record follow the process described in our Notice of Privacy Practices.",
          ],
        },
        {
          heading: "Changes to this policy",
          body: [
            "If we change this policy, we will post the updated version on this page and revise the effective date shown above. Please check back from time to time.",
          ],
        },
        {
          heading: "Contact us",
          body: [
            "CYRA Wellness, California telehealth. Email hello@drmondona.com or text 805-387-9078.",
          ],
        },
      ],
    },

    terms: {
      label: "Legal", // Small label above the page heading
      title: "Terms of Service", // The page heading
      effectiveDate: "July 25, 2026", // Shown as "Effective July 25, 2026"
      intro:
        "These terms apply to your use of the CYRA Wellness website at drmondona.com.",
      sections: [
        {
          heading: "Acceptance",
          body: [
            "By using this website you agree to these terms. If you do not agree with them, please do not use the site. These terms cover the website. If you become a patient, your care is governed by the agreements you sign with the practice.",
          ],
        },
        {
          heading: "This website is information, not medical advice",
          body: [
            "Everything published here is general educational and marketing information about CYRA Wellness and women's hormonal health. It is not medical advice, a diagnosis, or a treatment recommendation, and it is no substitute for a consultation with a qualified clinician.",
            "Reading this site, texting us, or emailing us does not create a physician-patient relationship. That relationship begins only after you schedule a visit, complete intake, and are seen by Dr. Goodwin through the practice's clinical systems.",
          ],
        },
        {
          heading: "Emergencies",
          body: [
            "Do not use this website, text, or email for urgent or emergency medical needs. If you are having a medical emergency, call 911 or go to the nearest emergency room.",
          ],
        },
        {
          heading: "Who we can serve",
          body: [
            "Dr. Goodwin is licensed in California, and care through CYRA Wellness is available only to adults 18 and older who are located in California at the time of their visit. We cannot provide care to patients in other states.",
            "We are unable to accept patients who are eligible for Medicare. If you become Medicare-eligible before a scheduled visit, please let us know.",
          ],
        },
        {
          heading: "Appointments and payment",
          body: [
            `The comprehensive consultation is ${formatUsd(
              carePlanPricing.consultFee,
            )} for a one-hour visit. A card is required to hold the appointment. Cancellations made less than 24 hours before the visit, and missed appointments, forfeit that payment. This policy is presented to you at the time you book.`,
            `Membership is a one-year commitment, paid either as ${carePlanPricing.paymentCount} monthly payments of ${formatUsd(
              carePlanPricing.monthlyPayment,
            )} through Cherry at 0% interest to you, or ${formatUsd(
              carePlanUpfrontTotal,
            )} paid in full. Membership is cash-pay and is not billed to insurance.`,
            "What membership includes, any credit of the consultation fee toward it, and every other membership term are set out in the care-plan agreement you sign. Where this website and that signed agreement differ, the agreement controls.",
          ],
        },
        {
          heading: "Financing through Cherry",
          body: [
            "Cherry is our financing partner. Applications are submitted and decided on Cherry's own systems, subject to Cherry's terms and to credit approval. We are not the lender and we do not make approval decisions.",
          ],
        },
        {
          heading: "Third-party services",
          body: [
            "This site embeds and links to services we do not control: OptiMantra for booking and the patient portal, Calendly for Discovery Call scheduling, Cherry for financing, and links to Google and Instagram. Your use of those services is governed by their own terms and privacy policies, and we are not responsible for their content or availability.",
          ],
        },
        {
          heading: "Texting",
          body: [
            "If you text the practice at 805-387-9078, you agree to receive replies from us at that number. Message and data rates may apply and message frequency varies. Reply STOP to stop messages or HELP for help. Standard text messaging is not encrypted, so please keep detailed health information out of it.",
          ],
        },
        {
          heading: "Intellectual property",
          body: [
            "The text, images, and design on this site belong to CYRA Wellness or are used with permission. You are welcome to read the site and share links to it. Please do not republish, sell, or reuse our medical and educational content without written permission.",
          ],
        },
        {
          heading: "No warranties",
          body: [
            "This site is provided as is. We work to keep it accurate and current, but we make no warranties, express or implied, that it will be error-free, uninterrupted, or suited to any particular purpose. Medical knowledge changes, and content here may not reflect the most recent developments.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "To the fullest extent permitted by law, CYRA Wellness and Dr. Goodwin are not liable for indirect, incidental, or consequential damages arising out of your use of this website. Nothing in these terms limits any liability that cannot be limited by law, including liability connected to professional medical care.",
          ],
        },
        {
          heading: "Governing law",
          body: [
            "These terms are governed by the laws of the State of California, without regard to its conflict of laws rules. Any dispute about this website will be brought in the state or federal courts located in California.",
          ],
        },
        {
          heading: "Changes to these terms",
          body: [
            "We may update these terms. The current version is always posted on this page with its effective date. If you keep using the site after a change, you accept the updated terms.",
          ],
        },
        {
          heading: "Contact us",
          body: [
            "CYRA Wellness, California telehealth. Email hello@drmondona.com or text 805-387-9078.",
          ],
        },
      ],
    },
  },

  /* =======================================================================
     FOR PHYSICIANS PAGE (/for-physicians), written doctor-to-doctor and
     linked from the footer. For PCPs and OB/GYNs considering a referral.
     ======================================================================= */
  forPhysicians: {
    label: "For Physicians & Referring Providers",
    heading: "A hormone specialist for the women in your panel.",
    // Opening, in Dr. Goodwin's first person (matches the referral letter)
    intro: [
      "I'm Dr. Mondona Goodwin, a board-certified Internal Medicine physician and Menopause Society Certified Practitioner (MSCP) practicing telemedicine across California. I founded CYRA Wellness to give women's hormonal health the time and depth it deserves: the disrupted sleep, the mood shifts, the weight that won't budge, the brain fog affecting her work and relationships.",
      "In primary care and gynecology, you're often the first person a patient turns to when something feels \"off.\" These conversations deserve time that a busy schedule rarely allows. That's exactly the gap CYRA Wellness fills, and I'd welcome the chance to help.",
    ],
    // Who to refer: the conditions list, phrased clinically
    referHeading: "Patients who are a good fit",
    referrals: [
      "Perimenopause and menopause evaluation and management",
      "Hormone therapy: estrogen, progesterone, and testosterone, individually tailored",
      "PMDD and severe PMS",
      "Postpartum hormonal concerns, including postpartum depression",
      "Vaginal dryness or pain, low libido, and sexual health",
      "Midlife weight management, including GLP-1 support where clinically appropriate",
      "Fatigue, sleep disturbance, and metabolic concerns with a suspected hormonal component",
    ],
    // The collaboration promise: the referring doctor keeps the patient
    collaborationHeading: "We extend your care, we don't replace it",
    collaboration: [
      "Your patient stays yours. She continues seeing you for primary care or gynecologic care; CYRA adds focused hormone and midlife-health support alongside it.",
      "With her consent, we send you a consultation summary and keep your office in the loop on her hormone care: medications, dosing, and monitoring.",
      "We don't duplicate services: no routine primary care, no gynecologic procedures or screenings.",
    ],
    // Practical details referring offices need up front
    logisticsHeading: "Practical details",
    logistics: [
      "100% telehealth, licensed in California, with no travel for your patient",
      "New patients are typically seen within days, not weeks",
      "60-minute comprehensive initial consultation",
      "Membership-based and cash-pay, with pricing published openly on this site; insurance is used for labs and most prescriptions",
      "Labs drawn at Quest locations near the patient",
    ],
    // How to refer + who to contact (the practice's office manager)
    contactHeading: "How to refer",
    contactBody:
      "Refer the simple way: have your patient visit drmondona.com/book, or have your office reach ours and we'll take it from there. Our office manager is happy to set up a brief call with Dr. Goodwin to introduce the practice and answer questions.",
    // Contact methods shown as buttons/lines
    contactEmailLabel: "Email our office",
    contactPhoneLabel: "Call or text",
  },

  /* =======================================================================
     RESOURCES PAGE (/resources). Trusted providers Dr. Goodwin partners
     with and recommends: pelvic floor PTs, trainers, dietitians, etc.
     ======================================================================= */
  resources: {
    label: "Trusted Resources",
    heading: "Providers I trust and recommend.",
    intro:
      "Real, lasting change is a team effort. Alongside your care at CYRA, these are independent providers I partner with and personally recommend, each one chosen because they take women's health as seriously as I do.",
    // Shown while the list below is still empty. Delete or reword once
    // the first partners are added.
    emptyNote:
      "I'm assembling this list now. In the meantime, if you'd like a personal recommendation (a pelvic floor physical therapist, a trainer, a dietitian), just ask during your visit or text us.",
    // Small print at the bottom of the page
    disclaimer:
      "These are independent providers, not employees or affiliates of CYRA Wellness. No provider pays to be listed here; recommendations reflect professional judgment only.",
    /* HOW TO ADD A PARTNER. Copy this pattern inside categories: [ ] below.
       Each category has a "name" and a list of partners. Each partner needs
       a name; credentials, location, url, and blurb are optional (leave the
       ones you don't need out entirely).

    categories: [
      {
        name: "Pelvic Floor Physical Therapy",
        partners: [
          {
            name: "Jane Smith, DPT",
            credentials: "Doctor of Physical Therapy",
            location: "Ventura, CA (telehealth available)",
            url: "https://example.com",
            blurb: "Specializes in postpartum recovery and pelvic pain.",
          },
        ],
      },
    ],
    */
    categories: [] as {
      name: string;
      partners: {
        name: string;
        credentials?: string;
        location?: string;
        url?: string;
        blurb?: string;
      }[];
    }[],
  },

  /* =======================================================================
     LEGAL LINKS (bottom of every page)
     ======================================================================= */
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    // The practice's HIPAA Notice of Privacy Practices (a PDF). To update it,
    // replace the file public/notice-of-privacy-practices.pdf on GitHub.
    {
      label: "Notice of Privacy Practices",
      href: "/notice-of-privacy-practices.pdf",
    },
    { label: "For Physicians", href: "/for-physicians" },
    { label: "Resources", href: "/resources" },
  ],
} as const;

export type SiteContent = typeof content;
