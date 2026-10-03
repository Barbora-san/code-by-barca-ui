import { useSyncExternalStore, type ReactNode } from "react";
import { AlertDialog, type AlertDialogVariant } from "./AlertDialog";

export interface MessageBoxOptions {
  title: ReactNode;
  message?: ReactNode;
  variant?: AlertDialogVariant;
  okLabel?: ReactNode;
  cancelLabel?: ReactNode;
}

interface Pending {
  id: number;
  kind: "alert" | "confirm";
  options: MessageBoxOptions;
  resolve: (value: boolean) => void;
}

let queue: Pending[] = [];
let counter = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
const getSnapshot = () => queue;

function push(kind: Pending["kind"], options: MessageBoxOptions): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    queue = [...queue, { id: ++counter, kind, options, resolve }];
    emit();
  });
}

function settle(id: number, value: boolean) {
  const item = queue.find((q) => q.id === id);
  if (!item) return;
  queue = queue.filter((q) => q.id !== id);
  item.resolve(value);
  emit();
}

/**
 * Imperativní msg box, podobně jako `window.alert` / `window.confirm`, jen hezky a s Promise:
 *
 *   await messageBox.alert({ title: "Hotovo", message: "Změny uloženy.", variant: "success" });
 *   if (await messageBox.confirm({ title: "Smazat projekt?", variant: "destructive", okLabel: "Smazat" })) { … }
 *
 * Vyžaduje jednou v aplikaci `<MessageBoxHost />`.
 */
export const messageBox = {
  alert: (options: MessageBoxOptions) => push("alert", { variant: "info", ...options }).then(() => undefined),
  confirm: (options: MessageBoxOptions) => push("confirm", { variant: "default", ...options }),
};

export function MessageBoxHost() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const current = list[0];
  if (!current) return null;
  const { options, kind, id } = current;
  return (
    <AlertDialog
      key={id}
      open
      title={options.title}
      description={options.message}
      variant={options.variant}
      confirmLabel={options.okLabel ?? (kind === "alert" ? "OK" : "Potvrdit")}
      cancelLabel={kind === "alert" ? null : options.cancelLabel ?? "Zrušit"}
      // zavření křížkem/Escapem/klikem mimo = „zrušit“; potvrzení volá onConfirm před onClose
      onConfirm={() => settle(id, true)}
      onClose={() => settle(id, false)}
    />
  );
}
