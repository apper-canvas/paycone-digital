import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "",
      icon: "Home",
      label: "Home",
    },
    {
      path: "payments",
      icon: "Send",
      label: "Payments",
    },
    {
      path: "history",
      icon: "History",
      label: "History",
    },
    {
      path: "profile",
      icon: "User",
      label: "Profile",
    },
  ];

  const isActive = (path) => {
    if (path === "") {
      return location.pathname === "/";
    }
    return location.pathname.includes(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-bottom">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <NavLink
              key={item.path}
              to={item.path === "" ? "/" : `/${item.path}`}
              className="flex flex-col items-center gap-1 py-2 px-3 min-w-0 flex-1"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "p-2 rounded-xl transition-all duration-200",
                  active 
                    ? "bg-gradient-to-br from-primary to-primary-light text-white shadow-lg" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <ApperIcon name={item.icon} size={20} />
              </motion.div>
              <span 
                className={cn(
                  "text-xs font-medium truncate",
                  active ? "text-primary" : "text-gray-400"
                )}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigation;