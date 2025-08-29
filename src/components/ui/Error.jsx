import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  className,
  variant = "default"
}) => {
  const variants = {
    default: {
      container: "bg-red-50 border-red-200",
      icon: "text-red-600",
      title: "text-red-900",
      message: "text-red-700"
    },
    minimal: {
      container: "bg-white border-gray-200",
      icon: "text-gray-400",
      title: "text-gray-900",
      message: "text-gray-600"
    }
  };

  const style = variants[variant];

  return (
    <div className={cn("rounded-lg border p-6 text-center", style.container, className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className={cn("w-12 h-12 rounded-full bg-white flex items-center justify-center", 
          variant === "default" ? "shadow-sm" : "border border-gray-200")}>
          <ApperIcon name="AlertTriangle" className={cn("w-6 h-6", style.icon)} />
        </div>
        
        <div className="space-y-2">
          <h3 className={cn("text-lg font-semibold", style.title)}>
            Oops! Something went wrong
          </h3>
          <p className={cn("text-sm", style.message)}>
            {message}
          </p>
        </div>

        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;