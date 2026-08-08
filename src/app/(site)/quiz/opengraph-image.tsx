import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

// No `export const runtime = "edge"` on purpose: the OpenNext Cloudflare
// adapter rejects edge-runtime routes, and next/og renders fine on the
// default Node runtime.
export const alt =
  "Are your symptoms hormonal? Free 2-minute symptom check from CYRA Wellness";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Quiz-specific share card: the hook lives in the image itself, since in
 * a social feed the image is read before any text. Every share of /quiz
 * uses this; the rest of the site keeps the brand card.
 */
export default function QuizOpengraphImage() {
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
          backgroundColor: "#FBFAF8",
          color: "#2E3238",
          fontFamily: "Georgia, serif",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#6D8794",
            fontWeight: 700,
          }}
        >
          Free 2-Minute Symptom Check
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 84,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Are your symptoms hormonal?
        </div>
        <div
          style={{
            marginTop: 34,
            fontSize: 30,
            color: "#6F747B",
            textAlign: "center",
          }}
        >
          PMS · PMDD · Perimenopause · Menopause · Low Testosterone
        </div>
        <div
          style={{
            marginTop: 56,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              backgroundColor: "#6D8794",
              color: "#FFFFFF",
              fontSize: 26,
              fontWeight: 700,
              padding: "18px 44px",
              borderRadius: 4,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Take the quiz
          </div>
          <div style={{ fontSize: 26, color: "#6F747B" }}>
            No sign-up · Nothing stored
          </div>
        </div>
        <div
          style={{
            marginTop: 52,
            fontSize: 24,
            color: "#6D8794",
            fontWeight: 700,
          }}
        >
          {`${siteConfig.name} · drmondona.com/quiz`}
        </div>
      </div>
    ),
    size
  );
}
