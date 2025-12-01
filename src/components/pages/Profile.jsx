import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import { userAccountService } from "@/services/api/userAccountService";
import { formatCurrency } from "@/utils/formatCurrency";

const Profile = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [newLimit, setNewLimit] = useState("");

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

  useEffect(() => {
    loadAccount();
  }, []);

  const handleUpdateLimit = async () => {
    try {
      const limitAmount = parseFloat(newLimit);
      if (!limitAmount || limitAmount < 1000 || limitAmount > 100000) {
        toast.error("Daily limit must be between ₹1,000 and ₹1,00,000");
        return;
      }

      const updatedAccount = await userAccountService.updateDailyLimit(limitAmount);
      setAccount(updatedAccount);
      setShowLimitModal(false);
      setNewLimit("");
      toast.success("Daily limit updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update limit");
    }
  };

  const profileMenuItems = [
    {
      icon: "CreditCard",
      title: "Linked Banks",
      description: "Manage your bank accounts",
      action: () => toast.info("Bank management coming soon!")
    },
    {
      icon: "Shield",
      title: "Security",
      description: "PIN, biometric, and security settings",
      action: () => toast.info("Security settings coming soon!")
    },
    {
      icon: "Bell",
      title: "Notifications",
      description: "Manage notification preferences",
      action: () => toast.info("Notification settings coming soon!")
    },
    {
      icon: "HelpCircle",
      title: "Help & Support",
      description: "Get help and contact support",
      action: () => toast.info("Help center coming soon!")
    },
    {
      icon: "FileText",
      title: "Terms & Privacy",
      description: "Read our terms and privacy policy",
      action: () => toast.info("Legal documents coming soon!")
    }
  ];

  if (loading) {
    return <Loading message="Loading your profile..." />;
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
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account and settings</p>
        </motion.div>

        {/* User Info Card */}
        <motion.div variants={itemVariants}>
          <Card variant="gradient" className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="User" size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">PayCone User</h2>
            <p className="text-white/80 text-sm mb-4">{account?.upiId}</p>
            <div className="flex items-center justify-center gap-2">
              <Badge className="bg-white/20 text-white">Verified</Badge>
            </div>
          </Card>
        </motion.div>

        {/* Account Stats */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-primary">
                  {account ? formatCurrency(account.balance) : "₹0"}
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Daily Limit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {account ? formatCurrency(account.dailyLimit) : "₹0"}
                </p>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Daily Spending */}
        {account && (
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Daily Spending
                </span>
                <Button
                  variant="text"
                  size="sm"
                  onClick={() => setShowLimitModal(true)}
                  className="text-primary hover:bg-primary/10"
                >
                  Change Limit
                </Button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <motion.div
                  className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(limitProgress, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹{account.spentToday?.toLocaleString()} spent</span>
                <span>₹{remainingLimit.toLocaleString()} remaining</span>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Linked Banks */}
        {account?.linkedBanks && (
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Linked Bank Accounts
              </h3>
              <div className="space-y-3">
                {account.linkedBanks.map((bank, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <ApperIcon name="Building" size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{bank.bankName}</p>
                        <p className="text-sm text-gray-600">{bank.accountNumber}</p>
                      </div>
                    </div>
                    {bank.isPrimary && (
                      <Badge variant="primary">Primary</Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Menu Items */}
        <motion.div variants={itemVariants}>
          <div className="space-y-3">
            {profileMenuItems.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200"
                  onClick={item.action}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <ApperIcon name={item.icon} size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <ApperIcon name="ChevronRight" size={20} className="text-gray-400" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div variants={itemVariants}>
          <Card className="text-center">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">PayCone</h3>
              <p className="text-sm text-gray-600">Version 1.0.0</p>
              <p className="text-xs text-gray-500">
                © 2024 PayCone. All rights reserved.
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Limit Update Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Update Daily Limit
            </h3>
            <div className="space-y-4">
              <Input
                label="New Daily Limit"
                type="number"
                placeholder="Enter amount between ₹1,000 - ₹1,00,000"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                icon="CreditCard"
              />
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowLimitModal(false);
                    setNewLimit("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleUpdateLimit}
                  disabled={!newLimit}
                >
                  Update
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;