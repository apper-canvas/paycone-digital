import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { billPaymentService } from "@/services/api/billPaymentService";
import { transactionService } from "@/services/api/transactionService";
import { userAccountService } from "@/services/api/userAccountService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Payments from "@/components/pages/Payments";
import AmountKeypad from "@/components/molecules/AmountKeypad";
import BillCategory from "@/components/molecules/BillCategory";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";

const BillPayments = () => {
  const navigate = useNavigate();
const [pendingBills, setPendingBills] = useState([]);
  const [billsWithReminders, setBillsWithReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [step, setStep] = useState("category"); // category, details, amount, confirm
  const [selectedCategory, setSelectedCategory] = useState("");
  const [provider, setProvider] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const billCategories = [
    {
      id: "electricity",
      icon: "Zap",
      label: "Electricity",
      description: "Pay electricity bills"
    },
    {
      id: "water",
      icon: "Droplets",
      label: "Water",
      description: "Pay water bills"
    },
    {
      id: "gas",
      icon: "Flame",
      label: "Gas",
      description: "Pay gas bills"
    },
    {
      id: "internet",
      icon: "Wifi",
      label: "Internet",
      description: "Broadband and internet bills"
    },
    {
      id: "mobile",
      icon: "Smartphone",
      label: "Mobile",
      description: "Mobile phone bills"
    }
  ];

const loadPendingBills = async () => {
    try {
      setLoading(true);
      setError("");
      const [bills, billsWithReminder] = await Promise.all([
        billPaymentService.getPendingBills(),
        billPaymentService.getBillsWithReminders()
      ]);
      setPendingBills(bills.slice(0, 3));
      setBillsWithReminders(billsWithReminder.slice(0, 5));
    } catch (err) {
      setError("Failed to load pending bills");
      console.error("Error loading bills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingBills();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setStep("details");
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (provider && accountNumber) {
      setStep("amount");
    }
  };

  const handleAmountKeyPress = (key) => {
    if (key === "." && amount.includes(".")) return;
    if (amount.split(".")[1]?.length >= 2) return;
    
    const newAmount = amount + key;
    const numValue = parseFloat(newAmount);
    
    if (numValue <= 50000) {
      setAmount(newAmount);
    }
  };

  const handleAmountBackspace = () => {
    setAmount(amount.slice(0, -1));
  };

  const handleAmountClear = () => {
    setAmount("");
  };

  const handleAmountConfirm = () => {
    const numAmount = parseFloat(amount);
    if (numAmount >= 1) {
      setStep("confirm");
    } else {
      toast.error("Minimum amount is ₹1");
    }
  };

  const handlePayBill = async () => {
    try {
      setProcessing(true);
      
      const numAmount = parseFloat(amount);
      const validation = await userAccountService.validateTransaction(numAmount);
      
      if (!validation.isValid) {
        toast.error(validation.errors[0]);
        return;
      }

      // Create transaction
      const transactionData = {
        type: "bill",
        amount: numAmount,
        recipient: provider,
        recipientId: accountNumber,
        note: `${selectedCategory} bill payment`,
        category: selectedCategory
      };

      await transactionService.create(transactionData);
      await userAccountService.updateBalance(numAmount, "debit");

      toast.success(`Bill payment of ${formatCurrency(numAmount)} successful`);
      navigate("/", { replace: true });
      
    } catch (err) {
      toast.error(err.message || "Failed to pay bill");
      console.error("Error paying bill:", err);
    } finally {
      setProcessing(false);
    }
  };

  const renderCategoryStep = () => (
    <motion.div
      key="category"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Pending Bills */}
{billsWithReminders.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Payment Reminders
            </h3>
            <button
              onClick={() => navigate('/payment-reminders')}
              className="text-sm text-primary font-medium hover:text-primary-dark transition-colors"
            >
>
              View All
            </button>
          </div>
          <div className="space-y-3">
{billsWithReminders.map((bill) => {
              const getUrgencyColors = (urgency) => {
                  case 'critical':
                    return 'bg-red-50 border-red-200 text-red-700';
                  case 'high':
                    return 'bg-orange-50 border-orange-200 text-orange-700';
                  case 'medium':
                    return 'bg-yellow-50 border-yellow-200 text-yellow-700';
                  default:
                    return 'bg-blue-50 border-blue-200 text-blue-700';
                }
              };

              const getStatusBadge = (bill) => {
                if (bill.isOverdue) {
                  return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Overdue</span>;
                }
                if (bill.isDueToday) {
                  return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Due Today</span>;
                }
                if (bill.isDueSoon) {
                  return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Due Soon</span>;
                }
                return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Upcoming</span>;
              };

              return (
                <div
                  key={bill.Id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border transition-colors",
                    getUrgencyColors(bill.urgency)
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{bill.provider}</p>
                      {getStatusBadge(bill)}
                    </div>
                    <p className="text-sm text-gray-600">{bill.category}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-xs text-gray-500">
                        Due: {new Date(bill.dueDate).toLocaleDateString()}
                      </p>
                      {bill.daysUntilDue < 0 ? (
                        <p className="text-xs text-red-600 font-medium">
                          {Math.abs(bill.daysUntilDue)} days overdue
                        </p>
                      ) : bill.daysUntilDue === 0 ? (
                        <p className="text-xs text-orange-600 font-medium">
                          Due today
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">
                          {bill.daysUntilDue} days left
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(bill.amount)}
                    </p>
                    {bill.urgency === 'critical' && (
                      <div className="w-16 bg-red-200 rounded-full h-2 mt-1">
                        <div className="bg-red-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bill Categories */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Bill Category
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {billCategories.map((category) => (
            <BillCategory
              key={category.id}
              icon={category.icon}
              label={category.label}
              description={category.description}
              onClick={() => handleCategorySelect(category.id)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderDetailsStep = () => {
    const category = billCategories.find(c => c.id === selectedCategory);
    
    return (
      <motion.div
        key="details"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-6"
      >
        {/* Selected Category */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <ApperIcon name={category?.icon} size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{category?.label} Bill</h3>
              <p className="text-sm text-gray-600">{category?.description}</p>
            </div>
          </div>
        </div>

        {/* Bill Details Form */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Enter Bill Details
          </h3>
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <Input
              label="Service Provider"
              placeholder="Enter provider name"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              icon="Building"
            />
            <Input
              label="Account Number"
              placeholder="Enter account/customer number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              icon="Hash"
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!provider || !accountNumber}
            >
              Continue
            </Button>
          </form>
        </div>
      </motion.div>
    );
  };

  const renderAmountStep = () => (
    <motion.div
      key="amount"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      {/* Bill Info */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
            <ApperIcon name="Receipt" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{provider}</h3>
            <p className="text-sm text-gray-600">{accountNumber}</p>
          </div>
        </div>
      </div>

      {/* Amount Display */}
      <div className="bg-white rounded-2xl p-6 shadow-md text-center">
        <p className="text-gray-600 mb-2">Enter Amount</p>
        <p className="text-4xl font-bold text-gray-900 mb-4">
          {amount ? formatCurrency(parseFloat(amount)) : "₹0"}
        </p>
      </div>

      {/* Amount Keypad */}
      <AmountKeypad
        onKeyPress={handleAmountKeyPress}
        onBackspace={handleAmountBackspace}
        onClear={handleAmountClear}
      />

      {/* Continue Button */}
      <Button
        className="w-full"
        onClick={handleAmountConfirm}
        disabled={!amount || parseFloat(amount) < 1}
      >
        Continue
      </Button>
    </motion.div>
  );

  const renderConfirmStep = () => {
    const category = billCategories.find(c => c.id === selectedCategory);
    
    return (
      <motion.div
        key="confirm"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-6"
      >
        {/* Payment Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
            Confirm Payment
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Bill Type</span>
              <span className="font-medium text-gray-900 capitalize">
                {selectedCategory}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Provider</span>
              <span className="font-medium text-gray-900">{provider}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Account Number</span>
              <span className="font-medium text-gray-900">{accountNumber}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Amount</span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(parseFloat(amount))}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Processing Fee</span>
              <span className="font-medium text-gray-900">Free</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={handlePayBill}
            disabled={processing}
            icon={processing ? "Loader" : "CreditCard"}
          >
            {processing ? "Processing..." : "Pay Bill"}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setStep("amount")}
            disabled={processing}
          >
            Back
          </Button>
        </div>
      </motion.div>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case "category":
        return renderCategoryStep();
      case "details":
        return renderDetailsStep();
      case "amount":
        return renderAmountStep();
      case "confirm":
        return renderConfirmStep();
      default:
        return renderCategoryStep();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => {
              if (step === "category") {
                navigate("/payments");
              } else if (step === "details") {
                setStep("category");
              } else if (step === "amount") {
                setStep("details");
              } else {
                setStep("amount");
              }
            }}
            className="p-2 rounded-xl hover:bg-white/50 transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bill Payments</h1>
            <p className="text-gray-600 capitalize">
              Step {step === "category" ? 1 : step === "details" ? 2 : step === "amount" ? 3 : 4} of 4
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-300"
              style={{
                width: step === "category" ? "25%" : step === "details" ? "50%" : step === "amount" ? "75%" : "100%"
              }}
            />
          </div>
        </div>

        {/* Step Content */}
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default BillPayments;