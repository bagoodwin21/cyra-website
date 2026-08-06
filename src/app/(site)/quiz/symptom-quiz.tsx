"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { content } from "@/content/site-content";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const { quiz } = content;

type Answers = Record<string, string>;

interface ResultDef {
  name: string;
  title: string;
  body: string[];
  crisis?: boolean;
}

const RESULTS = quiz.results as unknown as Record<string, ResultDef>;

// Skip logic, keyed to question ids in the content file. A question shows
// only when its condition (if any) passes against the answers so far.
const CONDITIONS: Record<string, (a: Answers) => boolean> = {
  timing: (a) => !!a.period && a.period !== "stopped" && a.period !== "cant",
  intensity: (a) => a.timing === "yes" || a.timing === "some",
};

function visibleQuestions(answers: Answers) {
  return quiz.questions.filter((q) => {
    const cond = CONDITIONS[q.id];
    return !cond || cond(answers);
  });
}

function computeResult(answers: Answers) {
  const s: Record<string, number> = { PERI: 0, MENO: 0, PMDD: 0, PMS: 0, LOWT: 0 };
  const stopped = answers.period === "stopped";

  if (stopped) {
    s.MENO += 3;
    s.PMS = -99;
    s.PMDD = -99;
  }
  if (answers.period === "changing" || answers.period === "irregular") s.PERI += 2;

  if (answers.age === "a3544") s.PERI += 1;
  if (answers.age === "a4555") s.PERI += 2;
  if (answers.age === "o55") s.MENO += 1;

  if (answers.timing === "yes") {
    s.PMS += 2;
    s.PMDD += 2;
  }
  if (answers.timing === "some") {
    s.PMS += 1;
    s.PMDD += 1;
  }

  if (answers.intensity === "severe") s.PMDD += 3;
  if (answers.intensity === "manage") s.PMS += 2;
  if (answers.intensity === "physical") s.PMS += 2;

  if (answers.heat === "often") s[stopped ? "MENO" : "PERI"] += 2;
  if (answers.heat === "some") s[stopped ? "MENO" : "PERI"] += 1;

  if (answers.sleep === "often") s[stopped ? "MENO" : "PERI"] += 2;
  if (answers.sleep === "some") s[stopped ? "MENO" : "PERI"] += 1;

  if (answers.weight === "yes") {
    s.LOWT += 1;
    s[stopped ? "MENO" : "PERI"] += 1;
  }

  if (answers.drive === "several") s.LOWT += 3;
  if (answers.drive === "onetwo") s.LOWT += 1;

  if (answers.comfort === "yes") {
    if (stopped) s.MENO += 2;
    else {
      s.PERI += 1;
      s.MENO += 1;
    }
  }
  if (answers.comfort === "some") s[stopped ? "MENO" : "PERI"] += 1;

  const keys = ["PERI", "MENO", "PMDD", "PMS", "LOWT"].sort((a, b) => s[b] - s[a]);
  const primary = s[keys[0]] >= 4 ? keys[0] : "UNCLEAR";
  const secondaries: string[] = [];
  if (primary !== "UNCLEAR") {
    for (let i = 1; i < keys.length; i++) {
      if (s[keys[i]] >= 3 && s[keys[0]] - s[keys[i]] <= 2 && secondaries.length < 2) {
        secondaries.push(keys[i]);
      }
    }
  }
  return { primary, secondaries, cantTrack: answers.period === "cant" };
}

