import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, XCircleIcon, XIcon } from "./Icons";

export type ToastVariant = "default" | "success" | "error" | "info" | "warning";

export interface ToastOptions {
  variant?: ToastVariant;
  title: ReactNode;
  description?: ReactNode;
  /** Doba zobrazení v ms (0 = nezmizí samo). Výchozí 4000. */
  duration?: number;
  action?: { label: ReactNode; onClick: () => void };
}

interface ToastItem extends ToastOptions {
  id: number;
}

// --- malý globální store: showToast() funguje odkudkoli, bez provideru ----------
let items: ToastItem[] = [];
let counter = 0;
const listeners = new Set<() => void>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();
const emit = () => listeners.forEach((l) => l());

export function dismissToast(id: number) {
  const t = timers.get(id);
  if (t) clearTimeout(t);
  timers.delete(id);
  items = items.filter((x) => x.id !== id);
  emit();
}

/** Zobrazí toast (potřebuje někde v aplikaci `<Toaster />`). Vrací jeho id. */
export function showToast(options: ToastOptions): number {
  const id = ++counter;
  items = [...items, { ...options, variant: options.variant ?? "default", id }].slice(-5);
  emit();
  const duration = options.duration ?? 4000;
  if (duration > 0) timers.set(id, setTimeout(() => dismissToast(id), duration));
  return id;
}

/** Zkratky: `toast.success("Uloženo")`. */
export const toast = {
  show: showToast,
  dismiss: dismissToast,
  success: (title: ReactNode, o?: Omit<ToastOptions, "title" | "variant">) => showToast({ ...o, title, variant: "success" }),
  error: (title: ReactNode, o?: Omit<ToastOptions, "title" | "variant">) => showToast({ ...o, title, variant: "error" }),
  info: (title: ReactNode, o?: Omit<ToastOptions, "title" | "variant">) => showToast({ ...o, title, variant: "info" }),
  warning: (title: ReactNode, o?: Omit<ToastOptions, "title" | "variant">) => showToast({ ...o, title, variant: "warning" }),
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
const getSnapshot = () => items;
const getServerSnapshot = () => items;

const ICONS = { default: null, success: CheckCircleIcon, error: XCircleIcon, info: InfoIcon, warning: AlertTriangleIcon } as const;

export interface ToasterProps {
  position?: "top-right" | "top-center" | "bottom-right" | "bottom-center" | "bottom-left";
}

/** Vykresluje toasty. Dej ho jednou do kořene aplikace. */
export function Toaster({ position = "bottom-right" }: ToasterProps) {
  const list = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // po odpojení vyčistit časovače, ať neběží zbytečně
  useEffect(
    () => () => {
      if (listeners.size === 0) {
        timers.forEach(clearTimeout);
        timers.clear();
      }
    },
    []
  );

  return (
    <div className={cn("cbb-toasts", `cbb-toasts--${position}`)} aria-live="polite">
      {list.map((t) => {
        const Icon = ICONS[t.variant ?? "default"];
        return (
          <div key={t.id} role={t.variant === "error" ? "alert" : "status"} className={cn("cbb-toast", `cbb-toast--${t.variant ?? "default"}`)}>
            {Icon && <Icon size={18} className="cbb-toast__icon" />}
            <div className="cbb-toast__msg">
              <p className="cbb-toast__title">{t.title}</p>
              {t.description && <p className="cbb-toast__desc">{t.description}</p>}
            </div>
            {t.action && (
              <button
                type="button"
                className="cbb-toast__action"
                onClick={() => {
                  t.action?.onClick();
                  dismissToast(t.id);
                }}
              >
                {t.action.label}
              </button>
            )}
            <button type="button" className="cbb-toast__close" onClick={() => dismissToast(t.id)} aria-label="Zavřít oznámení">
              <XIcon size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
