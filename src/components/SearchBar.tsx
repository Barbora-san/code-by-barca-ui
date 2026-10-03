import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { SearchIcon, XIcon } from "./Icons";

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "size"> {
  value: string;
  onChange: (value: string) => void;
  /** Popisek tlačítka pro smazání (a11y). */
  clearLabel?: string;
  className?: string;
}

/** Vyhledávací pole s lupou a křížkem pro smazání. Escape obsah vymaže. */
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  { value, onChange, placeholder = "Hledat…", clearLabel = "Vymazat hledání", className, onKeyDown, ...rest },
  ref
) {
  return (
    <div className={cn("cbb-search", className)}>
      <SearchIcon size={18} className="cbb-search__icon" />
      <input
        ref={ref}
        type="search"
        role="searchbox"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) {
            e.preventDefault();
            onChange("");
          }
          onKeyDown?.(e);
        }}
        className="cbb-search__input"
        {...rest}
      />
      {value && (
        <button type="button" className="cbb-search__clear" onClick={() => onChange("")} aria-label={clearLabel}>
          <XIcon size={16} />
        </button>
      )}
    </div>
  );
});
