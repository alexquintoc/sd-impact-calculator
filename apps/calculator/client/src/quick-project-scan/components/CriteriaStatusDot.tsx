import { Check, Lightbulb, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CriteriaScanStatus } from "../types";

const STATUS_CONFIG: Record<
  CriteriaScanStatus,
  {
    label: string;
    className: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  "likely-met": {
    label: "Likely met",
    className: "bg-[#31b84a] text-white",
    icon: Check,
  },
  opportunity: {
    label: "Opportunity",
    className: "bg-[#fff11f] text-[#111111] ring-1 ring-black/10",
    icon: Lightbulb,
  },
  "not-considered": {
    label: "Not considered",
    className: "bg-[#9da0a2] text-white",
    icon: Minus,
  },
};

type CriteriaStatusDotProps = {
  status: CriteriaScanStatus;
  size?: "sm" | "lg";
};

export function getStatusLabel(status: CriteriaScanStatus) {
  return STATUS_CONFIG[status].label;
}

export function CriteriaStatusDot({ status, size = "lg" }: CriteriaStatusDotProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        config.className,
        size === "lg" ? "h-16 w-16" : "h-5 w-5"
      )}
      aria-label={config.label}
      title={config.label}
    >
      <Icon className={size === "lg" ? "h-9 w-9" : "h-3.5 w-3.5"} aria-hidden="true" />
    </span>
  );
}
