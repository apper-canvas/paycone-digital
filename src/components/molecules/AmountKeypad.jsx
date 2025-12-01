import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AmountKeypad = ({ onKeyPress, onClear, onBackspace, className }) => {
  const keypadButtons = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "⌫"],
  ];

  const handleKeyPress = (key) => {
    if (key === "⌫") {
      onBackspace && onBackspace();
    } else {
      onKeyPress && onKeyPress(key);
    }
  };

  return (
    <div className={cn("bg-white rounded-2xl p-6 shadow-lg", className)}>
      <div className="grid grid-cols-3 gap-4">
        {keypadButtons.flat().map((key, index) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="text"
              size="lg"
              onClick={() => handleKeyPress(key)}
              className={cn(
                "w-full h-16 text-xl font-semibold rounded-xl",
                key === "⌫" 
                  ? "text-error hover:bg-error/10" 
                  : "text-gray-800 hover:bg-gray-100"
              )}
            >
              {key === "⌫" ? (
                <ApperIcon name="Delete" size={24} />
              ) : (
                key
              )}
            </Button>
          </motion.div>
        ))}
      </div>
      {onClear && (
        <div className="mt-4">
          <Button
            variant="text"
            onClick={onClear}
            className="w-full text-primary hover:bg-primary/10"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};

export default AmountKeypad;