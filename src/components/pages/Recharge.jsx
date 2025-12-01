import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { userAccountService } from "@/services/api/userAccountService";
import { formatCurrency } from "@/utils/formatCurrency";

const Recharge = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("details"); // details, plans, confirm
  const [phoneNumber, setPhoneNumber] = useState("");
  const [operator, setOperator] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);

  const operators = [
    { id: "airtel", name: "Airtel", icon: "Smartphone" },
    { id: "jio", name: "Jio", icon: "Smartphone" },
    { id: "vi", name: "Vodafone Idea", icon: "Smartphone" },
    { id: "bsnl", name: "BSNL", icon: "Smartphone" }
  ];

  const rechargePlans = [
    {
      id: 1,
      amount: 199,
      validity: "28 days",
      benefits: "Unlimited calls, 1GB/day, 100 SMS",
      type: "Popular"
    },
    {
      id: 2,
      amount: 399,
      validity: "56 days",
      benefits: "Unlimited calls, 2GB/day, 100 SMS/day",
      type: "Best Value"
    },
    {
      id: 3,
      amount: 599,
      validity: "84 days",
      benefits: "Unlimited calls, 2GB/day, 100 SMS/day",
      type: "Long Term"
    },
    {
      id: 4,
      amount: 999,
      validity: "365 days",
      benefits: "Unlimited calls, 24GB, 3600 SMS",
      type: "Annual"
    },
    {
      id: 5,
      amount: 149,
      validity: "28 days",
      benefits: "Unlimited calls, 1GB total, 300 SMS",
      type: "Basic"
    },
    {
      id: 6,
      amount: 799,
      validity: "84 days",
      benefits: "Unlimited calls, 3GB/day, 100 SMS/day",
      type: "Premium"
    }
  ];

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber && operator) {
      setStep("plans");
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setStep("confirm");
  };

  const handleRecharge = async () => {
    try {
      setProcessing(true);
      
      if (!selectedPlan) {
        toast.error("Please select a plan");
        return;
      }

      const validation = await userAccountService.validateTransaction(selectedPlan.amount);
      
      if (!validation.isValid) {
        toast.error(validation.errors[0]);
        return;
      }

      // Create transaction
      const transactionData = {
        type: "recharge",
        amount: selectedPlan.amount,
        recipient: `${operator} Mobile`,
        recipientId: phoneNumber,
        note: `Mobile recharge - ${selectedPlan.validity}`,
        category: "mobile"
      };

      await transactionService.create(transactionData);
      await userAccountService.updateBalance(selectedPlan.amount, "debit");

      toast.success(`Recharge of ${formatCurrency(selectedPlan.amount)} successful`);
      navigate("/", { replace: true });
      
    } catch (err) {
      toast.error(err.message || "Failed to process recharge");
      console.error("Error processing recharge:", err);
    } finally {
      setProcessing(false);
    }
  };

  const renderDetailsStep = () => (
    <motion.div
      key="details"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Mobile Number Input */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Enter Mobile Details
        </h3>
        <form onSubmit={handleDetailsSubmit} className="space-y-4">
          <Input
            label="Mobile Number"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            icon="Phone"
            maxLength={10}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Operator
            </label>
            <div className="grid grid-cols-2 gap-3">
              {operators.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setOperator(op.name)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    operator === op.name
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ApperIcon name={op.icon} size={20} />
                    <span className="text-sm font-medium">{op.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!phoneNumber || phoneNumber.length !== 10 || !operator}
          >
            View Plans
          </Button>
        </form>
      </div>
    </motion.div>
  );

  const renderPlansStep = () => (
    <motion.div
      key="plans"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      {/* Selected Number Info */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
            <ApperIcon name="Smartphone" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{phoneNumber}</h3>
            <p className="text-sm text-gray-600">{operator}</p>
          </div>
        </div>
      </div>

      {/* Recharge Plans */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Select Plan</h3>
        {rechargePlans.map((plan) => (
          <Card
            key={plan.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-primary/20"
            onClick={() => handlePlanSelect(plan)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-primary">
                    ₹{plan.amount}
                  </span>
                  <Badge variant="primary" className="text-xs">
                    {plan.type}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Validity: {plan.validity}
                </p>
                <p className="text-sm text-gray-600">
                  {plan.benefits}
                </p>
              </div>
              <ApperIcon name="ChevronRight" size={20} className="text-gray-400" />
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );

  const renderConfirmStep = () => (
    <motion.div
      key="confirm"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      {/* Recharge Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          Confirm Recharge
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Mobile Number</span>
            <span className="font-medium text-gray-900">{phoneNumber}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Operator</span>
            <span className="font-medium text-gray-900">{operator}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Plan</span>
            <div className="text-right">
              <p className="font-medium text-gray-900">{selectedPlan?.validity}</p>
              <p className="text-sm text-gray-600">{selectedPlan?.benefits}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Amount</span>
            <span className="text-2xl font-bold text-primary">
              {selectedPlan && formatCurrency(selectedPlan.amount)}
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
          onClick={handleRecharge}
          disabled={processing}
          icon={processing ? "Loader" : "Smartphone"}
        >
          {processing ? "Processing..." : "Confirm Recharge"}
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setStep("plans")}
          disabled={processing}
        >
          Change Plan
        </Button>
      </div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case "details":
        return renderDetailsStep();
      case "plans":
        return renderPlansStep();
      case "confirm":
        return renderConfirmStep();
      default:
        return renderDetailsStep();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => {
              if (step === "details") {
                navigate("/payments");
              } else if (step === "plans") {
                setStep("details");
              } else {
                setStep("plans");
              }
            }}
            className="p-2 rounded-xl hover:bg-white/50 transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mobile Recharge</h1>
            <p className="text-gray-600 capitalize">
              Step {step === "details" ? 1 : step === "plans" ? 2 : 3} of 3
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-300"
              style={{
                width: step === "details" ? "33%" : step === "plans" ? "66%" : "100%"
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

export default Recharge;