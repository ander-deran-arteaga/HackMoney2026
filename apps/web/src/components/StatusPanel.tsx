"use client";

import { useAccount, useReadContract } from "wagmi";
import StreamVaultAbi from "@/lib/abi/StreamVault.json";
import { isAddressLike } from "@/lib/constants";
import { useEffect, useState } from "react";

export function StatusPanel({ vault, usyc }: { vault: `0x${string}` | ""; usyc: `0x${string}` | "" }) {
  const { chain } = useAccount();

  // ✅ prevent SSR/client text mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const buffer = useReadContract({
    address: isAddressLike(vault) ? (vault as `0x${string}`) : undefined,
    abi: StreamVaultAbi as any,
    functionName: "buffer",
    query: { enabled: mounted && isAddressLike(vault), refetchInterval: 2500 },
  });

  const yieldEnabled = useReadContract({
    address: isAddressLike(vault) ? (vault as `0x${string}`) : undefined,
    abi: StreamVaultAbi as any,
    functionName: "yieldEnabled",
    query: { enabled: mounted && isAddressLike(vault), refetchInterval: 2500 },
  });

  if (!mounted) {
    return (
      <div className="grid gap-3">
        <div className="h-20 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />
          <div className="h-20 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 text-sm">
      <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-950/30">
        <div className="text-xs text-slate-500 dark:text-slate-300/70">Connected chain</div>
        <div className="mt-1 font-mono">{chain?.id ?? "—"}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-950/30">
          <div className="text-xs text-slate-500 dark:text-slate-300/70">buffer()</div>
          <div className="mt-1 font-mono">{buffer.data?.toString() ?? "—"}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-950/30">
          <div className="text-xs text-slate-500 dark:text-slate-300/70">yieldEnabled()</div>
          <div className="mt-1 font-mono">{yieldEnabled.data?.toString() ?? "—"}</div>
        </div>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-300/70">
        USYC: <span className="font-mono">{usyc || "—"}</span>
      </div>
    </div>
  );
}
