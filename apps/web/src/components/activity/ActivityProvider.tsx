"use client";

import * as React from "react";
import { nanoid } from "nanoid";

export type ActivityItem = {
  id: string;
  ts: number;
  kind: "info" | "ok" | "warn" | "tx";
  title: string;
  detail?: string;
  hash?: `0x${string}` | string;
};

type Ctx = {
  items: ActivityItem[];
  push: (i: Omit<ActivityItem, "id" | "ts">) => void;
  clear: () => void;
};

const ActivityCtx = React.createContext<Ctx | null>(null);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ActivityItem[]>([]);

  const push = React.useCallback((i: Omit<ActivityItem, "id" | "ts">) => {
    setItems((prev) => [{ id: nanoid(), ts: Date.now(), ...i }, ...prev].slice(0, 40));
  }, []);

  const clear = React.useCallback(() => setItems([]), []);

  return <ActivityCtx.Provider value={{ items, push, clear }}>{children}</ActivityCtx.Provider>;
}

export function useActivity() {
  const ctx = React.useContext(ActivityCtx);
  if (!ctx) throw new Error("useActivity must be used within ActivityProvider");
  return ctx;
}
