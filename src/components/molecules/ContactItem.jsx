import React from "react";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";

const ContactItem = ({ contact, onClick, showLastTransaction = true, className }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick && onClick(contact)}
      className={cn(
        "flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar
          size="md"
          fallback={contact.name?.charAt(0)?.toUpperCase() || "?"}
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {contact.name}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {contact.phone || contact.upiId}
          </p>
          {showLastTransaction && contact.lastTransactionAmount && (
            <p className="text-xs text-gray-400 truncate mt-1">
              Last: {formatCurrency(contact.lastTransactionAmount)}
            </p>
          )}
        </div>
      </div>
      
      {contact.transactionCount && (
        <div className="text-right">
          <p className="text-xs text-gray-400">
            {contact.transactionCount} transaction{contact.transactionCount !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ContactItem;