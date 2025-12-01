import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="AlertTriangle" size={48} className="text-white" />
          </div>
          <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
          <p className="text-gray-600 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <Button
            onClick={() => navigate("/")}
            className="w-full"
            icon="Home"
          >
            Go to Home
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            className="w-full"
            icon="ArrowLeft"
          >
            Go Back
          </Button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500 mb-4">Quick Links</p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => navigate("/payments")}
              className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              <ApperIcon name="Send" size={16} />
              <span className="text-sm">Payments</span>
            </button>
            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              <ApperIcon name="History" size={16} />
              <span className="text-sm">History</span>
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              <ApperIcon name="User" size={16} />
              <span className="text-sm">Profile</span>
            </button>
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100"
        >
          <div className="flex items-start gap-3">
            <ApperIcon name="Info" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm text-blue-800 font-medium">Need help?</p>
              <p className="text-xs text-blue-600 mt-1">
                If you think this is an error, please contact our support team.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;