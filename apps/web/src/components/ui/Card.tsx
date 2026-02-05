"use client";

import React from "react";
import { cn } from "./cn";

export function Card({
  title,
  subtitle,
  right,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur",
        "dark:border-slate-800 dark:bg-slate-950/40",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-300/70">
              {subtitle}
            </div>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      {children}
    </section>
  );
}
