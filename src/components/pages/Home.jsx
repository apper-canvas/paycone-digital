import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BalanceCard from "@/components/molecules/BalanceCard";
import QuickActionsGrid from "@/components/organisms/QuickActionsGrid";
import RecentTransactions from "@/components/organisms/RecentTransactions";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { userAccountService } from "@/services/api/userAccountService";

const Home = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAccount = async () => {
    try {
      setLoading(true);
      setError("");
      const accountData = await userAccountService.getAccount();
      setAccount(accountData);
    } catch (err) {
      setError("Failed to load account information");
      console.error("Error loading account:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshBalance = async () => {
    try {
      setError("");
      const refreshedAccount = await userAccountService.refreshBalance();
      setAccount(refreshedAccount);
    } catch (err) {
      setError("Failed to refresh balance");
      console.error("Error refreshing balance:", err);
    }
  };

  useEffect(() => {
    loadAccount();
  }, []);

  if (loading) {
    return <Loading message="Loading your account..." />;
  }

  if (error && !account) {
    return <ErrorView message={error} onRetry={loadAccount} />;
  }

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

  const remainingLimit = account ? account.dailyLimit - account.spentToday : 0;
  const limitProgress = account ? (account.spentToday / account.dailyLimit) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-6 space-y-6"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to PayCone
          </h1>
          <p className="text-gray-600">
            Manage your payments quickly and securely
          </p>
        </motion.div>

        {/* Balance Card */}
        <motion.div variants={itemVariants}>
          <BalanceCard
            balance={account?.balance}
            lastUpdated={account?.lastUpdated}
            onRefresh={handleRefreshBalance}
          />
        </motion.div>

        {/* Daily Spending Progress */}
        {account && (
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Daily Spending
                </span>
                <span className="text-sm text-gray-500">
                  ₹{account.spentToday?.toLocaleString()} / ₹{account.dailyLimit?.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(limitProgress, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ₹{remainingLimit.toLocaleString()} remaining today
              </p>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 px-2">
              Quick Actions
            </h2>
            <QuickActionsGrid />
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={itemVariants}>
          <RecentTransactions limit={5} />
        </motion.div>

        {/* Payment Tips */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-br from-primary/5 to-primary-light/5 rounded-2xl p-6 border border-primary/10">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              💡 Payment Tip
            </h3>
            <p className="text-gray-600 text-sm">
              Use UPI ID for faster payments. It's more secure than sharing phone numbers and works instantly 24/7.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;