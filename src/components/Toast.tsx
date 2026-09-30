import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, XCircleIcon, XIcon } from "./Icons";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: number;
  message: ReactNode;
  type: ToastType;
}

interface ToastApi {
  show: (message: ReactNode, type?: ToastType, duration?: number) => number;
  success: (message: ReactNode, duration?: number) => number;
  error: (message: ReactNode, duration?: number) => number;
  info: (message: ReactNode, duration?: number) => number;
  warning: (message: ReactNode, duration?: number) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/** `const toast = useToast(); toast.success("Uloženo")` – musí být uvnitř `<ToastProvider>`. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast musí být použit uvnitř <ToastProvider>.");
  return ctx;
}

const ICONS = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InfoIcon,
  warning: AlertTriangleIcon,
} as const;

export interface ToastProviderProps {
  children: ReactNode;
  /** Výchozí doba zobrazení v ms (0 = nezmizí samo). */
  duration?: number;
  position?: "top-right" | "bottom-right" | "bottom-center";
}

export function ToastProvider({ children, duration: defaultDuration = 3500, position = "bottom-right" }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    const t = timers.current.get(id);
    if (t) clearTimeout(t);
    timers.current.delete(id);
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const show = useCallback(
    (message: ReactNode, type: ToastType = "info", duration = defaultDuration) => {
      const id = ++counter.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) timers.current.set(id, setTimeout(() => dismiss(id), duration));
      return id;
    },
    [defaultDuration, dismiss]
  );

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach(clearTimeout);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      show,
      dismiss,
      success: (m, d) => show(m, "success", d),
      error: (m, d) => show(m, "error", d),
      info: (m, d) => show(m, "info", d),
      warning: (m, d) => show(m, "warning", d),
    }),
    [show, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={cn("cbb-toasts", `cbb-toasts--${position}`)} aria-live="polite">
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <div key={t.id} role={t.type === "error" ? "alert" : "status"} className={cn("cbb-toast", `cbb-toast--${t.type}`)}>
              <Icon size={18} />
              <div className="cbb-toast__msg">{t.message}</div>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Zavřít oznámení">
                <XIcon size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
