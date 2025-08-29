import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const MobileSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Upload", href: "/", icon: "Upload" },
    { name: "Monitor", href: "/monitor", icon: "FolderSync" },
    { name: "Speakers", href: "/speakers", icon: "Users" },
    { name: "Active Jobs", href: "/jobs", icon: "Activity" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <ApperIcon name="Mic" className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    VoiceScribe
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-4 space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={onClose}
                      className={cn(
                        "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <ApperIcon
                        name={item.icon}
                        className={cn(
                          "mr-3 h-5 w-5 transition-colors",
                          isActive
                            ? "text-primary"
                            : "text-gray-400 group-hover:text-gray-500"
                        )}
                      />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Audio Pro</p>
                    <p className="text-xs text-gray-500">Professional Plan</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;