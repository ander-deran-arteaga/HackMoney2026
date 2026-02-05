"use client";

import { useMemo, useState } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import StreamVaultAbi from "@/lib/abi/StreamVault.json";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { isAddressLike } from "@/lib/constants";

export function PayeeDashboard({ vault }: { vault: `0x${string}` | "" }) {
  const [streamId, setStreamId] = useState("");

  const claimable = useReadContract({
    address: isAddressLike(vault) ? (vault as `0x${string}`) : undefined,
    abi: StreamVaultAbi as any,
    functionName: "claimable",
    args: streamId ? [BigInt(streamId)] : undefined,
    query: { enabled: isAddressLike(vault) && Number(streamId) > 0, refetchInterval: 1500 },
  });

  const claimTx = useWriteContract();
  const claimReceipt = useWaitForTransactionReceipt({ hash: claimTx.data });

  const canClaim = useMemo(() => isAddressLike(vault) && Number(streamId) > 0, [vault, streamId]);

  async function onClaim() {
    await claimTx.writeContractAsync({
      address: vault as `0x${string}`,
      abi: StreamVaultAbi as any,
      functionName: "claim",
      args: [BigInt(streamId)],
    });
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Stream ID</div>
        <Input inputMode="numeric" placeholder="2" value={streamId} onChange={(e) => setStreamId(e.target.value)} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 text-sm dark:border-slate-800 dark:bg-slate-950/30">
        <div className="text-xs text-slate-500 dark:text-slate-300/70">Claimable (raw units)</div>
        <div className="mt-1 font-mono text-slate-900 dark:text-slate-50">
          {claimable.isLoading ? "…" : (claimable.data?.toString() ?? "0")}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onClaim} disabled={!canClaim} loading={claimTx.isPending || claimReceipt.isLoading}>
          Claim
        </Button>
        {claimReceipt.isSuccess ? <span className="text-xs text-emerald-600 dark:text-emerald-300">Confirmed ✅</span> : null}
      </div>

      {(claimTx.error || claimReceipt.error) ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
          {(claimTx.error ?? claimReceipt.error)?.message}
        </div>
      ) : null}
    </div>
  );
}
