import React from "react";
import { cn } from "@/utils/cn";

const Progress = React.forwardRef(({ 
  className, 
  value = 0,
  max = 100,
  size = "md",
  variant = "primary",
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3"
  };

  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent",
    success: "bg-gradient-to-r from-success to-green-400",
    warning: "bg-gradient-to-r from-warning to-yellow-400",
    error: "bg-gradient-to-r from-error to-red-400"
  };

  return (
    <div
      className={cn(
        "w-full bg-gray-200 rounded-full overflow-hidden",
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      <div
        className={cn(
          "transition-all duration-300 ease-out rounded-full",
          variants[variant],
          sizes[size]
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;