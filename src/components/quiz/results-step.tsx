"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Link as LinkIcon, RotateCcw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { conditions } from "@/lib/conditions";
import { conditionIcons } from "@/lib/condition-icons";
import { tierContent, type ConditionSlug, type ResultTier } from "@/lib/quiz";
import { cn } from "@/lib/utils";

interface ResultsStepProps {
  tier: ResultTier;
  topConditions: ConditionSlug[];
  onRetake: () => void;
}

export function ResultsStep({ tier, topConditions, onRetake }: ResultsStepProps) {
  const content = tierContent[tier];
  const [copied, setCopied] = React.useState(false);

  const copyShareLink = async () => {
    const url = new URL(window.location.href);
    url.search = `?result=${tier}`;
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — silently ignore.
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-center">
        <p className="mb-3 text-small font-semibold uppercase tracking-[0.18em] text-accent-dark">
          Your Results
        </p>
        <h2 className="font-heading text-section-mobile text-foreground md:text-section">
          {content.headline}
        </h2>
        <p className="text-body-copy mx-auto mt-5 max-w-2xl">{content.body}</p>
      </div>

      {topConditions.length > 0 && (
        <div className="mt-10">
          <h3 className="text-center font-heading text-lg font-semibold text-foreground md:text-xl">
            Based on your answers, these areas of care are most relevant for you
          </h3>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topConditions.map((slug, i) => {
              const info = conditions[slug];
              const Icon = conditionIcons[slug];
              if (!info) return null;
              return (
                <motion.div
                  key={slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                >
                  <Link href={`/what-we-treat/${slug}`} className="block h-full">
                    <Card className="h-full">
                      <div className="flex items-center gap-3">
                        {Icon && (
                          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" aria-hidden />
                          </span>
                        )}
                        <CardTitle className="text-lg">{info.title}</CardTitle>
                      </div>
                      <CardDescription className="mt-3">
                        {info.description}
                      </CardDescription>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-12 rounded-card bg-primary p-8 text-center md:p-10">
        <p className="mx-auto max-w-xl font-body text-subhead-mobile font-medium text-white md:text-subhead">
          {content.ctaLabel}
        </p>
        <div className="mt-6">
          <Link
            href={`/book?quiz=${tier}${
              topConditions.length > 0
                ? `&focus=${topConditions.join(",")}`
                : ""
            }`}
            className={cn(buttonVariants({ variant: "accent", size: "lg" }))}
          >
            Request More Information
          </Link>
        </div>
        <p className="mt-5 text-small text-white/70">
          15 minutes. No pressure, no commitment — just answers.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
        <button
          type="button"
          onClick={copyShareLink}
          className="inline-flex items-center gap-2 text-small font-medium text-foreground-muted transition-colors hover:text-primary"
        >
          {copied ? (
            <Check className="h-4 w-4 text-success" aria-hidden />
          ) : (
            <LinkIcon className="h-4 w-4" aria-hidden />
          )}
          {copied ? "Link copied" : "Copy shareable link"}
        </button>
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center gap-2 text-small font-medium text-foreground-muted transition-colors hover:text-primary"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Retake the quiz
        </button>
      </div>

      <p className="mt-8 text-center text-small text-foreground-muted">
        This assessment is for educational purposes and is not a medical
        diagnosis. Only a clinical evaluation can determine what&rsquo;s right
        for you.
      </p>
    </motion.div>
  );
}