export function SymptomQuiz() {
  const [started, setStarted] = React.useState(false);
  const [answers, setAnswers] = React.useState<Answers>({});
  const [trail, setTrail] = React.useState<string[]>([]);

  const vis = visibleQuestions(answers);
  const current = vis.find((q) => !(q.id in answers));
  const finished = started && !current;

  const completedRef = React.useRef(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const result = finished ? computeResult(answers) : null;
  React.useEffect(() => {
    if (result && !completedRef.current) {
      completedRef.current = true;
      trackEvent("quiz_completed", {
        result: result.primary,
        secondary: result.secondaries.join(",") || "none",
      });
      // The result renders below the page hero; bring it into view so the
      // payoff moment isn't half-buried.
      cardRef.current?.scrollIntoView({ block: "start" });
    }
    if (!finished) completedRef.current = false;
  }, [finished, result]);

  function restart() {
    setAnswers({});
    setTrail([]);
    setStarted(false);
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-xl rounded-[3px] border border-border bg-background p-7 shadow-card md:p-8">
        <p className="text-body-copy text-foreground-muted">{quiz.startNote}</p>
        <button
          type="button"
          onClick={() => {
            setStarted(true);
            trackEvent("quiz_started");
          }}
          className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-6 w-full")}
        >
          {quiz.startCta}
        </button>
      </div>
    );
  }

  if (finished && result) {
    const res = RESULTS[result.primary];
    const showCrisis =
      res.crisis || (answers.baby === "yes" && answers.intensity === "severe");
    const textBody = encodeURIComponent(
      quiz.textBodyTemplate.replace("{result}", res.name),
    );
    return (
      <div
        ref={cardRef}
        className="mx-auto max-w-xl scroll-mt-24 rounded-[3px] border border-border bg-background p-7 shadow-card md:p-8"
      >
        <p className="text-small font-semibold uppercase tracking-[0.18em] text-primary">
          {quiz.resultKicker}
        </p>
        <h2 className="mt-3 font-heading text-2xl font-semibold leading-snug text-foreground md:text-3xl">
          {res.title}
        </h2>
        <div className="mt-5 space-y-4">
          {res.body.map((p) => (
            <p key={p.slice(0, 40)} className="text-body-copy">
              {p}
            </p>
          ))}
        </div>

        {result.secondaries.length > 0 && (
          <>
            <p className="mt-7 text-small font-semibold uppercase tracking-[0.14em] text-foreground-muted">
              {quiz.alsoWorthLabel}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {result.secondaries.map((key) => (
                <span
                  key={key}
                  className="rounded-full border border-border bg-primary/10 px-3 py-1.5 text-small font-semibold text-primary"
                >
                  {RESULTS[key].name}
                </span>
              ))}
            </div>
          </>
        )}

        {answers.baby === "yes" && (
          <p className="mt-6 rounded-[3px] bg-surface p-4 text-small leading-relaxed text-foreground">
            {quiz.postpartumNote}
          </p>
        )}
        {result.cantTrack && (
          <p className="mt-4 rounded-[3px] bg-surface p-4 text-small leading-relaxed text-foreground">
            {quiz.cantTrackNote}
          </p>
        )}
        {showCrisis && (
          <p className="mt-4 rounded-[3px] bg-primary/10 p-4 text-small font-medium leading-relaxed text-foreground">
            {quiz.crisisNote}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/book/consultation"
            data-analytics-event="book_consult_click"
            className={cn(buttonVariants({ variant: "accent", size: "lg" }), "w-full")}
          >
            {quiz.consultCta}
          </Link>
          <Link
            href="/book/discovery-call"
            data-analytics-event="book_discovery_call_click"
            className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
          >
            {quiz.discoveryCta}
          </Link>
          <a
            href={`sms:${siteConfig.smsNumber}?&body=${textBody}`}
            data-analytics-event="quiz_text_result_click"
            className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
          >
            {quiz.textCta}: {siteConfig.smsDisplay}
          </a>
        </div>
        <p className="mt-5 text-center text-small text-foreground-muted">
          {quiz.screenshotHint}
        </p>

        <p className="mt-7 border-t border-border pt-5 text-small leading-relaxed text-foreground-muted">
          {quiz.disclaimer}
        </p>
        <p className="mt-4 text-right">
          <button
            type="button"
            onClick={restart}
            className="text-small font-medium text-foreground-muted underline underline-offset-4 transition-colors hover:text-foreground"
          >
            {quiz.restartLabel}
          </button>
        </p>
      </div>
    );
  }

  const q = current!;
  const index = vis.indexOf(q);
  const pct = Math.round((index / vis.length) * 100);

  return (
    <div className="mx-auto max-w-xl rounded-[3px] border border-border bg-background p-7 shadow-card md:p-8">
      <div className="flex items-center gap-4">
        {/* No denominator: branching adds questions mid-quiz, and a total
            that grows while you answer reads as moving the goalposts. */}
        <span className="whitespace-nowrap text-small font-semibold uppercase tracking-[0.14em] text-foreground-muted">
          Question {index + 1}
        </span>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface">
          <span
            className="block h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <h2 className="mt-5 font-heading text-xl font-semibold leading-snug text-foreground md:text-2xl">
        {q.q}
      </h2>
      <div className="mt-5 flex flex-col gap-2.5" role="group" aria-label={q.q}>
        {q.opts.map((opt) => (
          <button
            key={opt.v}
            type="button"
            onClick={() => {
              setAnswers((prev) => ({ ...prev, [q.id]: opt.v }));
              setTrail((prev) => [...prev, q.id]);
            }}
            className="flex w-full items-start gap-3 rounded-[3px] border border-border bg-surface/40 p-4 text-left font-body text-[15px] leading-relaxed text-foreground transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary/40" aria-hidden />
            <span>{opt.t}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        {trail.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              const last = trail[trail.length - 1];
              setTrail((prev) => prev.slice(0, -1));
              setAnswers((prev) => {
                const next = { ...prev };
                delete next[last];
                return next;
              });
            }}
            className="text-small font-medium text-foreground-muted underline underline-offset-4 transition-colors hover:text-foreground"
          >
            ← {quiz.backLabel}
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={restart}
          className="text-small font-medium text-foreground-muted underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {quiz.restartLabel}
        </button>
      </div>
    </div>
  );
}
