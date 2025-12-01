import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import TransactionItem from "@/components/molecules/TransactionItem";
import FilterChips from "@/components/molecules/FilterChips";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { formatCurrency } from "@/utils/formatCurrency";

const History = () => {
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const filters = [
    { label: "All", value: "all" },
    { label: "Sent", value: "send" },
    { label: "Received", value: "receive" },
    { label: "Bills", value: "bill" },
    { label: "Recharge", value: "recharge" },
  ];

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await transactionService.getAll();
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (err) {
      setError("Failed to load transactions");
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
    
    // Handle navigation from other pages with selected transaction
    if (location.state?.selectedTransaction) {
      setSelectedTransaction(location.state.selectedTransaction);
    }
  }, [location.state]);

  useEffect(() => {
    let filtered = transactions;

    // Apply filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(transaction => transaction.type === activeFilter);
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(transaction => 
        transaction.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, activeFilter, searchQuery]);

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseDetails = () => {
    setSelectedTransaction(null);
  };

  const getTotalAmount = (type) => {
    return filteredTransactions
      .filter(t => t.type === type && t.status === "completed")
      .reduce((total, t) => total + t.amount, 0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Transaction Details Modal
  if (selectedTransaction) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleCloseDetails}
              className="p-2 rounded-xl hover:bg-white/50 transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={24} className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
          </div>

          {/* Transaction Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-md space-y-6"
          >
            {/* Status */}
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                selectedTransaction.status === "completed" ? "bg-success/10" :
                selectedTransaction.status === "pending" ? "bg-warning/10" : "bg-error/10"
              }`}>
                <ApperIcon 
                  name={
                    selectedTransaction.status === "completed" ? "CheckCircle" :
                    selectedTransaction.status === "pending" ? "Clock" : "XCircle"
                  } 
                  size={32} 
                  className={
                    selectedTransaction.status === "completed" ? "text-success" :
                    selectedTransaction.status === "pending" ? "text-warning" : "text-error"
                  }
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedTransaction.type === "receive" ? "+" : "-"}
                {formatCurrency(selectedTransaction.amount)}
              </h2>
              <p className={`text-lg font-medium capitalize ${
                selectedTransaction.status === "completed" ? "text-success" :
                selectedTransaction.status === "pending" ? "text-warning" : "text-error"
              }`}>
                {selectedTransaction.status}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">
                  {selectedTransaction.type === "receive" ? "From" : "To"}
                </span>
                <span className="font-medium text-gray-900">
                  {selectedTransaction.recipient}
                </span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-medium text-gray-900">
                  TXN{selectedTransaction.Id.toString().padStart(8, "0")}
                </span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-medium text-gray-900">
                  {new Date(selectedTransaction.date).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Type</span>
                <span className="font-medium text-gray-900 capitalize">
                  {selectedTransaction.type}
                </span>
              </div>

              {selectedTransaction.note && (
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Note</span>
                  <span className="font-medium text-gray-900">
                    {selectedTransaction.note}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-3">
                <span className="text-gray-600">Category</span>
                <span className="font-medium text-gray-900 capitalize">
                  {selectedTransaction.category}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Transaction History
          </h1>
          <p className="text-gray-600">
            View all your payment transactions
          </p>
        </motion.div>

        {/* Summary Cards */}
        {!loading && !error && transactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="ArrowDownLeft" size={16} className="text-success" />
                <span className="text-sm text-gray-600">Received</span>
              </div>
              <p className="text-lg font-bold text-success">
                {formatCurrency(getTotalAmount("receive"))}
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-4 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="ArrowUpRight" size={16} className="text-red-500" />
                <span className="text-sm text-gray-600">Sent</span>
              </div>
              <p className="text-lg font-bold text-red-500">
                {formatCurrency(getTotalAmount("send") + getTotalAmount("bill") + getTotalAmount("recharge"))}
              </p>
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-6"
        >
          <SearchBar
            placeholder="Search transactions..."
            onSearch={setSearchQuery}
            className="w-full"
          />
          <FilterChips
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </motion.div>

        {/* Transaction List */}
        <div className="space-y-4">
          {loading ? (
            <Loading message="Loading transactions..." />
          ) : error ? (
            <ErrorView message={error} onRetry={loadTransactions} />
          ) : filteredTransactions.length === 0 ? (
            <Empty
              title="No Transactions Found"
              description={
                searchQuery || activeFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Your transactions will appear here"
              }
              actionLabel={!searchQuery && activeFilter === "all" ? "Make a Payment" : undefined}
              onAction={() => window.location.href = "/payments"}
              icon="Receipt"
            />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {filteredTransactions.map((transaction) => (
                <motion.div key={transaction.Id} variants={itemVariants}>
                  <TransactionItem
                    transaction={transaction}
                    onClick={handleTransactionClick}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;