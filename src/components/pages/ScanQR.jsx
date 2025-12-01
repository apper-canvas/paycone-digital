import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ScanQR = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    
    // Simulate QR code scan with timeout
    setTimeout(() => {
      setIsScanning(false);
      
      // Simulate successful scan
      const mockQRData = {
        merchantName: "Coffee Shop",
        amount: 250.00,
        merchantId: "merchant@upi"
      };
      
      toast.success("QR Code scanned successfully!");
      
      // Navigate to payment confirmation with QR data
      navigate("/payments/send", {
        state: {
          recipient: mockQRData.merchantName,
          recipientId: mockQRData.merchantId,
          amount: mockQRData.amount.toString(),
          fromQR: true
        }
      });
    }, 3000);
  };

  const handleUploadQR = () => {
    toast.info("QR upload feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/payments")}
            className="p-2 rounded-xl hover:bg-white/50 transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scan & Pay</h1>
            <p className="text-gray-600">Scan QR code to pay merchants</p>
          </div>
        </div>

        {/* QR Scanner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-md mb-6"
        >
          <div className="aspect-square bg-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
            {isScanning ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Scanning Animation */}
                <motion.div
                  className="absolute inset-4 border-2 border-primary rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="absolute left-6 right-6 h-0.5 bg-primary"
                  animate={{ y: [-150, 150] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Corner Brackets */}
                <div className="absolute top-6 left-6 w-8 h-8">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                </div>
                <div className="absolute top-6 right-6 w-8 h-8">
                  <div className="absolute top-0 right-0 w-full h-1 bg-primary" />
                  <div className="absolute top-0 right-0 w-1 h-full bg-primary" />
                </div>
                <div className="absolute bottom-6 left-6 w-8 h-8">
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-primary" />
                  <div className="absolute bottom-0 left-0 w-1 h-full bg-primary" />
                </div>
                <div className="absolute bottom-6 right-6 w-8 h-8">
                  <div className="absolute bottom-0 right-0 w-full h-1 bg-primary" />
                  <div className="absolute bottom-0 right-0 w-1 h-full bg-primary" />
                </div>
                
                <div className="text-center text-white">
                  <ApperIcon name="QrCode" size={48} className="mx-auto mb-3" />
                  <p className="text-lg font-medium">Scanning...</p>
                  <p className="text-sm text-gray-300">Position QR code within the frame</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-white">
                <ApperIcon name="QrCode" size={64} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Ready to scan</p>
                <p className="text-sm text-gray-400">Tap to start scanning QR code</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            className="w-full"
            onClick={handleStartScan}
            disabled={isScanning}
            icon={isScanning ? "Loader" : "Camera"}
            size="lg"
          >
            {isScanning ? "Scanning..." : "Start Scanning"}
          </Button>
          
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleUploadQR}
            icon="Upload"
            size="lg"
          >
            Upload QR Image
          </Button>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <ApperIcon name="Info" size={20} />
            How to use QR Scanner
          </h3>
          <div className="space-y-2 text-blue-700">
            <p className="text-sm flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0 mt-0.5">1</span>
              Position the QR code within the scanning frame
            </p>
            <p className="text-sm flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0 mt-0.5">2</span>
              Hold your phone steady until the code is detected
            </p>
            <p className="text-sm flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0 mt-0.5">3</span>
              Review payment details before confirming
            </p>
          </div>
        </motion.div>

        {/* Recent QR Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-white rounded-2xl p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent QR Payments</h3>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="QrCode" size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">
              Your QR payment history will appear here
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScanQR;