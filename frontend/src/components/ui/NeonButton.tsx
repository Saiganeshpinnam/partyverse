import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const neonButtonVariants = cva(
  "relative inline-flex items-center justify-center font-orbitron font-semibold uppercase tracking-wider transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
  {
    variants: {
      variant: {
        cyan: [
          "bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20",
          "border-2 border-neon-cyan",
          "text-neon-cyan",
          "hover:bg-neon-cyan/30 hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.5),0_0_60px_hsl(var(--neon-cyan)/0.3)]",
          "active:scale-95",
        ],
        magenta: [
          "bg-gradient-to-r from-neon-magenta/20 to-neon-purple/20",
          "border-2 border-neon-magenta",
          "text-neon-magenta",
          "hover:bg-neon-magenta/30 hover:shadow-[0_0_30px_hsl(var(--neon-magenta)/0.5),0_0_60px_hsl(var(--neon-magenta)/0.3)]",
          "active:scale-95",
        ],
        orange: [
          "bg-gradient-to-r from-neon-orange/20 to-accent/20",
          "border-2 border-neon-orange",
          "text-neon-orange",
          "hover:bg-neon-orange/30 hover:shadow-[0_0_30px_hsl(var(--neon-orange)/0.5),0_0_60px_hsl(var(--neon-orange)/0.3)]",
          "active:scale-95",
        ],
        solid: [
          "bg-gradient-to-r from-neon-cyan to-neon-blue",
          "border-2 border-neon-cyan",
          "text-background",
          "hover:shadow-[0_0_40px_hsl(var(--neon-cyan)/0.6),0_0_80px_hsl(var(--neon-cyan)/0.4)]",
          "active:scale-95",
        ],
        ghost: [
          "bg-transparent",
          "border border-border",
          "text-muted-foreground",
          "hover:border-neon-cyan hover:text-neon-cyan",
        ],
      },
      size: {
        sm: "h-9 px-4 text-xs rounded-lg",
        default: "h-12 px-6 text-sm rounded-xl",
        lg: "h-14 px-8 text-base rounded-xl",
        xl: "h-16 px-10 text-lg rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "cyan",
      size: "default",
    },
  }
);

export interface NeonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neonButtonVariants> {
  loading?: boolean;
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant, size, loading, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(neonButtonVariants({ variant, size, className }))}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading || props.disabled}
        {...(props as any)}
      >
        {/* Animated shine effect */}
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine" />
        
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);
NeonButton.displayName = "NeonButton";

export { NeonButton, neonButtonVariants };
