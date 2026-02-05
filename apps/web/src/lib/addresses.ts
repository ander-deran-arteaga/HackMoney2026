export const ADDR = {
  ARC_USDC: "0x3600000000000000000000000000000000000000",
  ARC_USYC: "0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C",
  ARC_TELLER: "0x9fdF14c5B14173D74C08Af27AebFf39240dC105A",
} as const;

export function isAddressLike(s: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(s);
}

export function shortAddr(a?: string) {
  if (!a) return "";
  return a.slice(0, 6) + "…" + a.slice(-4);
}
