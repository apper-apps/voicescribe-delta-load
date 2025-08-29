import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md",
  children, 
  disabled,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:from-primary/90 hover:to-accent/90 active:scale-[0.98]",
    secondary: "border-2 border-gray-200 text-gray-700 bg-white hover:border-primary hover:text-primary hover:shadow-md active:scale-[0.98]",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white hover:shadow-md active:scale-[0.98]",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98]",
    danger: "bg-gradient-to-r from-error to-red-500 text-white hover:shadow-lg hover:from-error/90 hover:to-red-500/90 active:scale-[0.98]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm font-medium",
    md: "px-4 py-2 text-sm font-semibold",
    lg: "px-6 py-3 text-base font-semibold",
    xl: "px-8 py-4 text-lg font-bold"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-4 focus:ring-primary/20",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed hover:shadow-none hover:scale-100",
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;