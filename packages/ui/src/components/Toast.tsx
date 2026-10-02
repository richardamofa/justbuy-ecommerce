import {
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
  XCircle,
} from "lucide-react";
import * as React from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
};

type ToastContextValue = {
  toast: (input: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const toastConfig = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-green-600",
    iconBg: "bg-green-50",
    progress: "bg-green-500",
  },
  error: {
    icon: XCircle,
    iconClass: "text-red-600",
    iconBg: "bg-red-50",
    progress: "bg-red-500",
  },
  warning: {
    icon: TriangleAlert,
    iconClass: "text-yellow-600",
    iconBg: "bg-yellow-50",
    progress: "bg-yellow-500",
  },
  info: {
    icon: Info,
    iconClass: "text-ink-600",
    iconBg: "bg-ink-100",
    progress: "bg-ink-500",
  },
};

const TOAST_DURATION = 4000;

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id),
    );
  }, []);

  const toast = React.useCallback(
    (input: Omit<ToastItem, "id">) => {
      const id = crypto.randomUUID();

      setToasts((current) => [
        ...current,
        {
          ...input,
          id,
        },
      ]);

      window.setTimeout(() => {
        dismiss(id);
      }, TOAST_DURATION);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      <div className="pointer-events-none fixed right-5 top-5 z-[100] flex w-[calc(100vw-2.5rem)] max-w-[380px] flex-col gap-3">
        {toasts.map((item) => {
          const config = toastConfig[item.type];
          const Icon = config.icon;

          return (
            <div
              key={item.id}
              className="pointer-events-auto relative overflow-hidden rounded-2xl border border-ink-100 bg-paper-50 shadow-[0_12px_35px_rgba(0,0,0,0.10)]"
            >
              <div className="flex items-start gap-3.5 px-4 py-3.5">
                <div
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    config.iconBg,
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "h-[18px] w-[18px]",
                      config.iconClass,
                    ].join(" ")}
                  />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-[13px] font-semibold leading-5 text-ink-900">
                    {item.title}
                  </p>

                  {item.message && (
                    <p className="mt-0.5 text-[13px] leading-5 text-ink-500">
                      {item.message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-800"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="h-[2px] w-full bg-ink-100">
                <div
                  className={[
                    "h-full origin-left animate-[toast-progress_4s_linear_forwards]",
                    config.progress,
                  ].join(" ")}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  const { toast: showToast, dismiss } = context;

  return {
    toast: showToast,

    success: (title: string, message?: string) =>
      showToast({
        type: "success",
        title,
        message,
      }),

    error: (title: string, message?: string) =>
      showToast({
        type: "error",
        title,
        message,
      }),

    warning: (title: string, message?: string) =>
      showToast({
        type: "warning",
        title,
        message,
      }),

    info: (title: string, message?: string) =>
      showToast({
        type: "info",
        title,
        message,
      }),

    dismiss,
  };
}