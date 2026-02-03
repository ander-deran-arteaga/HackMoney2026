# <Project CouponFlow>

## What it does
- Streaming payments (USDC) with optional yield (USYC via Teller on Arc).

## Architecture
- StreamVault: streams + bufferTarget/rebalance + yield plumbing.
- Yield: vault calls Teller directly (no adapter custody).
- Poke lifecycle: closes inactive streams to keep totalRate correct.

## Quickstart (contracts)
```bash
cd contracts
forge test

Env

Create contracts/.env (or export vars in shell):

ARC_RPC_URL=...

PRIVATE_KEY=...

VAULT=...

USDC=0x3600000000000000000000000000000000000000

USYC=0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C

TELLER=0x9fdF14c5B14173D74C08Af27AebFf39240dC105A

Yield Smoke Test (Arc Testnet — USDC ↔ USYC via Teller)

Vault (StreamVault)

Address: 0x71C48710B914bF7212F38EF4C1a3c33EC0725AB4

Contracts

USDC: 0x3600000000000000000000000000000000000000

USYC: 0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C

Teller: 0x9fdF14c5B14173D74C08Af27AebFf39240dC105A

Config

setYieldConfig(teller, usyc) tx: 0xc099f3810506ca19bf834fe65747a255afdc2e02982ed1de7c6bf087d221094e

yieldEnabled: true

Deposit (USDC → USYC)

Amount: 1,000,000 (1.000000 USDC)

Before: USDC 1,000,000, USYC 0

After: USDC 0, USYC 896,253

Tx: 0x313dc042171226007e6456568cfe1064ff795659c2bb49aeef8bc247f7422007

Redeem All (USYC → USDC)

Before: USDC 0, USYC 896,253

After: USDC 999,201, USYC 0

Tx: 0x49068dd4a4b7d65c7a6a828f04eae6c05f9090fcabc491e8af27ac8db69ad2a1

Notes:

Redeem returned slightly less USDC than deposited (testnet mechanics/fees).


## `contracts/README.md` (short linker)
```md
# Contracts

Run:
```bash
forge test


Deployment/scripts live in contracts/script/.

Main documentation (including Yield Smoke Test + TxIDs) is in the repo root README.md.

::contentReference[oaicite:0]{index=0}