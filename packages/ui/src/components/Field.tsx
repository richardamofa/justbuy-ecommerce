import * as React from "react";
import { cn } from "../cn";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("mb-1.5 block text-sm font-medium text-ink-800", className)} {...props} />
  )
);
Label.displayName = "Label";

const fieldBase =
  "w-full rounded border border-ink-200 bg-paper-50 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 transition-colors " +
  "focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500 disabled:cursor-not-allowed disabled:bg-ink-50";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(fieldBase, invalid && "border-signal-DEFAULT focus:border-signal-DEFAULT focus:ring-signal-DEFAULT", className)}
      {...props}
    />
  )
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(fieldBase, "min-h-[96px] resize-y", invalid && "border-signal-DEFAULT", className)}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldBase, "pr-8 appearance-none bg-no-repeat", invalid && "border-signal-DEFAULT", className)} {...props}>
      {children}
    </select>
  )
);
Select.displayName = "Select";

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-signal-DEFAULT">{children}</p>;
}

export function FieldHint({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-ink-400">{children}</p>;
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      <FieldError>{error}</FieldError>
      {!error && <FieldHint>{hint}</FieldHint>}
    </div>
  );
}
