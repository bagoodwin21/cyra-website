import Script from "next/script";

/**
 * Accepts either a Google Tag Manager container ID (GTM-XXXXXXX) or a
 * GA4 measurement ID (G-XXXXXXXXXX). NEXT_PUBLIC_GTM_ID overrides the
 * default at build time. Measurement IDs are public (visible in any
 * site's page source), so committing the default here is safe.
 */
const TAG_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "G-8WS0NYP004";

const enabled = !TAG_ID.startsWith("[");
const isGtmContainer = TAG_ID.startsWith("GTM-");

/**
 * Google tag loader. With a GTM- ID it loads the Tag Manager container;
 * with a G- ID it loads gtag.js directly (no GTM account needed).
 */
export function GoogleTagManager() {
  if (!enabled) return null;
  if (isGtmContainer) {
    return (
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${TAG_ID}');`}
      </Script>
    );
  }
  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${TAG_ID}');`}
      </Script>
    </>
  );
}

/** GTM noscript fallback — only applies to GTM containers. */
export function GoogleTagManagerNoScript() {
  if (!enabled || !isGtmContainer) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${TAG_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
