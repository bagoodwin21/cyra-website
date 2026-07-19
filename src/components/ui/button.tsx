import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // whitespace-normal below sm: the long uppercase CTA text is wider than a
  // phone screen when forced onto one line, which inflates every container
  // that holds a button and clips the page edge.
  "inline-flex items-center justify-center gap-2 whitespace-normal text-center sm:whitespace-nowrap font-body text-cta font-bold uppercase tracking-[0.12em] sm:tracking-[0.17em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Rectangular slate fills (brand mockup); white text per the
        // approved design — deepened slate keeps it readable.
        primary: "rounded-[3px] bg-primary text-white hover:bg-accent",
        secondary:
          "rounded-full border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-white",
        ghost: "rounded-[3px] bg-transparent text-primary hover:bg-primary/10",
        accent: "rounded-[3px] bg-primary text-white hover:bg-accent",
      },
      size: {
        default: "min-h-12 px-6 py-2.5 sm:h-12 sm:px-10 sm:py-0",
        sm: "min-h-10 px-5 py-2 sm:h-10 sm:px-6 sm:py-0",
        lg: "min-h-14 px-8 py-3 sm:h-14 sm:px-12 sm:py-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
