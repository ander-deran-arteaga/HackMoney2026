"use client";

import React from "react";
import { cn } from "./cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  loading?: boolean;
  leftIcon?: React.ReactNode;
};

export function Button({
  className,
  variant = "primary",
  loading,
  leftIcon,
  disabled,
  ...props
}: Props) {
  const base =
    "inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed";

  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-sm hover:brightness-110"
      : variant === "outline"
      ? "border border-slate-200 bg-white/70 text-slate-900 shadow-sm hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-50"
      : "bg-transparent text-slate-700 hover:bg-slate-200/60 dark:text-slate-200 dark:hover:bg-slate-800/60";

  return (
    <button
      className={cn(base, styles, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        leftIcon
      )}
      {props.children}
    </button>
  );
}
