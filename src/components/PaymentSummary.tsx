import { useMemo, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Dialog } from "./Dialog";
import { Button } from "./Button";

export interface PaymentLine {
  /** Unikátní klíč řádku. */
  id: string;
  /** Název položky. */
  label: ReactNode;
  /** Doplňující popis pod názvem (varianta, období…). */
  detail?: ReactNode;
  /** Cena za jednu kus včetně DPH. */
  price: number;
  /** Počet kusů (výchozí 1). Zobrazí se jako „2×“ a cena řádku se vynásobí. */
  qty?: number;
}

export interface PaymentSummaryLabels {
  /** Nadpis souhrnu objednávky. */
  order?: string;
  /** Popisek mezisoučtu. */
  subtotal?: string;
  /** Popisek slevy. */
  discount?: string;
  /** Popisek DPH. */
  vat?: (ratePercent: number) => string;
  /** Popisek celkové částky. */
  total?: string;
  /** Text tlačítka platby. */
  pay?: (amount: string) => string;
}

export interface PaymentSummaryProps {
  /** Zda je dialog otevřený. */
  open: boolean;
  /** Zavolá se při zavření (Esc, křížek, klik na pozadí). */
  onClose: () => void;
  /** Zavolá se po kliknutí na „Zaplatit“. Bez něj tlačítko dialog jen zavře. */
  onConfirm?: () => void;
  /** Nadpis dialogu. */
  title?: ReactNode;
  /** Číslo objednávky – zobrazí se nad nadpisem. */
  orderId?: string;
  /** Položky objednávky; ceny jsou včetně DPH. */
  lines: PaymentLine[];
  /** Sleva v měně objednávky, odečte se od mezisoučtu. */
  discount?: number;
  /** Sazba DPH jako desetinné číslo (0.21 = 21 %). DPH se jen vypočítá z celkové ceny, nepřičítá se. */
  vatRate?: number;
  /** Kód měny (ISO 4217), např. `CZK` nebo `EUR`. */
  currency?: string;
  /** Jazyk formátování částek (výchozí `cs-CZ`). */
  locale?: string;
  /** Počet desetinných míst u částek. */
  fractionDigits?: number;
  /** Zablokuje tlačítko platby a ukáže spinner (probíhá platba). */
  loading?: boolean;
  /** Překlad textů v komponentě – výchozí je čeština. */
  labels?: PaymentSummaryLabels;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Dialog s rekapitulací objednávky – položky, sleva, DPH a celková cena s tlačítkem k zaplacení. */
export function PaymentSummary({
  open,
  onClose,
  onConfirm,
  title = "Rekapitulace platby",
  orderId,
  lines,
  discount = 0,
  vatRate = 0.21,
  currency = "CZK",
  locale = "cs-CZ",
  fractionDigits = 0,
  loading,
  labels,
  className,
}: PaymentSummaryProps) {
  const L = {
    order: "Objednávka",
    subtotal: "Mezisoučet",
    discount: "Sleva",
    vat: (p: number) => `z toho DPH ${p} %`,
    total: "Celkem",
    pay: (a: string) => `Zaplatit ${a}`,
    ...labels,
  };
  const f = useMemo(() => {
    const nf = new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
    return (v: number) => nf.format(v);
  }, [locale, currency, fractionDigits]);

  const subtotal = lines.reduce((s, l) => s + l.price * (l.qty ?? 1), 0);
  const total = Math.max(0, subtotal - discount);
  const vat = total - total / (1 + vatRate);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
      title={title}
      description={orderId ? `${L.order} ${orderId}` : undefined}
      className={cn("cbb-pay", className)}
      footer={
        <Button fullWidth loading={loading} onClick={onConfirm ?? onClose}>
          {L.pay(f(total))}
        </Button>
      }
    >
      <ul className="cbb-pay__lines">
        {lines.map((l) => (
          <li key={l.id}>
            <span>
              {l.label}
              {(l.detail || (l.qty && l.qty > 1)) && (
                <small>
                  {l.qty && l.qty > 1 ? `${l.qty}× ` : ""}
                  {l.detail}
                </small>
              )}
            </span>
            <b>{f(l.price * (l.qty ?? 1))}</b>
          </li>
        ))}
      </ul>
      <dl className="cbb-pay__sum">
        <div>
          <dt>{L.subtotal}</dt>
          <dd>{f(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="is-discount">
            <dt>{L.discount}</dt>
            <dd>−{f(discount)}</dd>
          </div>
        )}
        <div className="is-muted">
          <dt>{L.vat(Math.round(vatRate * 100))}</dt>
          <dd>{f(vat)}</dd>
        </div>
        <div className="is-total">
          <dt>{L.total}</dt>
          <dd>{f(total)}</dd>
        </div>
      </dl>
    </Dialog>
  );
}
