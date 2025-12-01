import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ContactItem from "@/components/molecules/ContactItem";
import AmountKeypad from "@/components/molecules/AmountKeypad";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { transactionService } from "@/services/api/transactionService";
import { userAccountService } from "@/services/api/userAccountService";
import { formatCurrency } from "@/utils/formatCurrency";

const SendMoney = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [step, setStep] = useState("recipient"); // recipient, amount, confirm
  const [recipient, setRecipient] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getFrequentContacts();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts");
      console.error("Error loading contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleContactSelect = (contact) => {
    setRecipient(contact.name);
    setRecipientId(contact.upiId);
    setStep("amount");
  };

  const handleRecipientSubmit = (e) => {
    e.preventDefault();
    if (recipient && recipientId) {
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

  const handleSendMoney = async () => {
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
        type: "send",
        amount: numAmount,
        recipient,
        recipientId,
        note,
        category: "transfer"
      };

      await transactionService.create(transactionData);
      await userAccountService.updateBalance(numAmount, "debit");
      
      // Update contact stats
      const contact = await contactService.findByPhoneOrUpi(recipientId);
      if (contact) {
        await contactService.updateTransactionStats(contact.Id, numAmount);
      }

      toast.success(`₹${numAmount.toLocaleString()} sent to ${recipient}`);
      navigate("/", { replace: true });
      
    } catch (err) {
      toast.error(err.message || "Failed to send money");
      console.error("Error sending money:", err);
    } finally {
      setProcessing(false);
    }
  };

  const renderRecipientStep = () => (
    <motion.div
      key="recipient"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Manual Entry */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Enter Recipient Details
        </h3>
        <form onSubmit={handleRecipientSubmit} className="space-y-4">
          <Input
            label="Recipient Name"
            placeholder="Enter name"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            icon="User"
          />
          <Input
            label="Phone Number or UPI ID"
            placeholder="Enter phone number or UPI ID"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            icon="Phone"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={!recipient || !recipientId}
          >
            Continue
          </Button>
        </form>
      </div>

      {/* Frequent Contacts */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Frequent Contacts
        </h3>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorView message={error} onRetry={loadContacts} />
        ) : contacts.length === 0 ? (
          <Empty
            title="No Frequent Contacts"
            description="Your frequently contacted people will appear here"
            icon="Users"
          />
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <ContactItem
                key={contact.Id}
                contact={contact}
                onClick={handleContactSelect}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderAmountStep = () => (
    <motion.div
      key="amount"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      {/* Recipient Info */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {recipient.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{recipient}</h3>
            <p className="text-sm text-gray-600">{recipientId}</p>
          </div>
        </div>
      </div>

      {/* Amount Display */}
      <div className="bg-white rounded-2xl p-6 shadow-md text-center">
        <p className="text-gray-600 mb-2">Enter Amount</p>
        <p className="text-4xl font-bold text-gray-900 mb-4">
          {amount ? formatCurrency(parseFloat(amount)) : "₹0"}
        </p>
        <Input
          label="Note (Optional)"
          placeholder="Add a note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
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

  const renderConfirmStep = () => (
    <motion.div
      key="confirm"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      {/* Transaction Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          Confirm Transaction
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">To</span>
            <div className="text-right">
              <p className="font-medium text-gray-900">{recipient}</p>
              <p className="text-sm text-gray-500">{recipientId}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Amount</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(parseFloat(amount))}
            </span>
          </div>
          
          {note && (
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Note</span>
              <span className="font-medium text-gray-900">{note}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600">Transaction Fee</span>
            <span className="font-medium text-gray-900">Free</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          className="w-full"
          onClick={handleSendMoney}
          disabled={processing}
          icon={processing ? "Loader" : "Send"}
        >
          {processing ? "Sending..." : "Send Money"}
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

  const renderCurrentStep = () => {
    switch (step) {
      case "recipient":
        return renderRecipientStep();
      case "amount":
        return renderAmountStep();
      case "confirm":
        return renderConfirmStep();
      default:
        return renderRecipientStep();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => {
              if (step === "recipient") {
                navigate("/payments");
              } else if (step === "amount") {
                setStep("recipient");
              } else {
                setStep("amount");
              }
            }}
            className="p-2 rounded-xl hover:bg-white/50 transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Send Money</h1>
            <p className="text-gray-600 capitalize">
              Step {step === "recipient" ? 1 : step === "amount" ? 2 : 3} of 3
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-300"
              style={{
                width: step === "recipient" ? "33%" : step === "amount" ? "66%" : "100%"
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

export default SendMoney;