"use client";

import { useEffect, useMemo, useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEventLogs, parseUnits } from "viem";
import StreamVaultAbi from "@/lib/abi/StreamVault.json";
import { isAddressLike, USDC_DECIMALS } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Unit = "sec" | "min" | "hour" | "day";

const unitSeconds: Record<Unit, bigint> = {
  sec: 1n,
  min: 60n,
  hour: 3600n,
  day: 86400n,
};

function nowLocalDatetimeRounded() {
  const d = new Date(Date.now() + 60_000); // +1m
  d.setSeconds(0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function CreateStream({ vault }: { vault: `0x${string}` | "" }) {
  const { writeContractAsync, data: hash, isPending, error, reset } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("0.1");
  const [unit, setUnit] = useState<Unit>("hour");

  const [startMode, setStartMode] = useState<"now" | "schedule">("now");
  const [endMode, setEndMode] = useState<"duration" | "fixed">("duration");

  const [startLocal, setStartLocal] = useState("");
  const [durationN, setDurationN] = useState("1");
  const [durationUnit, setDurationUnit] = useState<Unit>("hour");
  const [endLocal, setEndLocal] = useState("");

  useEffect(() => {
    if (!mounted) return;
    const s = nowLocalDatetimeRounded();
    setStartLocal(s);
    setEndLocal(s);
  }, [mounted]);

  const derived = useMemo(() => {
    const start =
      startMode === "now"
        ? BigInt(Math.floor(Date.now() / 1000))
        : BigInt(Math.floor(new Date(startLocal || Date.now()).getTime() / 1000));

    const stop =
      endMode === "duration"
        ? start + BigInt(Math.max(1, Number(durationN || "1"))) * unitSeconds[durationUnit]
        : BigInt(Math.floor(new Date(endLocal || Date.now()).getTime() / 1000));

    let ratePerSec = 0n;
    try {
      const amt = parseUnits(amount || "0", USDC_DECIMALS); // amount in micro USDC
      ratePerSec = amt / unitSeconds[unit];
    } catch {
      ratePerSec = 0n;
    }

    return { start, stop, ratePerSec };
  }, [startMode, startLocal, endMode, endLocal, durationN, durationUnit, amount, unit]);

  const canSubmit =
    isAddressLike(vault) &&
    isAddressLike(payee) &&
    derived.stop > derived.start &&
    derived.ratePerSec > 0n;

  const parsedStreamId = useMemo(() => {
    if (!receipt.data?.logs?.length) return null;
    try {
      const ev = parseEventLogs({
        abi: StreamVaultAbi as any,
        logs: receipt.data.logs as any,
        eventName: "StreamCreated",
      });
      const first = ev?.[0] as any;
      return first?.args?.[0] != null ? String(first.args[0]) : null;
    } catch {
      return null;
    }
  }, [receipt.data]);

  async function onCreate() {
    if (!canSubmit) return;
    reset?.();

    await writeContractAsync({
      address: vault as `0x${string}`,
      abi: StreamVaultAbi as any,
      functionName: "createStream",
      args: [
        payee as `0x${string}`,
        derived.ratePerSec,
        Number(derived.start),
        Number(derived.stop),
      ],
    });
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Payee</div>
        <Input
          placeholder="0x…"
          value={payee}
          onChange={(e) => setPayee(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Rate</div>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Input
            inputMode="decimal"
            placeholder="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            className="h-10 rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/40"
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
          >
            <option value="sec">/ sec</option>
            <option value="min">/ min</option>
            <option value="hour">/ hour</option>
            <option value="day">/ day</option>
          </select>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-300/70">
          Converts to <span className="font-mono">{derived.ratePerSec.toString()}</span> units/sec (USDC decimals={USDC_DECIMALS})
        </div>
      </div>

      <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-950/30">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={startMode === "now" ? "primary" : "outline"}
            onClick={() => setStartMode("now")}
            type="button"
          >
            Start now
          </Button>
          <Button
            variant={startMode === "schedule" ? "primary" : "outline"}
            onClick={() => setStartMode("schedule")}
            type="button"
          >
            Schedule start
          </Button>
        </div>

        {startMode === "schedule" ? (
          <div className="grid gap-2">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Start time</div>
            <Input type="datetime-local" value={startLocal} onChange={(e) => setStartLocal(e.target.value)} />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            variant={endMode === "duration" ? "primary" : "outline"}
            onClick={() => setEndMode("duration")}
            type="button"
          >
            End after duration
          </Button>
          <Button
            variant={endMode === "fixed" ? "primary" : "outline"}
            onClick={() => setEndMode("fixed")}
            type="button"
          >
            End at time
          </Button>
        </div>

        {endMode === "duration" ? (
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Input
              inputMode="numeric"
              placeholder="1"
              value={durationN}
              onChange={(e) => setDurationN(e.target.value)}
            />
            <select
              className="h-10 rounded-2xl border border-slate-200 bg-white/70 px-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/40"
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value as Unit)}
            >
              <option value="min">minutes</option>
              <option value="hour">hours</option>
              <option value="day">days</option>
            </select>
          </div>
        ) : (
          <div className="grid gap-2">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">End time</div>
            <Input type="datetime-local" value={endLocal} onChange={(e) => setEndLocal(e.target.value)} />
          </div>
        )}

        <div className="text-[11px] text-slate-500 dark:text-slate-300/70">
          start=<span className="font-mono">{derived.start.toString()}</span>{" "}
          stop=<span className="font-mono">{derived.stop.toString()}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onCreate} loading={isPending || receipt.isLoading} disabled={!canSubmit}>
          Create stream
        </Button>

        {hash ? (
          <div className="text-xs text-slate-600 dark:text-slate-200/80">
            tx: <span className="font-mono">{hash}</span>
          </div>
        ) : null}
      </div>

      {receipt.isSuccess ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
          Confirmed ✅ {parsedStreamId ? <>streamId=<span className="font-mono">{parsedStreamId}</span></> : null}
        </div>
      ) : null}

      {(error || receipt.error) ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
          {(error ?? receipt.error)?.message}
        </div>
      ) : null}
    </div>
  );
}
