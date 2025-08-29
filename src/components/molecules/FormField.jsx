import React from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  error, 
  className,
  required = false,
  children,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 block">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children || <Input error={error} {...props} />}
      {error && (
        <p className="text-sm text-error font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;