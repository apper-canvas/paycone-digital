import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QuickAction from "@/components/molecules/QuickAction";
import ApperIcon from "@/components/ApperIcon";

const Payments = () => {
  const navigate = useNavigate();

  const paymentOptions = [
    {
      icon: "Send",
      label: "Send Money",
      description: "Transfer money to contacts or UPI ID",
      onClick: () => navigate("/payments/send"),
      variant: "primary",
    },
    {
      icon: "QrCode",
      label: "Scan & Pay",
      description: "Scan QR code to pay merchants",
      onClick: () => navigate("/payments/scan"),
      variant: "default",
    },
    {
      icon: "Receipt",
      label: "Pay Bills",
      description: "Electricity, water, gas, and more",
      onClick: () => navigate("/payments/bills"),
      variant: "default",
    },
    {
      icon: "Smartphone",
      label: "Mobile Recharge",
      description: "Prepaid and postpaid recharge",
      onClick: () => navigate("/payments/recharge"),
      variant: "default",
    },
    {
      icon: "CreditCard",
      label: "Request Money",
      description: "Send payment request to contacts",
      onClick: () => {},
      variant: "default",
    },
    {
      icon: "Building",
      label: "Bank Transfer",
      description: "NEFT, RTGS, and IMPS transfers",
      onClick: () => {},
      variant: "default",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-xl hover:bg-white/50 transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={24} className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          </div>
          <p className="text-gray-600 ml-14">
            Choose how you want to pay
          </p>
        </motion.div>

        {/* Payment Options Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4"
        >
          {paymentOptions.map((option, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div
                onClick={option.onClick}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 hover:border-primary/20"
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center
                    ${option.variant === "primary" 
                      ? "bg-gradient-to-br from-primary to-primary-light text-white" 
                      : "bg-gray-100 text-gray-600"
                    }
                  `}>
                    <ApperIcon name={option.icon} size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {option.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                  <ApperIcon name="ChevronRight" size={20} className="text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Recipients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Recipients
          </h2>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Users" size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500">
                Your recent recipients will appear here
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <ApperIcon name="Shield" size={16} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Stay Safe</h4>
                <p className="text-sm text-blue-700">
                  Always verify recipient details before sending money. PayCone will never ask for your PIN or password.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Payments;