import type { conditions } from "@/lib/conditions";

export type ConditionSlug = keyof typeof conditions;

export interface QuizOption {
  label: string;
  /** Symptom-burden weight, 0 (none) to 3 (severe). Omitted on non-severity questions. */
  score?: number;
  /** Conditions this answer signals interest/relevance toward. */
  tags?: ConditionSlug[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  skippable?: boolean;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "How old are you?",
    options: [
      { label: "Under 35", tags: ["thyroid-adrenal"] },
      { label: "35–42", tags: ["perimenopause"] },
      { label: "43–50", tags: ["perimenopause", "menopause"] },
      { label: "51–58", tags: ["menopause"] },
      { label: "59+", tags: ["menopause", "thyroid-adrenal"] },
    ],
  },
  {
    id: 2,
    question: "How would you describe your current menstrual cycle?",
    skippable: true,
    options: [
      { label: "Regular and predictable", score: 0 },
      { label: "Becoming irregular", score: 1.5, tags: ["perimenopause"] },
      {
        label: "Very irregular or unpredictable",
        score: 2.5,
        tags: ["perimenopause"],
      },
      { label: "Periods have stopped", score: 1, tags: ["menopause"] },
      {
        label: "I've had a hysterectomy",
        score: 0,
        tags: ["estrogen-progesterone"],
      },
    ],
  },
  {
    id: 3,
    question: "How often do you experience hot flashes or night sweats?",
    options: [
      { label: "Never", score: 0 },
      {
        label: "Occasionally (a few times a week)",
        score: 1,
        tags: ["menopause"],
      },
      { label: "Daily", score: 2, tags: ["menopause", "perimenopause"] },
      {
        label: "Multiple times a day — affecting my quality of life",
        score: 3,
        tags: ["menopause", "perimenopause"],
      },
    ],
  },
  {
    id: 4,
    question: "How is your sleep?",
    options: [
      { label: "Generally good", score: 0 },
      { label: "Occasionally disrupted", score: 1 },
      {
        label: "Frequently disrupted",
        score: 2,
        tags: ["estrogen-progesterone"],
      },
      {
        label: "Severely disrupted — I wake up exhausted",
        score: 3,
        tags: ["estrogen-progesterone", "thyroid-adrenal"],
      },
    ],
  },
  {
    id: 5,
    question: "Have you noticed changes in your mood, anxiety, or depression?",
    options: [
      { label: "No significant changes", score: 0 },
      { label: "Mild changes", score: 1 },
      {
        label: "Moderate changes I've noticed",
        score: 2,
        tags: ["perimenopause"],
      },
      {
        label: "Significant changes that affect my daily life",
        score: 3,
        tags: ["perimenopause", "estrogen-progesterone"],
      },
    ],
  },
  {
    id: 6,
    question: "How is your energy and mental clarity?",
    options: [
      { label: "Good — no major complaints", score: 0 },
      {
        label: "Some fatigue and occasional brain fog",
        score: 1,
        tags: ["thyroid-adrenal"],
      },
      {
        label: "Frequent fatigue and noticeable brain fog",
        score: 2,
        tags: ["thyroid-adrenal", "testosterone-therapy"],
      },
      {
        label: "Severe — I struggle to function at my previous level",
        score: 3,
        tags: ["thyroid-adrenal", "testosterone-therapy"],
      },
    ],
  },
  {
    id: 7,
    question:
      "Have you noticed changes in your libido, vaginal comfort, or sexual function?",
    options: [
      { label: "No changes", score: 0 },
      { label: "Some changes I've noticed", score: 1, tags: ["testosterone-therapy"] },
      {
        label: "Significant changes",
        score: 2,
        tags: ["testosterone-therapy", "estrogen-progesterone"],
      },
      {
        label: "Severe — it's affecting my relationship or quality of life",
        score: 3,
        tags: ["testosterone-therapy", "estrogen-progesterone"],
      },
    ],
  },
  {
    id: 8,
    question:
      "Have you noticed unexplained weight gain, especially around your midsection?",
    options: [
      { label: "No", score: 0 },
      { label: "Some weight gain", score: 1.5, tags: ["weight-management"] },
      {
        label:
          "Significant weight gain I can't explain despite no major lifestyle changes",
        score: 3,
        tags: ["weight-management", "thyroid-adrenal"],
      },
    ],
  },
  {
    id: 9,
    question: "Have you ever had your hormone levels tested?",
    options: [
      {
        label: "Yes, and I was told everything is normal",
        score: 1.5,
        tags: ["testosterone-therapy"],
      },
      { label: "Yes, and I was given some treatment", score: 0.5 },
      { label: "No, but I'd like to", score: 0.5 },
      { label: "No", score: 0 },
    ],
  },
  {
    id: 10,
    question: "Are you currently on any hormone therapy?",
    options: [
      { label: "No", score: 0 },
      { label: "Yes, and it's working well", score: 0 },
      {
        label: "Yes, but I don't feel like it's optimized",
        score: 2,
        tags: ["estrogen-progesterone"],
      },
      { label: "I was on HRT and stopped", score: 1.5, tags: ["menopause"] },
    ],
  },
  {
    id: 11,
    question:
      "Have you been told your symptoms are “normal for your age” or “within normal range” when you didn't feel that way?",
    options: [
      { label: "Yes, multiple times", score: 3 },
      { label: "Yes, once or twice", score: 1.5 },
      { label: "No", score: 0 },
    ],
  },
  {
    id: 12,
    question: "What's your primary goal in seeking hormone care?",
    options: [
      { label: "Understand what's happening to my body" },
      { label: "Relieve specific symptoms" },
      { label: "Optimize how I feel overall" },
      { label: "Evaluate or adjust current treatment", tags: ["estrogen-progesterone"] },
      { label: "All of the above" },
    ],
  },
];

