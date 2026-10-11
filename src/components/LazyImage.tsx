import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /** Adresa obrázku – stáhne se až před vjezdem do viewportu. */
  src?: string;
  /** Alternativní text. */
  alt: string;
  /** Barva podkladu, než se obrázek načte. */
  placeholderColor?: string;
  /** Třída pro obalující `div` (rozměry, poměr stran…). */
  wrapperClassName?: string;
  /** Text při chybě načtení. */
  errorText?: string;
  /** Jak brzy před vjezdem do viewportu začít stahovat. */
  rootMargin?: string;
}

/** Obrázek, který se stáhne až při přiblížení k viewportu, s plynulým fade-in. */
export function LazyImage({
  src,
  alt,
  placeholderColor = "#1a1a1a",
  wrapperClassName,
  className,
  errorText = "Obrázek se nepodařilo načíst",
  rootMargin = "50px",
  ...rest
}: LazyImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <div ref={wrapRef} className={cn("cbb-lazy", wrapperClassName)} style={{ backgroundColor: placeholderColor }}>
      {!loaded && inView && !failed && <div className="cbb-lazy__shimmer" />}
      {failed && <div className="cbb-lazy__error">{errorText}</div>}
      {inView && src && !failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn("cbb-lazy__img", loaded && "is-loaded", className)}
          {...rest}
        />
      )}
    </div>
  );
}
