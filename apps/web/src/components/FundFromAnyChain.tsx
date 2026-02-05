"use client";

import { Button } from "@/components/ui/Button";

export function FundFromAnyChain({ toChainId, toToken }: { toChainId: number; toToken: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-slate-700 dark:text-slate-200">
        Bridge into chain <span className="font-mono">{toChainId}</span>, token{" "}
        <span className="font-mono">{toToken}</span>
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-300/70">
        (Placeholder) If you want LiFi/Widget embedded, tell me which package/version you want to standardize on.
      </div>
      <Button
        variant="outline"
        onClick={() => window.open("https://jumper.exchange/", "_blank")}
      >
        Open bridge (Jumper)
      </Button>
    </div>
  );
}
