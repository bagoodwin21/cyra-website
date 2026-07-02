import { hubspotConfig, siteConfig } from "@/lib/site";

interface HubspotField {
  name: string;
  value: string;
}

/**
 * Submits to the HubSpot Forms API (https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formId}).
 * No-ops (resolves false) until real portal/form IDs replace the
 * placeholders in src/lib/site.ts, so the quiz email gate degrades
 * gracefully in the meantime instead of throwing.
 */
export async function submitToHubspot(fields: HubspotField[]): Promise<boolean> {
  if (
    hubspotConfig.portalId.startsWith("[") ||
    hubspotConfig.formId.startsWith("[")
  ) {
    return false;
  }

  try {
    const res = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${hubspotConfig.portalId}/${hubspotConfig.formId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields,
          context: {
            pageUri: typeof window !== "undefined" ? window.location.href : siteConfig.url,
            pageName: "Hormone Symptom Assessment Quiz",
          },
        }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}
