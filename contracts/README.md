## Yield Smoke Test (Arc Testnet — USDC ↔ USYC via Teller)

**Vault (StreamVault)**
- Address: `0x71C48710B914bF7212F38EF4C1a3c33EC0725AB4`

**Contracts**
- USDC: `0x3600000000000000000000000000000000000000`
- USYC: `0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C`
- Teller: `0x9fdF14c5B14173D74C08Af27AebFf39240dC105A`

### Config
- `setYieldConfig(teller, usyc)` tx: `0xc099f3810506ca19bf834fe65747a255afdc2e02982ed1de7c6bf087d221094e`
- `yieldEnabled`: `true`

---

### Deposit (USDC → USYC)

**Amount deposited**
- `1,000,000` (USDC has 6 decimals → **1.000000 USDC**)

**Balances**
- Before:
  - USDC(vault): `1,000,000`
  - USYC(vault): `0`
- After:
  - USDC(vault): `0`
  - USYC(vault): `896,253`

**TxID**
- `0x313dc042171226007e6456568cfe1064ff795659c2bb49aeef8bc247f7422007`

---

### Redeem All (USYC → USDC)

**Balances**
- Before:
  - USDC(vault): `0`
  - USYC(vault): `896,253`
- After:
  - USDC(vault): `999,201`
  - USYC(vault): `0`

**TxID**
- `0x49068dd4a4b7d65c7a6a828f04eae6c05f9090fcabc491e8af27ac8db69ad2a1`

---

### Notes
- Redeem returned slightly less USDC than deposited (**999,201 vs 1,000,000**) due to protocol mechanics / pricing / fees on testnet.
- This validates the full roundtrip path: **Vault (USDC) → Teller deposit → Vault (USYC) → Teller redeem → Vault (USDC)**.
