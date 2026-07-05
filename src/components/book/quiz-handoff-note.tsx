"use client";

import { useSearchParams } from "next/navigation";
import { ClipboardCheck } from "lucide-react";
import { conditions } from "@/lib/conditions";

/**
 * Shown on /book when the visitor arrives from the symptom quiz
 * (?quiz=<tier>&focus=<slug,slug>). Forward these same params to the
 * real Calendly embed (UTM/custom answers) once it replaces the
 * placeholder, so the care coordinator sees them before the call.
 */
export function QuizHandoffNote() {
  const searchParams = useSearchParams();
  if (!searchParams.get("quiz")) return null;

  const focusAreas = (searchParams.get("focus") ?? "")
    .split(",")
    .map((slug) => conditions[slug]?.title)
    .filter((title): title is string => Boolean(title));

  return (
    <div className="mx-auto mt-6 inline-flex max-w-xl items-start gap-3 rounded-card bg-warm/60 px-5 py-4 text-left">
      <ClipboardCheck
        className="mt-0.5 h-5 w-5 shrink-0 text-primary"
        aria-hidden
      />
      <p className="text-small text-foreground-secondary">
        <span className="font-semibold text-foreground">
          Your quiz results are noted.
        </span>{" "}
        {focusAreas.length > 0 ? (
          <>
            We&rsquo;ll come prepared to talk about{" "}
            {focusAreas.join(", ").replace(/, ([^,]*)$/, ", and $1")}.
          </>
        ) : (
          <>We&rsquo;ll pick up right where your assessment left off.</>
        )}
      </p>
    </div>
  );
}
