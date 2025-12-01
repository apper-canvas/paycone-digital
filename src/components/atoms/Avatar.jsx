import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Avatar = forwardRef(
  ({ className, src, alt, size = "md", fallback, ...props }, ref) => {
    const sizes = {
      sm: "w-8 h-8",
      md: "w-12 h-12",
      lg: "w-16 h-16",
      xl: "w-20 h-20",
    };

    const textSizes = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-lg",
      xl: "text-xl",
    };

    if (src) {
      return (
        <img
          src={src}
          alt={alt}
          className={cn(
            "rounded-full object-cover bg-gray-100",
            sizes[size],
            className
          )}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <div
        className={cn(
          "rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-medium",
          sizes[size],
          textSizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {fallback ? (
          fallback
        ) : (
          <ApperIcon 
            name="User" 
            size={size === "sm" ? 16 : size === "md" ? 20 : size === "lg" ? 24 : 28} 
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;