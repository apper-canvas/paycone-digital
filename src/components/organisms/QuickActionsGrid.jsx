import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QuickAction from "@/components/molecules/QuickAction";

const QuickActionsGrid = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: "Send",
      label: "Send Money",
      onClick: () => navigate("/payments/send"),
      variant: "primary",
    },
    {
      icon: "Receipt",
      label: "Pay Bills",
      onClick: () => navigate("/payments/bills"),
      variant: "default",
    },
    {
      icon: "QrCode",
      label: "Scan QR",
      onClick: () => navigate("/payments/scan"),
      variant: "default",
    },
    {
      icon: "Smartphone",
      label: "Recharge",
      onClick: () => navigate("/payments/recharge"),
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4"
    >
      {quickActions.map((action, index) => (
        <motion.div key={index} variants={itemVariants}>
          <QuickAction {...action} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default QuickActionsGrid;