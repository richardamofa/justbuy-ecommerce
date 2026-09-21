import * as React from "react";
import { cn } from "../cn";

export type BadgeTone = "neutral" | "moss" | "signal" | "outline" | "new" | "sale" | "stock";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-ink-100 text-ink-700",
  moss: "bg-moss-100 text-moss-700",
  signal: "bg-signal-50 text-signal-DEFAULT",
  outline: "border border-ink-200 text-ink-600",
  new: "bg-moss-100 text-moss-700",
  sale: "bg-amber-100 text-amber-800",
  stock: "bg-ink-100 text-ink-700",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium tracking-tight",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
