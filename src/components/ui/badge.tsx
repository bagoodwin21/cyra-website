import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-small font-medium",
  {
    variants: {
      variant: {
        primary: "bg-primary/10 text-primary",
        // A pale-blue chip reads against both white and blush sections;
        // blush-on-blush loses all contrast, so accent/warm route through
        // the same blue tint rather than the blush token.
        accent: "bg-primary/10 text-primary",
        warm: "bg-primary/10 text-foreground-secondary",
        success: "bg-success/10 text-success",
        outline: "border border-border bg-surface text-foreground-secondary",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
