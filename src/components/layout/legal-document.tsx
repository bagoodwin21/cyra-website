import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { FadeUp } from "@/components/ui/fade-up";
import { content } from "@/content/site-content";

interface LegalSection {
  readonly heading: string;
  readonly body: readonly string[];
}

interface LegalDocumentProps {
  label: string;
  title: string;
  effectiveDate: string;
  intro: string;
  sections: readonly LegalSection[];
  /** Optional prominent link to a related document (e.g. the NPP PDF). */
  documentLink?: { label: string; href: string };
}

/**
 * Renders a full legal document (privacy policy, terms of service) as a
 * single readable prose column. All wording comes from `legalPages` in
 * src/content/site-content.ts.
 */
export function LegalDocument({
  label,
  title,
  effectiveDate,
  intro,
  sections,
  documentLink,
}: LegalDocumentProps) {
  return (
    <Section>
      <FadeUp className="mx-auto max-w-3xl">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="heading-section">{title}</h1>
        <p className="mt-4 text-small font-semibold uppercase tracking-[0.1em] text-primary">
          Effective {effectiveDate}
        </p>
        <p className="text-subheadline mt-6">{intro}</p>
        {documentLink && (
          <p className="mt-4">
            <a
              href={documentLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-cta font-bold uppercase tracking-[0.15em] text-primary underline-offset-2 hover:underline"
            >
              {documentLink.label}
            </a>
          </p>
        )}

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-heading text-xl font-semibold text-foreground md:text-2xl">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-body-copy">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-14 border-t border-border pt-8 text-small text-foreground-muted">
          {content.legalPages.questionsPrompt}{" "}
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
