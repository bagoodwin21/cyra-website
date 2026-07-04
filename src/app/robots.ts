import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /eligibility (pre-booking check) and /enroll (post-consultation
      // agreement flow) are patient-journey pages, not public landings.
      disallow: ["/api/", "/eligibility", "/enroll"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
