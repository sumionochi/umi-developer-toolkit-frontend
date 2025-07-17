// src/lib/customConfig.ts
import { defineChain } from "viem";
import { createConfig, http } from "wagmi";
import { injected } from "@wagmi/connectors";

// 1. Chain definitions

export const umiDevnet = defineChain({
  id: 42069,
  name: "Umi Devnet",
  network: "umi-devnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://devnet.uminetwork.com"] } },
  blockExplorers: {
    default: {
      name: "Umi Explorer",
      url: "https://devnet.explorer.uminetwork.com",
    },
  },
  testnet: true,
});

export const localEvm = defineChain({
  id: 31337,
  name: "Local EVM",
  network: "local-evm",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["http://localhost:8545"] } },
  testnet: true,
});

export const localMove = defineChain({
  id: 1,
  name: "Local Move",
  network: "local-move",
  nativeCurrency: { name: "Aptos", symbol: "APT", decimals: 8 },
  rpcUrls: { default: { http: ["http://127.0.0.1:8080"] } },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [umiDevnet, localEvm] as const,
  transports: {
    [umiDevnet.id]: http("https://devnet.uminetwork.com"),
    [localEvm.id]: http("http://localhost:8545"),
  },
  connectors: [injected()],
  ssr: true,
});
