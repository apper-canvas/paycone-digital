import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { billPaymentService } from '@/services/api/billPaymentService';
import { cn } from '@/utils/cn';

const BottomNavigation = () => {
  const location = useLocation();
  const [reminderCount, setReminderCount] = useState(0);

  useEffect(() => {
    const loadReminderCount = async () => {
      try {
        const reminders = await billPaymentService.getActiveReminders();
        setReminderCount(reminders.length);
      } catch (err) {
        console.error('Failed to load reminder count:', err);
      }
    };

    loadReminderCount();
    // Refresh count every 5 minutes
    const interval = setInterval(loadReminderCount, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', icon: 'Home', label: 'Home' },
    { 
      path: '/payments', 
      icon: 'CreditCard', 
      label: 'Payments',
      badge: reminderCount > 0 ? reminderCount : null
    },
    { path: '/scan-qr', icon: 'QrCode', label: 'Scan QR' },
    { path: '/history', icon: 'Clock', label: 'History' },
    { path: '/profile', icon: 'User', label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 relative",
              isActive(item.path)
                ? "text-primary"
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            {isActive(item.path) && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary/10 rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <ApperIcon 
                  name={item.icon} 
                  size={20} 
                  className={isActive(item.path) ? "text-primary" : "text-gray-400"} 
                />
                {item.badge && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold">
                    {item.badge > 99 ? '99+' : item.badge}
                  </div>
                )}
              </div>
              <span className={cn(
                "text-xs mt-1 font-medium",
                isActive(item.path) ? "text-primary" : "text-gray-400"
              )}>
                {item.label}
              </span>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;