import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const BillCategory = ({ 
  icon, 
  label, 
  description,
  onClick, 
  variant = "default",
  className,
  ...props 
}) => {
  const variants = {
    default: "bg-white hover:bg-gray-50 border border-gray-200",
    primary: "bg-gradient-to-br from-primary/10 to-primary-light/10 border border-primary/20 hover:border-primary/30",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl">
        <ApperIcon name={icon} size={24} className="text-primary" />
      </div>
      <div className="text-center">
        <h3 className="font-medium text-gray-900">{label}</h3>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </motion.button>
  );
};

export default BillCategory;