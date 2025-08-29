import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, title }) => {
  return (
    <header className="lg:pl-60 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          {title && (
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;