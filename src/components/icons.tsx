import type { ReactNode, SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children">;

function SvgIcon({ children, ...props }: IconProps & { readonly children: ReactNode }) {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 24 24" {...props}>
      {children}
    </svg>
  );
}

const strokeProps = {
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.8,
};

export function InfoIcon(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="12" r="9" {...strokeProps} /><path d="M12 10.8v5.1M12 7.5h.01" {...strokeProps} /></SvgIcon>;
}

export function CheckIcon(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="12" r="9" {...strokeProps} /><path d="m8 12.2 2.6 2.6L16.5 9" {...strokeProps} /></SvgIcon>;
}

export function AttentionIcon(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="12" r="9" {...strokeProps} /><path d="M12 7.5v6M12 16.6h.01" {...strokeProps} /></SvgIcon>;
}

export function RouteIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="M5 7h10.5M13 4.5 15.5 7 13 9.5M19 17H8.5M11 14.5 8.5 17 11 19.5" {...strokeProps} /></SvgIcon>;
}

export function OwnerIcon(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="8" r="3.25" {...strokeProps} /><path d="M5.8 19c.5-3.5 2.6-5.3 6.2-5.3s5.7 1.8 6.2 5.3" {...strokeProps} /></SvgIcon>;
}

export function EvidenceIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="M7 3.5h7l3 3V20H7zM14 3.5V7h3M9.5 11h5M9.5 14h3" {...strokeProps} /><path d="m13.2 17 1.2 1.2 2.2-2.4" {...strokeProps} /></SvgIcon>;
}

export function ArrowIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="m9 5 7 7-7 7" {...strokeProps} /></SvgIcon>;
}

export function ShieldIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="M12 3.5 19 6v5.2c0 4.4-2.6 7.4-7 9.3-4.4-1.9-7-4.9-7-9.3V6z" {...strokeProps} /><path d="m8.7 12 2.1 2.1 4.5-4.5" {...strokeProps} /></SvgIcon>;
}

export function ClockIcon(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="12" r="9" {...strokeProps} /><path d="M12 7v5l3.2 2" {...strokeProps} /></SvgIcon>;
}

export function RefreshIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="M19 8a8 8 0 1 0 1 6M19 4v4h-4" {...strokeProps} /></SvgIcon>;
}
