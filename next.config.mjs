import bundleAnalyzer from "@next/bundle-analyzer";

// Run `ANALYZE=true npm run build` to generate bundle treemaps in .next/analyze/.
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Redirects live here (not in vercel.json) so they work on any host:
  // Vercel, Cloudflare Workers (OpenNext), or a plain `next start` server.
  async redirects() {
    return [
      // Canonical host: www.drmondona.com -> drmondona.com
      // The bare root needs its own rule: when :path* matches zero
      // segments, the OpenNext runtime leaves the token unsubstituted
      // and redirects to a literal "/:path*".
      {
        source: "/",
        has: [{ type: "host", value: "www.drmondona.com" }],
        destination: "https://drmondona.com/",
        permanent: true,
      },
      {
        source: "/:path+",
        has: [{ type: "host", value: "www.drmondona.com" }],
        destination: "https://drmondona.com/:path+",
        permanent: true,
      },

      // Retired pages from the previous site.
      { source: "/home", destination: "/", permanent: true },
      { source: "/services", destination: "/", permanent: true },
      { source: "/quiz", destination: "/", permanent: true },
      { source: "/info", destination: "/", permanent: true },
      { source: "/faq", destination: "/#faq", permanent: true },
      { source: "/insurance", destination: "/#insurance", permanent: true },
      { source: "/testimonials", destination: "/reviews", permanent: true },
      { source: "/contact", destination: "/book", permanent: true },
      { source: "/schedule", destination: "/book", permanent: true },
      { source: "/insurancecompare", destination: "/compare", permanent: true },
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/:slug*", destination: "/", permanent: true },
    ];
  },

  // Security + cache headers, also host-agnostic.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // CDN caching for HTML pages. Next.js sets its own Cache-Control on
        // rendered routes, so on some hosts this is advisory; kept for parity
        // with the previous vercel.json behavior.
        source: "/((?!_next/|api/).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
