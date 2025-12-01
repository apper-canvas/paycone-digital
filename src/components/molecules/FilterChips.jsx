import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const FilterChips = ({ filters, activeFilter, onFilterChange, className }) => {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-2", className)}>
      {filters.map((filter) => (
        <motion.button
          key={filter.value}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            activeFilter === filter.value
              ? "bg-primary text-white shadow-lg"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {filter.label}
        </motion.button>
      ))}
    </div>
  );
};

export default FilterChips;