import { useState } from "react";
import { cn } from "../lib/cn";

export type AvatarStatus = "online" | "away" | "busy" | "offline";

export interface AvatarProps {
  /** Obrázek. Bez něj se zobrazí `initials`. */
  src?: string;
  /** Alternativní text obrázku. */
  alt?: string;
  /** Zobrazí se, když chybí / nenačte se obrázek. Bez toho se použije první písmeno `alt`. */
  initials?: string;
  /** Velikost: `sm`, `md`, `lg`. */
  size?: "sm" | "md" | "lg";
  /** Stavová tečka: `online`, `away`, `busy`, `offline`. */
  status?: AvatarStatus;
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Kulatý avatar s obrázkem, nebo s iniciálami, a volitelnou stavovou tečkou. */
export function Avatar({ src, alt = "", initials, size = "md", status, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const text = (initials ?? alt.trim().slice(0, 2)).toUpperCase();
  return (
    <span className={cn("cbb-avatar", `cbb-avatar--${size}`, className)} role={src && !failed ? undefined : "img"} aria-label={alt || initials}>
      {src && !failed ? <img src={src} alt={alt} onError={() => setFailed(true)} /> : <span aria-hidden="true">{text}</span>}
      {status && <span className={cn("cbb-avatar__status", `is-${status}`)} title={status} />}
    </span>
  );
}

export interface AvatarGroupProps {
  /** Pole avatarů (props jako u `Avatar`). */
  avatars: Omit<AvatarProps, "size" | "className">[];
  /** Kolik avatarů zobrazit, zbytek se sloučí do „+N“. */
  max?: number;
  /** Velikost všech avatarů. */
  size?: AvatarProps["size"];
  /** Vlastní CSS třída přidaná ke kořenovému prvku. */
  className?: string;
}

/** Překrývající se řada avatarů se souhrnem „+N“. */
export function AvatarGroup({ avatars, max = 4, size = "md", className }: AvatarGroupProps) {
  const shown = avatars.slice(0, max);
  const rest = avatars.length - shown.length;
  return (
    <div className={cn("cbb-avatars", className)}>
      {shown.map((a, i) => (
        <Avatar key={i} size={size} {...a} />
      ))}
      {rest > 0 && (
        <span className={cn("cbb-avatar cbb-avatar--more", `cbb-avatar--${size}`)}>
          <span>+{rest}</span>
        </span>
      )}
    </div>
  );
}
