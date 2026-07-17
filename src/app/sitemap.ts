import type { MetadataRoute } from "next";
import { legalLinks, navLinks, siteConfig } from "@/lib/site";

/** Priority scheme: 1.0 home, 0.7 about/book, 0.5 legal pages. */
function priorityFor(path: string): number {
  if (path === "/") return 1.0;
  if (path === "/about" || path === "/book" || path === "/compare") return 0.7;
  return 0.5;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Only real, indexable pages. Nav "#" anchors point at home-page
  // sections, so we filter them out and index the pages themselves.
  const routes = Array.from(
    new Set([
      "/",
      "/about",
      "/book",
      "/compare",
      ...navLinks.map((l) => l.href),
      ...legalLinks.map((l) => l.href),
    ]),
  ).filter((path) => path.startsWith("/") && !path.includes("#"));

  return routes.map((path) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: priorityFor(path),
  }));
}
