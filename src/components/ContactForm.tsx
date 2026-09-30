import { useState, type FormEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Button } from "./Button";
import { Input, Textarea } from "./Field";
import { SendIcon } from "./Icons";

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormLabels {
  name: string;
  email: string;
  message: string;
  submit: string;
  sending: string;
  /** Popisek honeypot pole (viditelný jen robotům / čtečkám). */
  honeypot: string;
  required: string;
  invalidEmail: string;
}

export const DEFAULT_CONTACT_LABELS: ContactFormLabels = {
  name: "Jméno",
  email: "Váš Email",
  message: "Zpráva",
  submit: "Odeslat",
  sending: "Odesílám…",
  honeypot: "Nevyplňovat",
  required: "Toto pole je povinné",
  invalidEmail: "Zadej platný e-mail",
};

export interface ContactFormProps {
  /**
   * Zavolá se po validaci. Vrať promise – při chybě (throw) zůstanou data ve formuláři.
   * Když je vyplněný honeypot, `onSubmit` se NEvolá (formulář se tváří jako odeslaný).
   */
  onSubmit: (values: ContactFormValues) => void | Promise<void>;
  labels?: Partial<ContactFormLabels>;
  /** Zpráva po úspěšném odeslání (nahradí formulář). */
  successMessage?: ReactNode;
  /** Zpráva při chybě odeslání. */
  errorMessage?: ReactNode;
  className?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({
  onSubmit,
  labels,
  successMessage = "Díky! Zpráva je na cestě.",
  errorMessage = "Odeslání se nepovedlo, zkus to prosím znovu.",
  className,
}: ContactFormProps) {
  const t = { ...DEFAULT_CONTACT_LABELS, ...labels };
  const [values, setValues] = useState<ContactFormValues>({ name: "", email: "", message: "" });
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (key: keyof ContactFormValues) => (value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!values.name.trim()) next.name = t.required;
    if (!values.email.trim()) next.email = t.required;
    else if (!EMAIL_RE.test(values.email.trim())) next.email = t.invalidEmail;
    if (!values.message.trim()) next.message = t.required;
    setErrors(next);
    if (Object.keys(next).length) return;

    if (trap) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      await onSubmit({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className={cn("cbb-form-success", className)} role="status">
        {successMessage}
      </div>
    );
  }

  return (
    <form className={cn("cbb-form", className)} onSubmit={handleSubmit} noValidate>
      <Input
        label={t.name}
        name="name"
        autoComplete="name"
        value={values.name}
        onChange={(e) => set("name")(e.target.value)}
        error={errors.name}
      />
      <Input
        label={t.email}
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(e) => set("email")(e.target.value)}
        error={errors.email}
      />
      <Textarea
        label={t.message}
        name="message"
        value={values.message}
        onChange={(e) => set("message")(e.target.value)}
        error={errors.message}
      />

      {/* Honeypot – lidé ho nevidí, boti ho vyplní */}
      <div className="cbb-honeypot" aria-hidden="true">
        <label>
          {t.honeypot}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </label>
      </div>

      {status === "error" && (
        <p className="cbb-field__error" role="alert">
          {errorMessage}
        </p>
      )}

      <Button type="submit" glow loading={status === "sending"} leftIcon={<SendIcon size={16} />}>
        {status === "sending" ? t.sending : t.submit}
      </Button>
    </form>
  );
}
