import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /enroll is a post-discovery-call flow, not a public landing page.
      disallow: ["/api/", "/enroll"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
