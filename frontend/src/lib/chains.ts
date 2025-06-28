// src/lib/chains.ts
import { defineChain } from "viem"; // wagmi v2 way

export const umiDevnet = defineChain({
  id: 42069,
  name: "Umi Devnet",
  network: "umi-devnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://devnet.moved.network"] },
    public: { http: ["https://devnet.moved.network"] },
  },
  blockExplorers: {
    default: {
      name: "Umi Explorer",
      url: "https://devnet.explorer.moved.network",
    },
  },
  testnet: true,
});
