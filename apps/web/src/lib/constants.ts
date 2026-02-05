export const ADDR = {
  // tokens you already had
  ARC_USDC: "0x3600000000000000000000000000000000000000",
  ARC_USYC: "0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C",
  ARC_TELLER: "0x9fdF14c5B14173D74C08Af27AebFf39240dC105A",

  // StreamVault you are actually using (from your receipts)
  ARC_STREAM_VAULT: "0x27d3A90FFc2beb44F6641bB1489b13F4069897Ae",
} as const;

export const USDC_DECIMALS = 6;

export function isAddressLike(s: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(s);
}
