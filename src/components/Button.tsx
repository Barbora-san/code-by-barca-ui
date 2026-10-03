import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { isExternalHref, useLinkComponent } from "../lib/link";

export type ButtonVariant = "primary" | "secondary" | "outline" | "soft" | "ghost" | "destructive" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Zobrazí spinner a tlačítko zablokuje. */
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  /** Svítící stín při hoveru (jako na hero CTA). */
  glow?: boolean;
  /** Pokud je zadán `href`, vykreslí se odkaz místo `<button>`. */
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * Pill tlačítko. S `href` se chová jako odkaz – interní cesty jdou přes
 * `linkComponent` z `CbbProvider` (např. `next/link`), externí přes `<a>`.
 */
export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth,
    glow,
    href,
    className,
    children,
    disabled,
    type = "button",
    target,
    rel,
    onClick,
    ...rest
  },
  ref
) {
  const LinkComponent = useLinkComponent();
  const classes = cn(
    "cbb-btn",
    `cbb-btn--${variant}`,
    `cbb-btn--${size}`,
    fullWidth && "cbb-btn--full",
    glow && "cbb-btn--glow",
    (disabled || loading) && "is-disabled",
    className
  );

  const content = (
    <>
      {loading ? <span className="cbb-spinner" aria-hidden="true" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </>
  );

  if (href !== undefined) {
    const Tag = isExternalHref(href) ? "a" : LinkComponent;
    return (
      <Tag
        ref={ref as never}
        href={href}
        className={classes}
        aria-disabled={disabled || loading || undefined}
        target={target}
        rel={target === "_blank" ? rel ?? "noopener noreferrer" : rel}
        onClick={onClick as never}
      >
        {content}
      </Tag>
    );
  }

  return (
    <button
      ref={ref as never}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
      {...rest}
    >
      {content}
    </button>
  );
});
