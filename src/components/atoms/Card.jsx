import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(
  ({ className, children, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-white shadow-md",
      glass: "bg-white/25 backdrop-blur-lg border border-white/20",
      gradient: "bg-gradient-to-br from-primary to-primary-light text-white",
      elevated: "bg-white shadow-xl",
    };

    return (
      <div
        className={cn(
          "rounded-2xl p-6 transition-all duration-200",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;