import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ type = "spinner", className, text = "Loading..." }) => {
  if (type === "skeleton") {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-4 space-y-3 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="h-2 bg-gray-300 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className={cn("grid gap-4", className)}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-2 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-300 rounded w-full"></div>
              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-accent/50 rounded-full animate-spin animation-delay-200"></div>
      </div>
      {text && (
        <p className="mt-4 text-sm font-medium text-gray-600">{text}</p>
      )}
    </div>
  );
};

export default Loading;