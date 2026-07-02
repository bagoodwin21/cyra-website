import type { MetadataRoute } from "next";
import { conditions } from "@/lib/conditions";
import { legalLinks, navLinks, secondaryLinks, siteConfig } from "@/lib/site";

/** Priority scheme: 1.0 home, 0.8 condition pages + /compare, 0.6 the rest. */
function priorityFor(path: string): number {
  if (path === "/") return 1.0;
  if (path.startsWith("/what-we-treat/") || path === "/compare") return 0.8;
  return 0.6;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = Array.from(
    new Set([
      "/",
      "/book",
      ...navLinks.map((l) => l.href),
      ...secondaryLinks.map((l) => l.href),
      ...Object.keys(conditions).map((slug) => `/what-we-treat/${slug}`),
      ...legalLinks.map((l) => l.href),
    ])
  );

  return routes.map((path) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: priorityFor(path),
  }));
}
