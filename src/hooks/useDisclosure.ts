import { useCallback, useState } from "react";

/** Zkratka pro stav otevřeno / zavřeno (dialog, panel, menu). Funkce jsou stabilní, hodí se do `useEffect`. */
export function useDisclosure(initial = false) {
  const [open, setOpen] = useState(initial);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen((v) => !v), []);
  return { open, onOpen, onClose, onToggle, setOpen };
}
