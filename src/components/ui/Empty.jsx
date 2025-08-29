import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "FileAudio",
  title = "No data found", 
  description = "Get started by adding some content.",
  action,
  onAction,
  className 
}) => {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-8 h-8 text-gray-400" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 max-w-sm">{description}</p>
        </div>

        {action && onAction && (
          <Button onClick={onAction} className="mt-4">
            {action}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;