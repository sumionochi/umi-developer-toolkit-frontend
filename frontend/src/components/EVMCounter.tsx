// src/components/EVMCounter.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Wallet, Plus, CheckCircle,
  AlertCircle, Copy, ExternalLink,
} from "lucide-react";
import { toBigInt } from "ethers";
import { useChainId } from "wagmi";
import { umiDevnet, localEvm } from "@/lib/customConfig";
import {
  getAccount, getEvmFunction, publicClient, walletClient,
} from "@/lib/sol-config";
import { hexToBytes } from 'viem';
import localJson from "@/../../cache/local-counter.json" assert { type: "json" };


export default function EVMCounter() {
  const chainId = useChainId();
  const chain = chainId === localEvm.id ? localEvm : umiDevnet;

  const [addr, setAddr] = useState(localJson.address || "");
  const [value, setValue] = useState<number>();
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  const isValidAddress = /^0x[0-9a-fA-F]{40}$/.test(addr);

  console.log(`[EVMCounter] current chain ID: ${chainId}`, "chain:", chain.name);
  useEffect(() => console.log(`[EVMCounter] Address changed:`, addr), [addr]);

  const refresh = async () => {
    try {
      setError("");
      const { to, data } = await getEvmFunction("count", addr as `0x${string}`, chain);
      const resp = await publicClient(chain).call({ to, data });
  
      // `resp.data` might be a hex string or Uint8Array; normalize:
      const raw = resp.data;
      if (raw === undefined) {
        console.warn("[EVMCounter][refresh] resp.data is undefined; defaulting to zero");
        setValue(0);
        return;
      }
      // convert string → bytes, or use directly if already bytes
      const bytes = typeof raw === "string"
        ? hexToBytes(raw)            // decode hex string to Uint8Array :contentReference[oaicite:0]{index=0}
        : raw;
      const uints = new Uint8Array(bytes);
  
      const bn = toBigInt(uints);
      setValue(Number(bn));
    } catch (err) {
      console.error("[EVMCounter][refresh] ERROR", err);
      setError("Failed to read counter value");
    }
  };

  const connect = async () => {
    console.log("[EVMCounter][connect] start");
    try {
      setBusy(true);
      setError("");
      const acct = await getAccount();
      console.log("[EVMCounter][connect] wallet account:", acct);
      await refresh();
      setConnected(true);
    } catch (err) {
      console.error("[EVMCounter][connect] ERROR", err);
      setError("Failed to connect or read counter");
    } finally {
      setBusy(false);
    }
  };

  const increment = async () => {
    console.log("[EVMCounter][increment] start");
    try {
      setBusy(true);
      setError("");
  
      // build calldata
      const { to, data } = await getEvmFunction(
        "increment",
        addr as `0x${string}`,
        chain,
      );
  
      const acct = await getAccount();          // 0x… address
  
      // ✨ fetch the on-chain nonce
      const currentNonce = await publicClient(chain).getTransactionCount({
        address: acct,
      });
      console.log("[EVMCounter][increment] using nonce:", currentNonce);
  
      // send tx with explicit nonce
      const hash = await walletClient(chain).sendTransaction({
        account: acct,
        to,
        data,
        nonce: currentNonce,
      });
      console.log("[EVMCounter][increment] tx hash:", hash);
  
      await publicClient(chain).waitForTransactionReceipt({ hash });
      await refresh();
    } catch (err) {
      console.error("[EVMCounter][increment] ERROR", err);
      setError("Failed to increment counter");
    } finally {
      setBusy(false);
    }
  };  

  const copyAddress = () => {
    console.log("[EVMCounter] copy address:", addr);
    navigator.clipboard.writeText(addr);
  };

  return (
    <div className="w-full">
      <Card className="w-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800">
        <CardHeader className="text-center p-3 sm:p-6 pb-2 sm:pb-4">
          <div className="flex flex-col items-center space-y-2 mb-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">⚙️</span>
            </div>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-black dark:text-white">
              EVM Counter
            </CardTitle>
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            Interact with your deployed Solidity smart contract
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6 pt-0">
          {/* Address Input */}
          <div className="space-y-2">
            <Label htmlFor="contract-address" className="text-xs sm:text-sm">
              Contract Address
            </Label>
            <div className="relative">
              <Input
                id="contract-address"
                type="text"
                placeholder="0x... deployed counter address"
                value={addr}
                onChange={(e) => setAddr(e.target.value)}
                className={`text-xs sm:text-sm pr-16 sm:pr-20 ${
                  isValidAddress
                    ? "border-green-300 dark:border-green-700"
                    : addr
                    ? "border-red-300 dark:border-red-700"
                    : ""
                }`}
              />
              {addr && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <Button size="sm" variant="ghost" onClick={copyAddress} className="h-5 w-5 sm:h-6 sm:w-6 p-0">
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-5 w-5 sm:h-6 sm:w-6 p-0">
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              )}
            </div>
            {addr && !isValidAddress && (
              <p className="text-xs text-red-600 dark:text-red-400">
                Please enter a valid Ethereum address
              </p>
            )}
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-center space-x-2">
            {connected ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                  Connected
                </Badge>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs">
                  Not Connected
                </Badge>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-xs text-center break-words">
                {error}
              </p>
            </div>
          )}

          {/* Counter Value */}
          {connected && (
            <div className="text-center border p-4 sm:p-6 bg-white/10 dark:bg-gray-800/10 rounded-xl border-gray-200 dark:border-gray-700">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                Current Counter Value
              </p>
              <div className="text-4xl font-bold text-black dark:text-white">
                {value === undefined ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-lg">Loading...</span>
                  </div>
                ) : (
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {value}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!connected ? (
              <Button
                onClick={connect}
                disabled={!isValidAddress || busy}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 disabled:opacity-50"
              >
                {busy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect & Load Counter
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={increment}
                disabled={busy}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2"
              >
                {busy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Increment
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Note */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50/10 dark:bg-gray-800/10 p-2 rounded-lg">
            <p className="break-words">EVM contracts require a deployed address</p>
            <p className="break-words">Each deployment creates a new contract instance</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}