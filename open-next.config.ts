// OpenNext adapter config for deploying this Next.js app to Cloudflare Workers.
// Only used by `npm run cf:build` / `cf:deploy` — Vercel ignores this file.
//
// The site is fully static (no ISR, no `export const revalidate`), so no
// incremental cache override is configured. If revalidated/ISR routes are
// added later, add an incremental cache here (e.g. the R2 cache) and the
// matching bindings in wrangler.jsonc:
//   import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
//   export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache });
// See https://opennext.js.org/cloudflare/caching
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig();
