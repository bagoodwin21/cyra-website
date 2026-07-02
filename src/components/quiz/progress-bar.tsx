"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  step: number;
  total: number;
}

export function ProgressBar({ step, total }: ProgressBarProps) {
  const percent = Math.round((step / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-small font-medium text-foreground-muted">
        <span>
          Question {Math.min(step, total)} of {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
