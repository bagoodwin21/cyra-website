import type { Metadata } from "next";
import { AnalyticsListener } from "@/components/analytics/analytics-listener";
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "@/components/analytics/google-tag-manager";
import { alexBrush, playfair, quicksand } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `${siteConfig.name} | %s`,
    default: `${siteConfig.name} | Women's Hormonal Health | California Telehealth`,
  },
  description: siteConfig.description,
  keywords: [
    "women's hormonal health California",
    "perimenopause treatment",
    "menopause telehealth California",
    "PMDD treatment",
    "postpartum depression care",
    "testosterone therapy women",
    "women's sexual health",
    "hormone doctor online California",
  ],
  openGraph: {
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${quicksand.variable} ${alexBrush.variable}`}>
      <head>
        {/* Fonts are self-hosted via next/font; these preconnects cover
            the third-party embeds (Calendly scheduling, Cherry financing)
            and any GTM-injected tags that load Google-hosted fonts. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://assets.calendly.com" />
        <link rel="preconnect" href="https://withcherry.com" />
        <GoogleTagManager />
      </head>
      <body className="flex min-h-screen flex-col">
        <GoogleTagManagerNoScript />
        <AnalyticsListener />
        {children}
      </body>
    </html>
  );
}
