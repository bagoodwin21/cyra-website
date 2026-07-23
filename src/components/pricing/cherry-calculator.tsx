"use client";

import { useEffect } from "react";
import { content, carePlanTotal } from "@/content/site-content";

const { calculator } = content.home.carePlan;

// Cherry's widget loader queues calls until its script arrives.
type HwFn = { (...args: unknown[]): void; q?: unknown[][] };

export function CherryCalculator() {
  useEffect(() => {
    const w = window as unknown as { _hw?: HwFn };
    if (!w._hw) {
      const hw: HwFn = (...args: unknown[]) => {
        (hw.q = hw.q || []).push(args);
      };
      w._hw = hw;
    }
    if (!document.getElementById("_hw")) {
      const js = document.createElement("script");
      js.id = "_hw";
      js.src = "https://files.withcherry.com/widgets/widget.js";
      js.async = true;
      document.body.appendChild(js);
    }
    w._hw(
      "init",
      {
        debug: false,
        variables: {
          slug: calculator.slug,
          name: calculator.accountName,
          images: "none",
          // Stays in sync with the membership price in site-content.ts
          defaultPurchaseAmount: carePlanTotal,
          language: "en",
        },
        styles: {
          primaryColor: "#6d8794",
          secondaryColor: "#6d879410",
          fontFamily: "Source Sans 3",
          headerFontFamily: "Playfair Display",
        },
      },
      ["calculator"],
    );
  }, []);

  return (
    <div className="rounded-[3px] border border-border bg-background p-6 shadow-card md:p-8">
      <h3 className="font-heading text-2xl font-semibold text-foreground">
        {calculator.heading}
      </h3>
      <p className="text-body-copy mt-2">{calculator.subhead}</p>
      {/* Only the two families the widget is styled with — not Cherry's full menu */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400..900&family=Source+Sans+3:wght@200..900&display=swap"
      />
      <div id="calculator" className="mt-4" />
    </div>
  );
}
