import React, { type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    // Base styles matching AdGen's high-contrast, sharp design system
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none outline-none";

    // Size variants
    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2.5 text-sm gap-2",
      lg: "px-6 py-3.5 text-base gap-2.5",
    }[size];

    // Visual variants
    const variantStyles = {
      primary:
        "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
      secondary:
        "bg-surface text-foreground hover:bg-surface-2 border border-hairline hover:-translate-y-0.5",
      outline:
        "bg-transparent text-foreground border border-hairline hover:bg-surface/50 hover:border-primary/50",
      ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-surface/40",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:-translate-y-0.5",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
