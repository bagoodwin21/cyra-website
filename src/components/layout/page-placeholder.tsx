import Link from "next/link";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { FadeUp } from "@/components/ui/fade-up";
import { buttonVariants } from "@/components/ui/button";
import { content } from "@/content/site-content";
import { cn } from "@/lib/utils";

interface PagePlaceholderProps {
  label: string;
  title: string;
  description: string;
}

/**
 * Simple centered placeholder for pages whose full content is still being
 * finalized (privacy policy, terms of service).
 */
export function PagePlaceholder({ label, title, description }: PagePlaceholderProps) {
  return (
    <Section>
      <FadeUp className="mx-auto max-w-2xl py-8 text-center md:py-16">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="heading-hero">{title}</h1>
        <p className="text-subheadline mt-6">{description}</p>
        <div className="mt-10">
          <Link href="/" className={cn(buttonVariants({ variant: "secondary" }))}>
            {content.placeholderPage.backToHome}
          </Link>
        </div>
        <p className="mt-8 text-small text-foreground-muted">
          {content.placeholderPage.questionsPrompt}{" "}
          <a
            href={`mailto:${content.brand.email}`}
            className="font-medium text-primary hover:text-primary-light"
          >
            {content.brand.email}
          </a>
        </p>
      </FadeUp>
    </Section>
  );
}
