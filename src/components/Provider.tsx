// src/components/Provider.tsx
"use client";

import { createConfig, WagmiProvider, http } from "wagmi";
import { injected } from "@wagmi/connectors";
import { RainbowKitProvider, darkTheme, getDefaultConfig, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { umiDevnet, localEvm } from "@/lib/customConfig";

const { wallets } = getDefaultWallets();

export const wagmiConfig = getDefaultConfig({
  appName: "Umi Developer Toolkit",
  projectId: "your-project-id", // Replace with your actual project ID
  chains: [
    umiDevnet,
    localEvm
  ],
  ssr: true,
});

export const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#00ff98",
            accentColorForeground: "black",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
