import React, { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";

const BalanceCard = ({ balance = 0, lastUpdated, onRefresh, className }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Card 
      variant="gradient" 
      className={cn("relative overflow-hidden", className)}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
      </div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80 text-sm font-medium">Total Balance</span>
          <div className="flex items-center gap-2">
            <Button
              variant="text"
              size="icon"
              onClick={toggleVisibility}
              className="text-white hover:bg-white/10"
            >
              <ApperIcon name={isVisible ? "Eye" : "EyeOff"} size={20} />
            </Button>
            <Button
              variant="text"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-white hover:bg-white/10"
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
              >
                <ApperIcon name="RefreshCw" size={20} />
              </motion.div>
            </Button>
          </div>
        </div>
        
        <div className="mb-3">
          {isVisible ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-white"
            >
              {formatCurrency(balance)}
            </motion.div>
          ) : (
            <div className="text-3xl font-bold text-white">₹••••••</div>
          )}
        </div>
        
        {lastUpdated && (
          <p className="text-white/60 text-xs">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
        )}
      </div>
    </Card>
  );
};

export default BalanceCard;