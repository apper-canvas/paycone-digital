import React from "react";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatTransactionDate } from "@/utils/dateUtils";
import { cn } from "@/utils/cn";

const TransactionItem = ({ transaction, onClick, className }) => {
  const getStatusBadge = (status) => {
    const statusMap = {
      completed: { variant: "success", label: "Completed" },
      pending: { variant: "warning", label: "Pending" },
      failed: { variant: "error", label: "Failed" },
    };
    return statusMap[status] || statusMap.completed;
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "send":
        return "ArrowUpRight";
      case "receive":
        return "ArrowDownLeft";
      case "bill":
        return "Receipt";
      case "recharge":
        return "Smartphone";
      default:
        return "ArrowUpRight";
    }
  };

  const getAmountColor = (type, status) => {
    if (status === "failed") return "text-gray-400";
    return type === "receive" ? "text-success" : "text-gray-900";
  };

  const getAmountPrefix = (type) => {
    return type === "receive" ? "+" : "-";
  };

  const statusBadge = getStatusBadge(transaction.status);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick && onClick(transaction)}
      className={cn(
        "flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar
          size="md"
          fallback={transaction.recipient?.charAt(0)?.toUpperCase() || "?"}
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {transaction.recipient || "Unknown"}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {formatTransactionDate(transaction.date)}
          </p>
          {transaction.note && (
            <p className="text-xs text-gray-400 truncate mt-1">
              {transaction.note}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <p className={cn(
          "font-semibold text-sm",
          getAmountColor(transaction.type, transaction.status)
        )}>
          {getAmountPrefix(transaction.type)}{formatCurrency(Math.abs(transaction.amount)).replace("₹", "₹")}
        </p>
        <Badge variant={statusBadge.variant} className="text-xs">
          {statusBadge.label}
        </Badge>
      </div>
    </motion.div>
  );
};

export default TransactionItem;