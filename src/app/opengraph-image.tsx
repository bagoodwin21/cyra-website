import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Placeholder Open Graph image; swap for branded artwork when available.
export default function OpengraphImage() {
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
          backgroundColor: "#1A1A1A",
          color: "#E5E1DE",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700 }}>{siteConfig.name}</div>
        <div
          style={{
            marginTop: 24,
            fontSize: 34,
            color: "#8FA5B3",
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 24,
            color: "rgba(250, 247, 244, 0.75)",
          }}
        >
          California Women&apos;s Hormone Telehealth · drmondona.com
        </div>
      </div>
    ),
    size
  );
}
