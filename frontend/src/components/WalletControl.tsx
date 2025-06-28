"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { umiDevnet } from "@/lib/chains"; 
import React from "react";

export function WalletControls() {
  const { address, chain, isConnected } = useAccount();   
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  /* is the user on the right chain? */
  const onUmiDevnet = isConnected && chain?.id === umiDevnet.id;

  React.useEffect(() => {
    if (isConnected && !onUmiDevnet && switchChain) {
      switchChain({ chainId: umiDevnet.id });
    }
  }, [isConnected, onUmiDevnet, switchChain]);

  React.useEffect(() => {
    if (isConnected && !onUmiDevnet) {
      disconnect();
    }
  }, [isConnected, onUmiDevnet, disconnect]);

  return !onUmiDevnet ? (
    <ConnectButton chainStatus="none" showBalance={false} />
  ) : (
    <ConnectButton chainStatus="full" showBalance={true} />
  );
}
