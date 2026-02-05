"use client";

import { useMemo, useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import StreamVaultAbi from "@/lib/abi/StreamVault.json";
import { ADDR, USDC_DECIMALS, isAddressLike } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export function FundStream({ vault, usdc }: { vault: `0x${string}` | ""; usdc: `0x${string}` | "" }) {
  const { address } = useAccount();
  const [streamId, setStreamId] = useState("");
  const [amount, setAmount] = useState("5");

  const approveTx = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash: approveTx.data });

  const fundTx = useWriteContract();
  const fundReceipt = useWaitForTransactionReceipt({ hash: fundTx.data });

  const can = useMemo(() => {
    return (
      isAddressLike(vault) &&
      isAddressLike(usdc || ADDR.ARC_USDC) &&
      !!address &&
      Number(streamId) > 0 &&
      Number(amount) > 0
    );
  }, [vault, usdc, address, streamId, amount]);

  async function onApprove() {
    await approveTx.writeContractAsync({
      address: (usdc || ADDR.ARC_USDC) as `0x${string}`,
      abi: ERC20_ABI as any,
      functionName: "approve",
      args: [vault as `0x${string}`, parseUnits(amount, USDC_DECIMALS)],
    });
  }

  async function onFund() {
    await fundTx.writeContractAsync({
      address: vault as `0x${string}`,
      abi: StreamVaultAbi as any,
      functionName: "fund",
      args: [BigInt(streamId), parseUnits(amount, USDC_DECIMALS)],
    });
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="mb-1 text-xs font-semibold text-slate-700 dark:text-slate-200">Stream ID</div>
          <Input inputMode="numeric" placeholder="2" value={streamId} onChange={(e) => setStreamId(e.target.value)} />
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold text-slate-700 dark:text-slate-200">Amount (USDC)</div>
          <Input inputMode="decimal" placeholder="5" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onApprove} disabled={!can} loading={approveTx.isPending || approveReceipt.isLoading}>
          Approve
        </Button>
        <Button onClick={onFund} disabled={!can || !approveReceipt.isSuccess} loading={fundTx.isPending || fundReceipt.isLoading}>
          Fund
        </Button>
      </div>

      {approveReceipt.isSuccess ? (
        <div className="text-xs text-emerald-600 dark:text-emerald-300">Approve confirmed ✅</div>
      ) : null}
      {fundReceipt.isSuccess ? (
        <div className="text-xs text-emerald-600 dark:text-emerald-300">Fund confirmed ✅</div>
      ) : null}

      {(approveTx.error || fundTx.error || approveReceipt.error || fundReceipt.error) ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
          {(approveTx.error ?? fundTx.error ?? approveReceipt.error ?? fundReceipt.error)?.message}
        </div>
      ) : null}
    </div>
  );
}
