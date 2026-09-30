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

export const ChevronRightIcon = make(<path d="m9 18 6-6-6-6" />, "ChevronRightIcon");
export const ChevronLeftIcon = make(<path d="m15 18-6-6 6-6" />, "ChevronLeftIcon");
export const ChevronDownIcon = make(<path d="m6 9 6 6 6-6" />, "ChevronDownIcon");
export const ArrowDownIcon = make(
  <>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </>,
  "ArrowDownIcon"
);
export const CheckIcon = make(<path d="M20 6 9 17l-5-5" />, "CheckIcon");
export const XIcon = make(
  <>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </>,
  "XIcon"
);
export const MenuIcon = make(
  <>
    <path d="M4 12h16" />
    <path d="M4 6h16" />
    <path d="M4 18h16" />
  </>,
  "MenuIcon"
);
export const CopyIcon = make(
  <>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </>,
  "CopyIcon"
);
export const MailIcon = make(
  <>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </>,
  "MailIcon"
);
export const MapPinIcon = make(
  <>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </>,
  "MapPinIcon"
);
export const SendIcon = make(
  <>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </>,
  "SendIcon"
);
export const InfoIcon = make(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </>,
  "InfoIcon"
);
export const AlertTriangleIcon = make(
  <>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </>,
  "AlertTriangleIcon"
);
export const CheckCircleIcon = make(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </>,
  "CheckCircleIcon"
);
export const XCircleIcon = make(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </>,
  "XCircleIcon"
);
export const GithubIcon = make(
  <>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </>,
  "GithubIcon"
);
export const ExternalLinkIcon = make(
  <>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </>,
  "ExternalLinkIcon"
);
export const SparklesIcon = make(
  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />,
  "SparklesIcon"
);
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
