import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  message = "Something went wrong", 
  onRetry, 
  title = "Oops!",
  description = "Please try again or contact support if the problem persists."
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" size={32} className="text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-2">{message}</p>
      <p className="text-sm text-gray-500 mb-6">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" icon="RefreshCw">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorView;