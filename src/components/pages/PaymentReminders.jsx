import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { billPaymentService } from '@/services/api/billPaymentService';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';

const PaymentReminders = () => {
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState('all'); // all, overdue, due-today, due-soon
  const [selectedBill, setSelectedBill] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [billsData, statsData] = await Promise.all([
        billPaymentService.getBillsWithReminders(),
        billPaymentService.getReminderStats()
      ]);
      setBills(billsData);
      setStats(statsData);
    } catch (err) {
      setError("Failed to load payment reminders");
      console.error("Error loading reminders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSnoozeReminder = async (billId, hours = 24) => {
    try {
      await billPaymentService.snoozeReminder(billId, hours);
      toast.success(`Reminder snoozed for ${hours} hours`);
      loadData();
    } catch (err) {
      toast.error("Failed to snooze reminder");
    }
  };

  const handleDismissReminder = async (billId) => {
    try {
      await billPaymentService.dismissReminder(billId);
      toast.success("Reminder dismissed");
      loadData();
    } catch (err) {
      toast.error("Failed to dismiss reminder");
    }
  };

  const handleUpdateSettings = async (billId, settings) => {
    try {
      await billPaymentService.updateReminderSettings(billId, settings);
      toast.success("Reminder settings updated");
      loadData();
      setSelectedBill(null);
      setShowSettings(false);
    } catch (err) {
      toast.error("Failed to update settings");
    }
  };

  const filteredBills = bills.filter(bill => {
    if (filter === 'all') return true;
    if (filter === 'overdue') return bill.isOverdue;
    if (filter === 'due-today') return bill.isDueToday;
    if (filter === 'due-soon') return bill.isDueSoon;
    return true;
  });

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'critical':
        return <ApperIcon name="AlertTriangle" className="text-red-500" size={20} />;
      case 'high':
        return <ApperIcon name="Clock" className="text-orange-500" size={20} />;
      case 'medium':
        return <ApperIcon name="Calendar" className="text-yellow-500" size={20} />;
      default:
        return <ApperIcon name="Info" className="text-blue-500" size={20} />;
    }
  };

  const getUrgencyColors = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'high':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      default:
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
    }
  };

  const getStatusBadge = (bill) => {
    if (bill.isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    if (bill.isDueToday) {
      return <Badge variant="warning">Due Today</Badge>;
    }
    if (bill.isDueSoon) {
      return <Badge variant="secondary">Due Soon</Badge>;
    }
    return <Badge variant="outline">Upcoming</Badge>;
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-light text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Payment Reminders</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ApperIcon name="Settings" size={20} />
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Total Bills</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <ApperIcon name="Receipt" size={24} className="text-white/60" />
                </div>
                <p className="text-xs text-white/70 mt-1">
                  {formatCurrency(stats.totalAmount)} total
                </p>
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Overdue</p>
                    <p className="text-2xl font-bold text-red-200">{stats.overdue}</p>
                  </div>
                  <ApperIcon name="AlertTriangle" size={24} className="text-red-300" />
                </div>
                <p className="text-xs text-red-200 mt-1">
                  {formatCurrency(stats.overdueAmount)}
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-4">
        <div className="flex space-x-2 bg-white rounded-full p-1 shadow-sm">
          {[
            { key: 'all', label: 'All', count: bills.length },
            { key: 'overdue', label: 'Overdue', count: bills.filter(b => b.isOverdue).length },
            { key: 'due-today', label: 'Today', count: bills.filter(b => b.isDueToday).length },
            { key: 'due-soon', label: 'Soon', count: bills.filter(b => b.isDueSoon).length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all",
                filter === key
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {label} {count > 0 && `(${count})`}
            </button>
          ))}
        </div>
      </div>

      {/* Bills List */}
      <div className="px-6 space-y-4">
        <AnimatePresence>
          {filteredBills.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Empty
                icon="CheckCircle"
                title="No reminders"
                description={
                  filter === 'all'
                    ? "All your bills are up to date!"
                    : `No bills in the ${filter.replace('-', ' ')} category.`
                }
              />
            </motion.div>
          ) : (
            filteredBills.map((bill, index) => (
              <motion.div
                key={bill.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "border transition-all duration-200 hover:shadow-md",
                  getUrgencyColors(bill.urgency)
                )}>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getUrgencyIcon(bill.urgency)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{bill.provider}</h3>
                          <p className="text-sm text-gray-600">{bill.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(bill.amount)}</p>
                        {getStatusBadge(bill)}
                      </div>
                    </div>

                    {/* Due Date Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ApperIcon name="Calendar" size={16} />
                        <span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm">
                        {bill.daysUntilDue < 0 ? (
                          <span className="text-red-600 font-medium">
                            {Math.abs(bill.daysUntilDue)} days overdue
                          </span>
                        ) : bill.daysUntilDue === 0 ? (
                          <span className="text-orange-600 font-medium">Due today</span>
                        ) : (
                          <span className="text-gray-600">{bill.daysUntilDue} days left</span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar for Critical Bills */}
                    {bill.urgency === 'critical' && (
                      <div className="mb-4">
                        <div className="w-full bg-red-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
                        </div>
                        <p className="text-xs text-red-600 mt-1 font-medium">Action Required</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => toast.success("Redirecting to payment...")}
                      >
                        <ApperIcon name="CreditCard" size={16} className="mr-1" />
                        Pay Now
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSnoozeReminder(bill.Id, 24)}
                      >
                        <ApperIcon name="Clock" size={16} />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBill(bill);
                          setShowSettings(true);
                        }}
                      >
                        <ApperIcon name="Settings" size={16} />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDismissReminder(bill.Id)}
                      >
                        <ApperIcon name="X" size={16} />
                      </Button>
                    </div>

                    {/* Snooze Info */}
                    {bill.snoozedUntil && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600">
                          <ApperIcon name="Clock" size={12} className="inline mr-1" />
                          Snoozed until {new Date(bill.snoozedUntil).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white rounded-t-3xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Reminder Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              {selectedBill && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium">{selectedBill.provider}</p>
                    <p className="text-sm text-gray-600">{selectedBill.category}</p>
                    <p className="text-lg font-bold text-primary mt-2">
                      {formatCurrency(selectedBill.amount)}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Quick Actions</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleSnoozeReminder(selectedBill.Id, 4)}
                      >
                        Snooze 4h
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleSnoozeReminder(selectedBill.Id, 24)}
                      >
                        Snooze 1d
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleSnoozeReminder(selectedBill.Id, 72)}
                      >
                        Snooze 3d
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleSnoozeReminder(selectedBill.Id, 168)}
                      >
                        Snooze 1w
                      </Button>
                    </div>

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleDismissReminder(selectedBill.Id)}
                    >
                      <ApperIcon name="BellOff" size={16} className="mr-2" />
                      Disable Reminders
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentReminders;