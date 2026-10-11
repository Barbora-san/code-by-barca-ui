import type { ReactNode, SVGProps } from "react";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  /** Velikost v px (výchozí 16). */
  size?: number;
}

function make(paths: ReactNode, name: string) {
  const Icon = ({ size = 16, strokeWidth = 2, ...rest }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths}
    </svg>
  );
  Icon.displayName = name;
  return Icon;
}

/** Ikona „ChevronRight“ (SVG v barvě textu, `size` v px). */
export const ChevronRightIcon = make(<path d="m9 18 6-6-6-6" />, "ChevronRightIcon");
/** Ikona „ChevronLeft“ (SVG v barvě textu, `size` v px). */
export const ChevronLeftIcon = make(<path d="m15 18-6-6 6-6" />, "ChevronLeftIcon");
/** Ikona „ChevronDown“ (SVG v barvě textu, `size` v px). */
export const ChevronDownIcon = make(<path d="m6 9 6 6 6-6" />, "ChevronDownIcon");
/** Ikona „ArrowDown“ (SVG v barvě textu, `size` v px). */
export const ArrowDownIcon = make(
  <>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </>,
  "ArrowDownIcon"
);
/** Ikona „Check“ (SVG v barvě textu, `size` v px). */
export const CheckIcon = make(<path d="M20 6 9 17l-5-5" />, "CheckIcon");
/** Ikona „X“ (SVG v barvě textu, `size` v px). */
export const XIcon = make(
  <>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </>,
  "XIcon"
);
/** Ikona „Menu“ (SVG v barvě textu, `size` v px). */
export const MenuIcon = make(
  <>
    <path d="M4 12h16" />
    <path d="M4 6h16" />
    <path d="M4 18h16" />
  </>,
  "MenuIcon"
);
/** Ikona „Copy“ (SVG v barvě textu, `size` v px). */
export const CopyIcon = make(
  <>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </>,
  "CopyIcon"
);
/** Ikona „Mail“ (SVG v barvě textu, `size` v px). */
export const MailIcon = make(
  <>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </>,
  "MailIcon"
);
/** Ikona „MapPin“ (SVG v barvě textu, `size` v px). */
export const MapPinIcon = make(
  <>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </>,
  "MapPinIcon"
);
/** Ikona „Send“ (SVG v barvě textu, `size` v px). */
export const SendIcon = make(
  <>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </>,
  "SendIcon"
);
/** Ikona „Info“ (SVG v barvě textu, `size` v px). */
export const InfoIcon = make(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </>,
  "InfoIcon"
);
/** Ikona „AlertTriangle“ (SVG v barvě textu, `size` v px). */
export const AlertTriangleIcon = make(
  <>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </>,
  "AlertTriangleIcon"
);
/** Ikona „CheckCircle“ (SVG v barvě textu, `size` v px). */
export const CheckCircleIcon = make(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </>,
  "CheckCircleIcon"
);
/** Ikona „XCircle“ (SVG v barvě textu, `size` v px). */
export const XCircleIcon = make(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </>,
  "XCircleIcon"
);
/** Ikona „Github“ (SVG v barvě textu, `size` v px). */
export const GithubIcon = make(
  <>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </>,
  "GithubIcon"
);
/** Ikona „ExternalLink“ (SVG v barvě textu, `size` v px). */
export const ExternalLinkIcon = make(
  <>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </>,
  "ExternalLinkIcon"
);
/** Ikona „Sparkles“ (SVG v barvě textu, `size` v px). */
export const SparklesIcon = make(
  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />,
  "SparklesIcon"
);
/** Ikona „Cookie“ (SVG v barvě textu, `size` v px). */
export const CookieIcon = make(
  <>
    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
    <path d="M8.5 8.5v.01" />
    <path d="M16 15.5v.01" />
    <path d="M12 12v.01" />
    <path d="M11 17v.01" />
    <path d="M7 14v.01" />
  </>,
  "CookieIcon"
);
/** Ikona „Search“ (SVG v barvě textu, `size` v px). */
export const SearchIcon = make(
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </>,
  "SearchIcon"
);
/** Ikona „Sliders“ (SVG v barvě textu, `size` v px). */
export const SlidersIcon = make(
  <>
    <line x1="21" x2="14" y1="4" y2="4" />
    <line x1="10" x2="3" y1="4" y2="4" />
    <line x1="21" x2="12" y1="12" y2="12" />
    <line x1="8" x2="3" y1="12" y2="12" />
    <line x1="21" x2="16" y1="20" y2="20" />
    <line x1="12" x2="3" y1="20" y2="20" />
    <line x1="14" x2="14" y1="2" y2="6" />
    <line x1="8" x2="8" y1="10" y2="14" />
    <line x1="16" x2="16" y1="18" y2="22" />
  </>,
  "SlidersIcon"
);
/** Ikona „ArrowUpDown“ (SVG v barvě textu, `size` v px). */
export const ArrowUpDownIcon = make(
  <>
    <path d="m21 16-4 4-4-4" />
    <path d="M17 20V4" />
    <path d="m3 8 4-4 4 4" />
    <path d="M7 4v16" />
  </>,
  "ArrowUpDownIcon"
);
/** Ikona „Tag“ (SVG v barvě textu, `size` v px). */
export const TagIcon = make(
  <>
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
  </>,
  "TagIcon"
);
/** Ikona „Hash“ (SVG v barvě textu, `size` v px). */
export const HashIcon = make(
  <>
    <line x1="4" x2="20" y1="9" y2="9" />
    <line x1="4" x2="20" y1="15" y2="15" />
    <line x1="10" x2="8" y1="3" y2="21" />
    <line x1="16" x2="14" y1="3" y2="21" />
  </>,
  "HashIcon"
);
/** Ikona „Layers“ (SVG v barvě textu, `size` v px). */
export const LayersIcon = make(
  <>
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
  </>,
  "LayersIcon"
);
/** Ikona „Home“ (SVG v barvě textu, `size` v px). */
export const HomeIcon = make(
  <>
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </>,
  "HomeIcon"
);
/** Ikona „User“ (SVG v barvě textu, `size` v px). */
export const UserIcon = make(
  <>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>,
  "UserIcon"
);
/** Ikona „Settings“ (SVG v barvě textu, `size` v px). */
export const SettingsIcon = make(
  <>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </>,
  "SettingsIcon"
);
/** Ikona „Folder“ (SVG v barvě textu, `size` v px). */
export const FolderIcon = make(
  <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />,
  "FolderIcon"
);
/** Ikona „Bell“ (SVG v barvě textu, `size` v px). */
export const BellIcon = make(
  <>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </>,
  "BellIcon"
);
/** Ikona „More“ (SVG v barvě textu, `size` v px). */
export const MoreIcon = make(
  <>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </>,
  "MoreIcon"
);
/** Ikona „Plus“ (SVG v barvě textu, `size` v px). */
export const PlusIcon = make(
  <>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </>,
  "PlusIcon"
);
/** Ikona „Code“ (SVG v barvě textu, `size` v px). */
export const CodeIcon = make(
  <>
    <path d="m16 18 6-6-6-6" />
    <path d="m8 6-6 6 6 6" />
  </>,
  "CodeIcon"
);
/** Ikona „Palette“ (SVG v barvě textu, `size` v px). */
export const PaletteIcon = make(
  <>
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </>,
  "PaletteIcon"
);
/** Ikona „ChevronUp“ (SVG v barvě textu, `size` v px). */
export const ChevronUpIcon = make(<path d="m18 15-6-6-6 6" />, "ChevronUpIcon");
/** Ikona „PanelLeft“ (SVG v barvě textu, `size` v px). */
export const PanelLeftIcon = make(
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" />
  </>,
  "PanelLeftIcon"
);

/** Ikona „Play“ (SVG v barvě textu, `size` v px). */
export const PlayIcon = make(<path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z" fill="currentColor" />, "PlayIcon");
/** Ikona „Pause“ (SVG v barvě textu, `size` v px). */
export const PauseIcon = make(
  <>
    <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
    <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
  </>,
  "PauseIcon"
);
/** Ikona „ArrowLeftRight“ (SVG v barvě textu, `size` v px). */
export const ArrowLeftRightIcon = make(
  <>
    <path d="M8 3 4 7l4 4" />
    <path d="M4 7h16" />
    <path d="m16 21 4-4-4-4" />
    <path d="M20 17H4" />
  </>,
  "ArrowLeftRightIcon"
);

/** Ikona „Minus“ (SVG v barvě textu, `size` v px). */
export const MinusIcon = make(<path d="M5 12h14" />, "MinusIcon");
/** Ikona „Eye“ (SVG v barvě textu, `size` v px). */
export const EyeIcon = make(
  <>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </>,
  "EyeIcon"
);
/** Ikona „EyeOff“ (SVG v barvě textu, `size` v px). */
export const EyeOffIcon = make(
  <>
    <path d="M9.9 4.2A10 10 0 0 1 12 4c6.4 0 10 8 10 8a17 17 0 0 1-2.2 3.3" />
    <path d="M6.6 6.6A16 16 0 0 0 2 12s3.6 8 10 8a9.7 9.7 0 0 0 5.4-1.6" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="m2 2 20 20" />
  </>,
  "EyeOffIcon"
);
/** Ikona „Star“ (SVG v barvě textu, `size` v px). */
export const StarIcon = make(
  <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />,
  "StarIcon"
);

/** Ikona „Sun“ (SVG v barvě textu, `size` v px). */
export const SunIcon = make(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>,
  "SunIcon"
);
/** Ikona „Moon“ (SVG v barvě textu, `size` v px). */
export const MoonIcon = make(<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />, "MoonIcon");
/** Ikona „Monitor“ (SVG v barvě textu, `size` v px). */
export const MonitorIcon = make(
  <>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </>,
  "MonitorIcon"
);
/** Ikona „Command“ (SVG v barvě textu, `size` v px). */
export const CommandIcon = make(
  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />,
  "CommandIcon"
);

/** Ikona „Link“ (SVG v barvě textu, `size` v px). */
export const LinkIcon = make(
  <>
    <path d="M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7" />
    <path d="M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7" />
  </>,
  "LinkIcon"
);
/** Ikona „Image“ (SVG v barvě textu, `size` v px). */
export const ImageIcon = make(
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
  </>,
  "ImageIcon"
);

/** Ikona „SkipBack“ (SVG v barvě textu, `size` v px). */
export const SkipBackIcon = make(
  <>
    <path d="M19 5.5v13a.8.8 0 0 1-1.25.66L8.5 12.66a.8.8 0 0 1 0-1.32l9.25-6.5A.8.8 0 0 1 19 5.5Z" fill="currentColor" />
    <path d="M5 5v14" />
  </>,
  "SkipBackIcon"
);
/** Ikona „SkipForward“ (SVG v barvě textu, `size` v px). */
export const SkipForwardIcon = make(
  <>
    <path d="M5 5.5v13a.8.8 0 0 0 1.25.66l9.25-6.5a.8.8 0 0 0 0-1.32l-9.25-6.5A.8.8 0 0 0 5 5.5Z" fill="currentColor" />
    <path d="M19 5v14" />
  </>,
  "SkipForwardIcon"
);
/** Ikona „Shuffle“ (SVG v barvě textu, `size` v px). */
export const ShuffleIcon = make(
  <>
    <path d="M16 3h5v5" />
    <path d="M4 20 21 3" />
    <path d="M21 16v5h-5" />
    <path d="m15 15 6 6" />
    <path d="m4 4 5 5" />
  </>,
  "ShuffleIcon"
);
/** Ikona „Repeat“ (SVG v barvě textu, `size` v px). */
export const RepeatIcon = make(
  <>
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </>,
  "RepeatIcon"
);
/** Ikona „Repeat1“ (SVG v barvě textu, `size` v px). */
export const Repeat1Icon = make(
  <>
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    <path d="M11 10h1v4" />
  </>,
  "Repeat1Icon"
);
/** Ikona „VolumeMute“ (SVG v barvě textu, `size` v px). */
export const VolumeMuteIcon = make(
  <>
    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
    <path d="m22 9-6 6" />
    <path d="m16 9 6 6" />
  </>,
  "VolumeMuteIcon"
);
/** Ikona „VolumeLow“ (SVG v barvě textu, `size` v px). */
export const VolumeLowIcon = make(
  <>
    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
  </>,
  "VolumeLowIcon"
);
/** Ikona „VolumeHigh“ (SVG v barvě textu, `size` v px). */
export const VolumeHighIcon = make(
  <>
    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M19 5a9 9 0 0 1 0 14" />
  </>,
  "VolumeHighIcon"
);
/** Ikona „Queue“ (SVG v barvě textu, `size` v px). */
export const QueueIcon = make(
  <>
    <path d="M3 6h12M3 12h12M3 18h7" />
    <circle cx="17" cy="17" r="2.5" />
    <path d="M19.5 17V6l2.5 1" />
  </>,
  "QueueIcon"
);
/** Ikona „Heart“ (SVG v barvě textu, `size` v px). */
export const HeartIcon = make(
  <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />,
  "HeartIcon"
);
/** Ikona „Music“ (SVG v barvě textu, `size` v px). */
export const MusicIcon = make(
  <>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </>,
  "MusicIcon"
);
/** Ikona „Grip“ (SVG v barvě textu, `size` v px). */
export const GripIcon = make(
  <>
    <circle cx="9" cy="6" r="1" fill="currentColor" />
    <circle cx="15" cy="6" r="1" fill="currentColor" />
    <circle cx="9" cy="12" r="1" fill="currentColor" />
    <circle cx="15" cy="12" r="1" fill="currentColor" />
    <circle cx="9" cy="18" r="1" fill="currentColor" />
    <circle cx="15" cy="18" r="1" fill="currentColor" />
  </>,
  "GripIcon"
);

