"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { content } from "@/content/site-content";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Slim bottom bar on mobile with the primary booking CTA (and a
 * "text us" shortcut when the practice SMS number is configured).
 * Appears once the visitor scrolls past the hero so it never covers
 * above-the-fold CTAs. /book is excluded automatically (it has its own
 * layout outside the (site) group).
 */
export function MobileBookBar() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hasSms = /^\+\d{7,15}$/.test(siteConfig.smsNumber);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 88 }}
          animate={{ y: 0 }}
          exit={{ y: 88 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden"
        >
          <div className="mx-auto flex max-w-md items-center gap-3">
            <Link
              href="/book"
              className={cn(
                buttonVariants({ variant: "accent" }),
                "h-11 flex-1"
              )}
            >
              {content.nav.cta}
            </Link>
            {hasSms && (
              <a
                href={`sms:${siteConfig.smsNumber}`}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "h-11 shrink-0 gap-1.5 px-4"
                )}
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Text Us
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
