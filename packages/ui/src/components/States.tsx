import { AlertTriangle, Inbox } from "lucide-react";
import * as React from "react";
import { cn } from "../cn";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16 text-center", className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded bg-ink-50 text-ink-500">
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-ink-900">{title}</p>
        {description && <p className="text-sm text-ink-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16 text-center", className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded bg-signal-50 text-signal-DEFAULT">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-ink-900">{title}</p>
        {description && <p className="text-sm text-ink-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-ink-100", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[3/4] w-full" />
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-3.5 w-1/3" />
    </div>
  );
}
