export const streamVaultAbi = [
  // reads
  { type: "function", name: "nextId", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalRate", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "buffer", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "bufferTarget", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "yieldEnabled", stateMutability: "view", inputs: [], outputs: [{ type: "bool" }] },
  { type: "function", name: "teller", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "usyc", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "accrued", stateMutability: "view", inputs: [{ type: "uint256" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "claimable", stateMutability: "view", inputs: [{ type: "uint256" }], outputs: [{ type: "uint256" }] },

  // writes
  {
    type: "function",
    name: "createStream",
    stateMutability: "nonpayable",
    inputs: [
      { name: "payee", type: "address" },
      { name: "rate", type: "uint256" },
      { name: "start", type: "uint40" },
      { name: "end", type: "uint40" },
    ],
    outputs: [{ type: "uint256" }],
  },
  { type: "function", name: "fund", stateMutability: "nonpayable", inputs: [{ type: "uint256" }, { type: "uint256" }], outputs: [] },
  { type: "function", name: "claim", stateMutability: "nonpayable", inputs: [{ type: "uint256" }], outputs: [{ type: "uint256" }] },
] as const;
