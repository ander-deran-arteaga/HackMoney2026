import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const tones = {
    neutral: "bg-[rgba(100,116,139,0.12)] text-[rgb(var(--fg))]",
    success: "bg-[rgba(16,185,129,0.14)] text-[rgb(var(--fg))]",
    warning: "bg-[rgba(245,158,11,0.16)] text-[rgb(var(--fg))]",
    danger: "bg-[rgba(239,68,68,0.16)] text-[rgb(var(--fg))]",
  } as const;

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}
