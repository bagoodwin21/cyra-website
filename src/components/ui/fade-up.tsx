"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface FadeUpProps {
  children: React.ReactNode;
  /** Seconds to wait before starting, for staggered groups. */
  delay?: number;
  className?: string;
}

/**
 * Fades content up as it scrolls into view (Framer Motion's whileInView
 * uses IntersectionObserver under the hood). Animates once.
 */
export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  // Honor the OS "reduce motion" setting: skip the fade/slide so nothing
  // looks half-loaded to motion-sensitive users. Must stay the same
  // element type in both modes (an early-return plain <div> causes a
  // hydration mismatch that leaves the server's opacity:0 in place).
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
