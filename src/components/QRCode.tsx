import { QRCodeSVG } from "qrcode.react";

export type QRCodeErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRCodeProps {
  /** Text or URI encoded into the QR code. */
  value: string;
  /** Square output size in CSS pixels. Values are clamped to 128–512. */
  size?: number;
  /** QR error-correction level. */
  level?: QRCodeErrorCorrectionLevel;
  /** Add a quiet-zone margin around the code. */
  includeMargin?: boolean;
  /** Foreground module color. */
  fgColor?: string;
  /** Background color. */
  bgColor?: string;
  /** Accessible description for assistive technology. */
  ariaLabel?: string;
  /** Optional class on the wrapper element. */
  className?: string;
}

/**
 * Render a standards-compliant, scannable QR code as SVG.
 *
 * The component does not persist or log the supplied value. Callers must still
 * avoid sending sensitive QR payloads to analytics, logs or persistent storage.
 */
export function QRCode({
  value,
  size = 220,
  level = "M",
  includeMargin = true,
  fgColor = "#000000",
  bgColor = "#ffffff",
  ariaLabel = "QR kód",
  className,
}: QRCodeProps) {
  if (typeof value !== "string" || value.length === 0) return null;

  const safeSize = Number.isFinite(size)
    ? Math.min(512, Math.max(128, Math.round(size)))
    : 220;

  return (
    <div className={className} role="img" aria-label={ariaLabel}>
      <QRCodeSVG
        value={value}
        size={safeSize}
        level={level}
        includeMargin={includeMargin}
        fgColor={fgColor}
        bgColor={bgColor}
        aria-hidden="true"
      />
    </div>
  );
}
