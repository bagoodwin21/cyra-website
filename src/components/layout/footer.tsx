import Link from "next/link";
import { MapPin, Mail, MessageCircle } from "lucide-react";
import { content } from "@/content/site-content";
import { legalLinks, navLinks, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-warm text-foreground">
      <div className="mx-auto grid max-w-content gap-12 px-6 py-14 md:grid-cols-3 lg:px-8">
        {/* Col 1: brand */}
        <div>
          <p className="font-heading text-4xl font-bold text-foreground">
            {content.brand.name}
          </p>
          <p className="mt-3 text-small text-foreground-secondary">
            {content.brand.tagline}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-background px-3.5 py-1.5 text-small font-medium text-foreground-secondary">
            <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden />
            {content.footer.locationChip}
          </span>
        </div>

        {/* Col 2: quick links */}
        <nav aria-label="Footer">
          <p className="text-[11px] font-bold uppercase tracking-[0.27em] text-primary">
            {content.footer.quickLinksHeading}
          </p>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[12px] font-semibold uppercase tracking-[0.15em] text-foreground-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 3: contact + disclaimer */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.27em] text-primary">
            {content.footer.contactHeading}
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-4 inline-flex items-center gap-2 text-small text-foreground-secondary transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" aria-hidden />
            {siteConfig.email}
          </a>
          {/^\+\d{7,15}$/.test(siteConfig.smsNumber) && (
            <a
              href={`sms:${siteConfig.smsNumber}`}
              className="mt-2 flex items-center gap-2 text-small text-foreground-secondary transition-colors hover:text-foreground"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Prefer to text? Message us
            </a>
          )}
          <p className="mt-4 text-small font-medium text-foreground">
            {siteConfig.licensedStates}
          </p>
          <p className="mt-3 text-small leading-relaxed text-foreground-muted">
            {siteConfig.disclaimer}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-3 px-6 py-5 text-small text-foreground-muted md:flex-row lg:px-8">
          <p>{content.brand.copyright}</p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
