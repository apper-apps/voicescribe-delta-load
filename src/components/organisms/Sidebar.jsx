import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: "Upload", href: "/", icon: "Upload" },
    { name: "Monitor", href: "/monitor", icon: "FolderSync" },
    { name: "Speakers", href: "/speakers", icon: "Users" },
    { name: "Active Jobs", href: "/jobs", icon: "Activity" },
  ];

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="Mic" className="w-5 h-5 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            VoiceScribe
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-r-2 border-primary"
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
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
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
    </div>
  );
};

export default Sidebar;