import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "../cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-moss-500 text-paper-50 hover:bg-moss-600 disabled:bg-ink-300",
  secondary: "bg-ink-900 text-paper-50 hover:bg-ink-800 disabled:bg-ink-300",
  outline: "border border-ink-200 text-ink-900 hover:border-ink-900 disabled:opacity-50",
  ghost: "text-ink-700 hover:bg-ink-100 disabled:opacity-50",
  danger: "bg-signal-DEFAULT text-paper-50 hover:opacity-90 disabled:opacity-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded font-medium transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-400 focus-visible:ring-offset-2 focus-visible:ring-offset-paper-100",
          "disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
