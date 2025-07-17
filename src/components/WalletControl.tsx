"use client";
import React, { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { umiDevnet, localEvm } from "@/lib/customConfig";

export function WalletControls() {
  const { isConnected, chain } = useAccount();
  const { switchChain }        = useSwitchChain();
  const { disconnect }         = useDisconnect();

  // supported if on Umi Devnet OR on Local EVM
  const onSupported =
    isConnected &&
    (chain?.id === umiDevnet.id || chain?.id === localEvm.id);

  // if they connect to anything else, send them to Devnet
  useEffect(() => {
    if (isConnected && !onSupported && switchChain) {
      switchChain({ chainId: umiDevnet.id });
    }
  }, [isConnected, onSupported, switchChain]);

  // if still not on supported chain, disconnect
  useEffect(() => {
    if (isConnected && !onSupported) {
      disconnect();
    }
  }, [isConnected, onSupported, disconnect]);

  return onSupported ? (
    <ConnectButton chainStatus="full" showBalance={true} />
  ) : (
    <ConnectButton chainStatus="none" showBalance={false} />
  );
}
