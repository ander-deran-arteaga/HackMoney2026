"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/Button";

export function Connect() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const visible = useMemo(() => connectors, [connectors]);

  // IMPORTANT: render the same HTML on server + first client paint
  if (!mounted) {
    return <div className="h-10 w-44 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />;
  }

  if (!isConnected) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-2">
        {visible.map((c: any) => (
          <Button
            key={c.uid ?? c.id ?? c.name}
            variant="outline"
            loading={isPending}
            onClick={() => connect({ connector: c })}
          >
            {c.name}
          </Button>
        ))}
        {error ? (
          <div className="w-full text-xs text-rose-600 dark:text-rose-400">
            {error.message}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <div className="rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 text-xs text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
        <div className="font-semibold">Connected</div>
        <div className="font-mono">{address}</div>
        {chain?.id ? <div className="mt-1 text-[11px] opacity-80">chainId: {chain.id}</div> : null}
      </div>
      <Button variant="outline" onClick={() => disconnect()}>
        Disconnect
      </Button>
    </div>
  );
}
