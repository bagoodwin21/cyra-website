import bundleAnalyzer from "@next/bundle-analyzer";

// Run `ANALYZE=true npm run build` to generate bundle treemaps in .next/analyze/.
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withBundleAnalyzer(nextConfig);
