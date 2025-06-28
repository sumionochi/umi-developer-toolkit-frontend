// src/components/Provider.tsx
"use client";

import { createConfig, http, WagmiProvider } from 'wagmi';
import { injected } from '@wagmi/connectors';              
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { umiDevnet } from '@/lib/chains';                 

/** wagmi config */
const config = createConfig({
  chains: [umiDevnet],                                     
  transports: {                                            
    [umiDevnet.id]: http('https://devnet.moved.network'),
  },
  connectors: [injected()],                                
  ssr: true,
});

export const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={umiDevnet}
          theme={darkTheme({
            accentColor: '#00ff98',
            accentColorForeground: 'black',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
