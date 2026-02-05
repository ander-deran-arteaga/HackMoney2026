"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useActivity } from "./ActivityProvider";
import { cn } from "@/lib/cn";
import { Activity, CheckCircle2, AlertTriangle, Info } from "lucide-react";

function icon(kind: string) {
  if (kind === "ok") return <CheckCircle2 className="h-4 w-4" />;
  if (kind === "warn") return <AlertTriangle className="h-4 w-4" />;
  if (kind === "tx") return <Activity className="h-4 w-4" />;
  return <Info className="h-4 w-4" />;
}

export function ActivityFeed() {
  const { items, clear } = useActivity();

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Activity</div>
        <Button variant="ghost" size="sm" onClick={clear}>
          Clear
        </Button>
      </div>

      <div className="grid gap-2">
        {items.length === 0 && (
          <div className="text-xs text-neutral-500">
            No events yet. Actions will appear here.
          </div>
        )}

        {items.slice(0, 10).map((it) => (
          <motion.div
            key={it.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border border-neutral-200 bg-white/50 backdrop-blur p-3",
              "flex items-start gap-3"
            )}
          >
            <div className={cn("mt-0.5 text-neutral-700")}>{icon(it.kind)}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="truncate text-xs font-medium text-neutral-900">{it.title}</div>
                <Badge className="text-neutral-500">
                  {new Date(it.ts).toLocaleTimeString()}
                </Badge>
              </div>
              {it.detail && <div className="mt-1 text-xs text-neutral-500">{it.detail}</div>}
              {it.hash && (
                <div className="mt-1 font-mono text-[11px] text-neutral-600 truncate">
                  {it.hash}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
