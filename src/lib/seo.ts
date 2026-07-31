import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

interface PageSeo {
  title: string;
  description?: string;
  path?: string;
  /**
   * Use the title exactly as given instead of running it through the
   * root layout's "CYRA Wellness | %s" template — for pages whose SEO
   * title doesn't lead with the brand name.
   */
  absoluteTitle?: boolean;
  /** Keep the page out of search results (confirmation pages, etc.). */
  noindex?: boolean;
}

/**
 * Builds per-page metadata. The root layout supplies the
 * "CYRA Wellness | %s" title template, so pages pass only their name
 * (or set absoluteTitle for a fully custom title).
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  absoluteTitle = false,
  noindex = false,
}: PageSeo): Metadata {
  const desc = description ?? siteConfig.description;
  const socialTitle = absoluteTitle ? title : `${siteConfig.name} | ${title}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: socialTitle,
      description: desc,
      url: path,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: desc,
    },
  };
}
