import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

const NeonInput = React.forwardRef<HTMLInputElement, NeonInputProps>(
  ({ className, type, label, icon, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-orbitron uppercase tracking-wider text-muted-foreground">
            {label}
          </label>
        )}
        <motion.div
          className={cn(
            "relative flex items-center rounded-xl overflow-hidden",
            "bg-input/50 backdrop-blur-sm",
            "border-2 transition-all duration-300",
            isFocused
              ? "border-neon-cyan shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]"
              : "border-border hover:border-neon-cyan/50",
            error && "border-destructive shadow-[0_0_20px_hsl(var(--destructive)/0.3)]"
          )}
          animate={{
            boxShadow: isFocused
              ? "0 0 20px hsl(var(--neon-cyan) / 0.3), 0 0 40px hsl(var(--neon-cyan) / 0.1)"
              : "none",
          }}
        >
          {icon && (
            <div className={cn(
              "pl-4 transition-colors",
              isFocused ? "text-neon-cyan" : "text-muted-foreground"
            )}>
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-12 w-full bg-transparent px-4 py-2",
              "font-rajdhani text-lg text-foreground",
              "placeholder:text-muted-foreground/60",
              "focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-2",
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {/* Animated corner accents */}
          <div className={cn(
            "absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 rounded-tl-xl transition-colors duration-300",
            isFocused ? "border-neon-cyan" : "border-transparent"
          )} />
          <div className={cn(
            "absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 rounded-tr-xl transition-colors duration-300",
            isFocused ? "border-neon-cyan" : "border-transparent"
          )} />
          <div className={cn(
            "absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 rounded-bl-xl transition-colors duration-300",
            isFocused ? "border-neon-cyan" : "border-transparent"
          )} />
          <div className={cn(
            "absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 rounded-br-xl transition-colors duration-300",
            isFocused ? "border-neon-cyan" : "border-transparent"
          )} />
        </motion.div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive font-medium"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);
NeonInput.displayName = "NeonInput";

export { NeonInput };
