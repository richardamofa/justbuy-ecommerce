import * as React from "react";
import { cn } from "../cn";

export interface TabItem {
  value: string;
  label: string;
  count?: number;
}

export function Tabs({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1 border-b border-ink-100", className)} role="tablist">
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              "relative px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "text-ink-900" : "text-ink-400 hover:text-ink-700"
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="ml-1.5 text-xs text-ink-300">{item.count}</span>
            )}
            {active && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-ink-900" />}
          </button>
        );
      })}
    </div>
  );
}
