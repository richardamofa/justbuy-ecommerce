import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";
import * as React from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
};

type ToastContextValue = {
  toast: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: TriangleAlert,
  info: Info,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = React.useCallback(
    (input: Omit<ToastItem, "id">) => {
      const id = crypto.randomUUID();

      setToasts((current) => [...current, { ...input, id }]);

      window.setTimeout(() => {
        dismiss(id);
      }, 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((item) => {
          const Icon = icons[item.type];

          return (
            <div
              key={item.id}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-[#E7E5E2] bg-white p-4 shadow-lg"
            >
              <Icon
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  item.type === "success"
                    ? "text-[#3F7D5A]"
                    : item.type === "error"
                      ? "text-[#B94A48]"
                      : item.type === "warning"
                        ? "text-[#B7791F]"
                        : "text-[#1F3A36]"
                }`}
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#171717]">
                  {item.title}
                </p>

                {item.message && (
                  <p className="mt-1 text-sm text-[#6B6B6B]">
                    {item.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="shrink-0 rounded p-1 text-[#9A9A9A] transition hover:bg-[#F5F4F1] hover:text-[#171717]"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
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

  return context;
}