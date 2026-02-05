"use client";

import React from "react";
import { cn } from "./cn";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <input
      className={cn(
        "h-10 w-full rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-400",
        "dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus-visible:border-fuchsia-500",
        className
      )}
      {...rest}
    />
  );
}
