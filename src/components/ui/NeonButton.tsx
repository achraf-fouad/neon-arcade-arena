import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const neonButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-gaming text-sm font-semibold uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: [
          "bg-primary/20 text-primary border border-primary/50",
          "hover:bg-primary hover:text-primary-foreground",
          "shadow-[0_0_20px_hsl(var(--primary)/0.3)]",
          "hover:shadow-[0_0_30px_hsl(var(--primary)/0.6),0_0_60px_hsl(var(--primary)/0.3)]",
        ],
        accent: [
          "bg-accent/20 text-accent border border-accent/50",
          "hover:bg-accent hover:text-accent-foreground",
          "shadow-[0_0_20px_hsl(var(--accent)/0.3)]",
          "hover:shadow-[0_0_30px_hsl(var(--accent)/0.6),0_0_60px_hsl(var(--accent)/0.3)]",
        ],
        ghost: [
          "bg-transparent text-foreground border border-border",
          "hover:bg-muted hover:border-primary/50 hover:text-primary",
        ],
        outline: [
          "bg-transparent text-primary border-2 border-primary",
          "hover:bg-primary/10",
          "shadow-[0_0_10px_hsl(var(--primary)/0.2)]",
        ],
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface NeonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neonButtonVariants> {
  asChild?: boolean;
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(neonButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
NeonButton.displayName = "NeonButton";

export { NeonButton, neonButtonVariants };
