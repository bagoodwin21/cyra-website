"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Minus, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import comparisonData from "@/data/comparison.json";

type Verdict = "yes" | "no" | "partial";

interface Cell {
  verdict?: Verdict;
  note?: string;
}

interface Row {
  criterion: string;
  cells: Cell[]; // order matches PLATFORMS
}

// Table contents are maintained in src/data/comparison.json.
const PLATFORMS: string[] = comparisonData.platforms;
const ROWS: Row[] = comparisonData.rows as Row[];

const VERDICT_META: Record<
  Verdict,
  { label: string; className: string; Icon: typeof Check }
> = {
  yes: { label: "Yes", className: "bg-primary/10 text-primary", Icon: Check },
  no: { label: "No", className: "bg-[#C25E5E]/10 text-[#B3574F]", Icon: X },
  partial: {
    label: "Partial",
    className: "bg-amber-500/10 text-amber-600",
    Icon: Minus,
  },
};

function VerdictMark({ verdict }: { verdict: Verdict }) {
  const { label, className, Icon } = VERDICT_META[verdict];
  return (
    <span
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-full",
        className
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={3} aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}

// Solid tint (not translucent) so the sticky CYRA column fully covers
// content scrolling beneath it on mobile. Distinct from bg-surface
// (blush) so the highlighted column still stands out against it.
const CYRA_BG = "bg-[#F3F6F8]";

function CellContent({ cell, isCyra }: { cell: Cell; isCyra: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      {cell.verdict && <VerdictMark verdict={cell.verdict} />}
      {cell.note && (
        <span
          className={cn(
            "text-small leading-snug",
            isCyra ? "font-medium text-primary" : "text-foreground-secondary"
          )}
        >
          {cell.note}
        </span>
      )}
    </div>
  );
}

export function ComparisonTable() {
  const scrollTracked = React.useRef(false);

  const onScroll = () => {
    if (scrollTracked.current) return;
    scrollTracked.current = true;
    trackEvent("compare_table_scroll");
  };

  return (
    <div>
      <div
        className="overflow-x-auto rounded-card border border-border bg-surface shadow-card"
        onScroll={onScroll}
      >
        <table className="w-full min-w-[880px] border-collapse">
          <caption className="sr-only">
            Comparison of menopause telehealth platforms by provider type,
            testosterone access, care structure, financing, and scope.
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th
                scope="col"
                className="sticky left-0 z-20 w-44 min-w-44 bg-surface p-4 text-left text-small font-semibold uppercase tracking-wide text-foreground-muted"
              >
                Criteria
              </th>
              {PLATFORMS.map((platform, i) => {
                const isCyra = i === 0;
                return (
                  <th
                    key={platform}
                    scope="col"
                    className={cn(
                      "p-4 text-center align-bottom",
                      isCyra
                        ? `sticky left-44 z-20 border-l-2 border-l-primary ${CYRA_BG} font-heading text-base font-bold text-primary`
                        : "text-small font-semibold text-foreground"
                    )}
                  >
                    {platform}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, rowIndex) => (
              <motion.tr
                key={row.criterion}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: rowIndex * 0.06 }}
                className="border-b border-border last:border-b-0"
              >
                <th
                  scope="row"
                  className="sticky left-0 z-10 w-44 min-w-44 bg-surface p-4 text-left text-small font-semibold text-foreground"
                >
                  {row.criterion}
                </th>
                {row.cells.map((cell, i) => {
                  const isCyra = i === 0;
                  return (
                    <td
                      key={`${row.criterion}-${PLATFORMS[i]}`}
                      className={cn(
                        "p-4 align-middle",
                        isCyra &&
                          `sticky left-44 z-10 border-l-2 border-l-primary ${CYRA_BG}`
                      )}
                    >
                      <CellContent cell={cell} isCyra={isCyra} />
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-small text-foreground-muted">
        Table reflects publicly available information as of July 2026. Platform
        offerings change. We encourage you to verify directly with any provider
        before making your decision.
      </p>
    </div>
  );
}
