import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassPanelProps {
  className?: string;
  variant?: "cyan" | "magenta" | "purple" | "neutral";
  glow?: boolean;
  hover3D?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = "cyan", glow = false, hover3D = false, children, style, ...props }, ref) => {
    const variantStyles = {
      cyan: "border-neon-cyan/30 shadow-[0_0_30px_hsl(var(--neon-cyan)/0.1)]",
      magenta: "border-neon-magenta/30 shadow-[0_0_30px_hsl(var(--neon-magenta)/0.1)]",
      purple: "border-neon-purple/30 shadow-[0_0_30px_hsl(var(--neon-purple)/0.1)]",
      neutral: "border-border shadow-xl",
    };

    const glowStyles = {
      cyan: "animate-glow-pulse",
      magenta: "animate-[glow-pulse_2s_ease-in-out_infinite]",
      purple: "animate-[glow-pulse_2s_ease-in-out_infinite]",
      neutral: "",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative backdrop-blur-xl border-2 rounded-2xl overflow-hidden",
          "bg-gradient-to-br from-card/80 via-card/60 to-card/40",
          variantStyles[variant],
          glow && glowStyles[variant],
          className
        )}
        whileHover={hover3D ? { 
          rotateX: 2, 
          rotateY: -2, 
          translateZ: 20,
          transition: { duration: 0.3 }
        } : undefined}
        style={{ 
          ...(hover3D ? { transformStyle: "preserve-3d" as const, perspective: 1000 } : {}),
          ...style 
        }}
        {...props}
      >
        {/* Top gradient line */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-[2px]",
          variant === "cyan" && "bg-gradient-to-r from-transparent via-neon-cyan to-transparent",
          variant === "magenta" && "bg-gradient-to-r from-transparent via-neon-magenta to-transparent",
          variant === "purple" && "bg-gradient-to-r from-transparent via-neon-purple to-transparent",
          variant === "neutral" && "bg-gradient-to-r from-transparent via-border to-transparent"
        )} />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Corner accents */}
        <div className={cn(
          "absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg",
          variant === "cyan" && "border-neon-cyan/50",
          variant === "magenta" && "border-neon-magenta/50",
          variant === "purple" && "border-neon-purple/50",
          variant === "neutral" && "border-border"
        )} />
        <div className={cn(
          "absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg",
          variant === "cyan" && "border-neon-cyan/50",
          variant === "magenta" && "border-neon-magenta/50",
          variant === "purple" && "border-neon-purple/50",
          variant === "neutral" && "border-border"
        )} />
        <div className={cn(
          "absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg",
          variant === "cyan" && "border-neon-cyan/50",
          variant === "magenta" && "border-neon-magenta/50",
          variant === "purple" && "border-neon-purple/50",
          variant === "neutral" && "border-border"
        )} />
        <div className={cn(
          "absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br-lg",
          variant === "cyan" && "border-neon-cyan/50",
          variant === "magenta" && "border-neon-magenta/50",
          variant === "purple" && "border-neon-purple/50",
          variant === "neutral" && "border-border"
        )} />
      </motion.div>
    );
  }
);
GlassPanel.displayName = "GlassPanel";

export { GlassPanel };
