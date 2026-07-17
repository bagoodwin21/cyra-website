/**
 * Structural site config — a thin adapter over the editable content file.
 *
 * There is NO editable copy in this file. Every user-visible string lives in
 * src/content/site-content.ts (see EDITING.md). This module only re-shapes
 * that content for the components and SEO helpers that consume it, and pulls
 * environment-driven values (SMS number) that don't belong in content.
 */
import { content } from "@/content/site-content";

export {
  carePlanPricing,
  carePlanTotal,
  carePlanUpfrontTotal,
  formatUsd,
} from "@/content/site-content";

export const siteConfig = {
  name: content.brand.name,
  url: content.brand.website,
  tagline: content.brand.tagline,
  description: content.brand.description,
  physician: content.brand.physician,
  licensedStates: content.brand.licensedStates,
  email: content.brand.email,
  disclaimer: content.brand.disclaimer,
  /**
   * Practice SMS number for "text us" links (E.164, e.g. +18055551234).
   * Set NEXT_PUBLIC_SMS_NUMBER; text-us UI stays hidden until it's real.
   */
  smsNumber: process.env.NEXT_PUBLIC_SMS_NUMBER ?? "",
};

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = content.nav.links.map((l) => ({ ...l }));
export const legalLinks: NavLink[] = content.legalLinks.map((l) => ({ ...l }));