const MAX_SCORE = quizQuestions.reduce(
  (sum, q) => sum + Math.max(...q.options.map((o) => o.score ?? 0)),
  0
);

export type QuizAnswers = Record<number, number>; // question id -> option index

export type ResultTier = "tier1" | "tier2" | "tier3";

export interface TierContent {
  headline: string;
  body: string;
  ctaLabel: string;
}

export const tierContent: Record<ResultTier, TierContent> = {
  tier1: {
    headline: "Your symptoms suggest hormonal imbalance that's worth evaluating.",
    body: "Based on your answers, you're carrying a meaningful symptom burden across multiple areas. The good news: these are commonly treatable with proper hormonal care. A physician evaluation — not just a lab panel — is the right next step to understand what's actually happening and build a plan around it.",
    ctaLabel: "Book your free discovery call — Dr. Mondona reviews cases like yours regularly.",
  },
  tier2: {
    headline: "You're noticing changes that are worth taking seriously.",
    body: "Your answers put you in a moderate range — the kind of mid-level symptoms that often get dismissed as “normal” when they're actually early signals worth evaluating. Catching this now, rather than waiting for things to worsen, is exactly when hormone care tends to help most.",
    ctaLabel: "Book your free discovery call to talk through what you're noticing.",
  },
  tier3: {
    headline: "You may be in early perimenopause, or optimizing from a good baseline.",
    body: "Your symptom burden is lower right now, and that's a good sign — but proactive hormone care makes sense even before symptoms become severe. A discovery call can help you understand where you stand today and whether it's worth getting ahead of things.",
    ctaLabel: "A discovery call can clarify where you are and whether CYRA is the right fit.",
  },
};

export interface QuizResult {
  tier: ResultTier;
  percent: number;
  score: number;
  maxScore: number;
  topConditions: ConditionSlug[];
}

/**
 * Scores answered questions (skipped Q2 simply doesn't contribute) and
 * ranks condition tags by frequency to surface the most relevant
 * CYRA services for the result screen.
 */
export function computeQuizResult(answers: QuizAnswers): QuizResult {
  let score = 0;
  const tagCounts = new Map<ConditionSlug, number>();

  for (const q of quizQuestions) {
    const optionIndex = answers[q.id];
    if (optionIndex === undefined) continue;
    const option = q.options[optionIndex];
    if (!option) continue;
    score += option.score ?? 0;
    for (const tag of option.tags ?? []) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const percent = MAX_SCORE > 0 ? Math.round((score / MAX_SCORE) * 100) : 0;
  const tier: ResultTier = percent >= 60 ? "tier1" : percent >= 30 ? "tier2" : "tier3";

  const topConditions = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([slug]) => slug);

  return { tier, percent, score, maxScore: MAX_SCORE, topConditions };
}
