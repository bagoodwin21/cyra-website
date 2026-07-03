import { ImageResponse } from "next/og";
import { conditions } from "@/lib/conditions";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return Object.keys(conditions).map((condition) => ({ condition }));
}

export function generateImageMetadata({
  params,
}: {
  params: { condition: string };
}) {
  const info = conditions[params.condition];
  return [
    {
      id: "og",
      alt: info
        ? `${siteConfig.name} — ${info.title}`
        : siteConfig.name,
      size,
      contentType,
    },
  ];
}

// Condition-specific Open Graph card in the same branding as the
// site-wide default (src/app/opengraph-image.tsx).
export default function OpengraphImage({
  params,
}: {
  params: { condition: string };
}) {
  const info = conditions[params.condition];
  const title = info?.title ?? "What We Treat";
  const tagline = info?.tagline ?? siteConfig.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#364954",
          color: "#FAF7F4",
          fontFamily: "Georgia, serif",
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 30, color: "#C9878A", letterSpacing: 4 }}>
          CYRA WELLNESS
        </div>
        <div style={{ marginTop: 28, fontSize: 76, fontWeight: 700 }}>
          {title}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "rgba(250, 247, 244, 0.85)",
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            marginTop: 44,
            fontSize: 24,
            color: "rgba(250, 247, 244, 0.7)",
          }}
        >
          California Menopause &amp; Hormone Telehealth · drmondona.com
        </div>
      </div>
    ),
    size
  );
}
