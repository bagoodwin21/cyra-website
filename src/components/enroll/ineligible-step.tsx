import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { EligibilityResult } from "@/lib/enrollment";

interface IneligibleStepProps {
  eligibility: EligibilityResult;
}

/**
 * Routed-out screen for patients the Medicare gate (or minimum-age rule)
 * declines. Message text comes from src/lib/enrollment.ts — do not soften
 * or override it here.
 */
export function IneligibleStep({ eligibility }: IneligibleStepProps) {
  return (
    <div className="text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <HeartHandshake className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="mt-5 font-heading text-2xl font-semibold text-foreground md:text-3xl">
        We&rsquo;re not able to enroll you
      </h1>
      <p className="text-body-copy mx-auto mt-4 max-w-md">{eligibility.message}</p>
      <p className="mt-8 text-small text-foreground-muted">
        Questions?{" "}
        <a
          href="mailto:hello@drmondona.com"
          className="font-medium text-primary hover:text-primary-light"
        >
          hello@drmondona.com
        </a>{" "}
        · <Link href="/" className="font-medium text-primary hover:text-primary-light">Back to home</Link>
      </p>
    </div>
  );
}
