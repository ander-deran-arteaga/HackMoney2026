"use client";

import { Connect } from "@/components/Connect";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VaultSelector, useVaultChoice } from "@/components/VaultSelector";
import { CreateStream } from "@/components/CreateStream";
import { FundStream } from "@/components/FundStream";
import { FundFromAnyChain } from "@/components/FundFromAnyChain";
import { PayeeDashboard } from "@/components/PayeeDashboard";
import { StatusPanel } from "@/components/StatusPanel";
import { Card } from "@/components/ui/Card";
import { ARC_CHAIN_ID } from "@/lib/chains";

export default function Page() {
  const { vault, setVault, arcUsdc, arcUsyc } = useVaultChoice();

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            StreamVault <span className="text-indigo-600 dark:text-fuchsia-400">(Arc)</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-200/70">
            Create a stream, fund it with USDC, and let payees claim continuously — with fast feedback in the UI.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      <div className="grid gap-6">
        <Card
          title="Wallet"
          subtitle="Connect to start interacting"
          right={<Connect />}
        >
          <div className="text-xs text-slate-500 dark:text-slate-300/70">
            Tip: if you see hydration warnings, hard-refresh once (should be stable after the mount-gating).
          </div>
        </Card>

        <Card title="Vault" subtitle="Select the StreamVault contract you want to use">
          <VaultSelector vault={vault} setVault={setVault} />
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Create stream" subtitle="Better Start/Stop UX + parses StreamCreated from receipt">
            <CreateStream vault={vault} />
          </Card>

          <Card title="Status" subtitle="Small live reads from the contract">
            <StatusPanel vault={vault} usyc={arcUsyc} />
          </Card>

          <Card title="Fund stream" subtitle="Approve + fund with Arc USDC (two-step)">
            <FundStream vault={vault} usdc={arcUsdc} />
          </Card>

          <Card title="Payee dashboard" subtitle="See claimable and claim">
            <PayeeDashboard vault={vault} />
          </Card>
        </div>

        <Card title="Fund from any chain" subtitle={`Bridge into Arc (chainId ${ARC_CHAIN_ID})`}>
          <FundFromAnyChain toChainId={ARC_CHAIN_ID} toToken={arcUsdc} />
        </Card>
      </div>
    </main>
  );
}
