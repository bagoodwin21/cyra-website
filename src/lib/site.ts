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
  instagramUrl: content.brand.instagramUrl,
  disclaimer: content.brand.disclaimer,
  /**
   * Practice SMS number for "text us" links (E.164, e.g. +18055551234).
   * Lives in the content file so Dr. Goodwin can edit it; the env var
   * NEXT_PUBLIC_SMS_NUMBER still works as an override if ever needed.
   */
  smsNumber: process.env.NEXT_PUBLIC_SMS_NUMBER ?? content.brand.smsNumber ?? "",
  smsDisplay: content.brand.smsDisplay ?? "",
};

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = content.nav.links.map((l) => ({ ...l }));
export const legalLinks: NavLink[] = content.legalLinks.map((l) => ({ ...l }));
