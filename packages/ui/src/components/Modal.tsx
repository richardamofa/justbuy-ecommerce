import { AnimatePresence, motion } from "framer-motion";
import { LucideIcon, X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../cn";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  icon: Icon,
}: ModalProps) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (isOpen) document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence initial={false}>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
          data-modal-root
        >
          <motion.div
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onPointerDown={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title ?? "Dialog"}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            onPointerDown={(event) => event.stopPropagation()}
            className={cn(
              "relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-ink-100 bg-paper-50 shadow-[0_-12px_50px_rgba(25,32,28,0.18)] will-change-transform sm:rounded-2xl sm:shadow-raised",
              className,
            )}
          >
            {title && (
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 bg-paper-50/95 px-5 py-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  {Icon && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <Icon className="h-5 w-5" />
                    </div>
                  )}

                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-moss-600">
                      Confirmation
                    </p>

                    <h2 className="font-display text-xl text-ink-900">
                      {title}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-full border border-ink-200 p-2 text-ink-500 transition-colors hover:border-ink-900 hover:text-ink-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="px-5 py-5 sm:px-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}