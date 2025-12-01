import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const QuickAction = ({ 
  icon, 
  label, 
  onClick, 
  variant = "default",
  className,
  ...props 
}) => {
  const variants = {
    default: "bg-white text-gray-700 shadow-md hover:shadow-lg",
    primary: "bg-gradient-to-br from-primary to-primary-light text-white shadow-lg",
    success: "bg-gradient-to-br from-success to-green-500 text-white shadow-lg",
    warning: "bg-gradient-to-br from-warning to-yellow-500 text-white shadow-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 flex items-center justify-center">
        <ApperIcon name={icon} size={24} />
      </div>
      <span className="text-sm font-medium text-center">{label}</span>
    </motion.button>
  );
};

export default QuickAction;