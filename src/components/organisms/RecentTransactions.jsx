import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TransactionItem from "@/components/molecules/TransactionItem";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { transactionService } from "@/services/api/transactionService";

const RecentTransactions = ({ limit = 5 }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await transactionService.getAll();
      const recent = data.slice(0, limit);
      setTransactions(recent);
    } catch (err) {
      setError("Failed to load transactions");
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [limit]);

  const handleTransactionClick = (transaction) => {
    navigate("/history", { state: { selectedTransaction: transaction } });
  };

  const handleViewAll = () => {
    navigate("/history");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadTransactions} />;
  }

  if (transactions.length === 0) {
    return (
      <Empty
        title="No Transactions Yet"
        description="Your recent transactions will appear here"
        actionLabel="Start a Payment"
        onAction={() => navigate("/payments")}
      />
    );
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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        <Button
          variant="text"
          size="sm"
          onClick={handleViewAll}
          className="text-primary"
        >
          View All
        </Button>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {transactions.map((transaction) => (
          <motion.div key={transaction.Id} variants={itemVariants}>
            <TransactionItem
              transaction={transaction}
              onClick={handleTransactionClick}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RecentTransactions;