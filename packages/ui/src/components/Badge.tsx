
import * as React from "react";
import { cn } from "../cn";

export type BadgeTone =
  | "neutral"
  | "moss"
  | "signal"
  | "outline"
  | "new"
  | "sale"
  | "stock";

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  const base =
    "relative inline-flex w-fit items-center justify-center text-[11px] font-semibold leading-none tracking-wide transition-colors";

  const toneClasses: Record<BadgeTone, string> = {
    // Quiet, neutral label
    neutral:
      "rounded-md bg-ink-100 px-2.5 py-1.5 text-ink-700",

    // Soft green label for active/positive states
    moss:
      "rounded-md bg-moss-100 px-2.5 py-1.5 text-moss-700",

    // Distinctive red label for attention
    signal:
      "rounded-md bg-signal-50 px-2.5 py-1.5 text-signal-DEFAULT",

    // Minimal outlined label
    outline:
      "rounded-md border border-ink-200 bg-transparent px-2.5 py-1.5 text-ink-600",

    // New arrivals: small editorial capsule
    new:
      "rounded-full border border-moss-200 bg-moss-50 px-3 py-1.5 text-moss-800 uppercase tracking-[0.12em]",

    // Sale: physical merchandise tag
    sale:
      "gap-1.5 rounded-sm bg-amber-400 px-2.5 py-1.5 pr-3 text-amber-950 shadow-[1px_2px_0px_rgba(0,0,0,0.12)] before:absolute before:-left-1 before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full before:border before:border-amber-700/30 before:bg-paper-50 before:content-['']",

    // Inventory status: compact indicator with a dot
    stock:
      "gap-1.5 rounded-full border border-ink-200 bg-white px-2.5 py-1.5 text-ink-700 before:h-1.5 before:w-1.5 before:rounded-full before:bg-current before:content-['']",
  };

  return (
    <span className={cn(base, toneClasses[tone], className)}>
      {children}
    </span>
  );
}