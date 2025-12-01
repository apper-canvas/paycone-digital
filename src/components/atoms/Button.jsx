import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(
  ({ className, variant = "primary", size = "md", children, icon, iconPosition = "left", disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg hover:shadow-xl hover:from-primary-dark hover:to-primary transition-all duration-200",
      secondary: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white transition-all duration-200",
      text: "text-primary hover:text-primary-dark bg-transparent transition-colors duration-200",
      success: "bg-gradient-to-r from-success to-green-500 text-white shadow-lg hover:shadow-xl transition-all duration-200",
      danger: "bg-gradient-to-r from-error to-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-200",
    };

    const sizes = {
      sm: "px-3 py-2 text-sm rounded-lg",
      md: "px-6 py-3 text-base rounded-xl",
      lg: "px-8 py-4 text-lg rounded-xl",
      icon: "p-3 rounded-xl",
    };

    return (
      <button
        className={cn(
          "font-medium inline-flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <ApperIcon name={icon} size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />
        )}
        {children}
        {icon && iconPosition === "right" && (
          <ApperIcon name={icon} size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;