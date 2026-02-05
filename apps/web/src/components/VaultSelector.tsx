"use client";

import { useMemo, useState } from "react";
import { ADDR, isAddressLike } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function useVaultChoice() {
  const [vault, setVault] = useState<`0x${string}` | "">(ADDR.ARC_STREAM_VAULT);
  const [arcUsdc] = useState<`0x${string}` | "">(ADDR.ARC_USDC);
  const [arcUsyc] = useState<`0x${string}` | "">(ADDR.ARC_USYC);
  return { vault, setVault, arcUsdc, arcUsyc };
}

export function VaultSelector({
  vault,
  setVault,
}: {
  vault: string;
  setVault: (v: any) => void;
}) {
  const ok = useMemo(() => !vault || isAddressLike(vault), [vault]);

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <div className="mb-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
          StreamVault address
        </div>
        <Input
          className={ok ? "" : "border-rose-300 focus-visible:ring-rose-500/30 dark:border-rose-700"}
          placeholder="0x…"
          value={vault}
          onChange={(e) => setVault(e.target.value)}
        />
        {!ok ? (
          <div className="mt-1 text-xs text-rose-600 dark:text-rose-400">
            Not a valid address.
          </div>
        ) : null}
      </div>

      <div className="flex gap-2 md:justify-end">
        <Button
          variant="outline"
          onClick={() => setVault(ADDR.ARC_STREAM_VAULT)}
          title="Fill with the vault from your receipts"
        >
          Use default
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigator.clipboard?.writeText(vault)}
          disabled={!isAddressLike(vault)}
        >
          Copy
        </Button>
      </div>
    </div>
  );
}
