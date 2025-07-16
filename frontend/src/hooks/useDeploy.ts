import { useState } from "react";
import { walletClient, publicClient } from "@/lib/sol-config"; // viem helpers
import { umiDevnet } from "@/lib/customConfig";
import { wrapBytecodeForUmi } from "@/lib/sol-compile";
import { getAccount } from "@/lib/sol-config";
import type { Chain } from "viem";

export function useDeploy() {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [tx, setTx] = useState<{ hash: string; address: string } | null>(null);
  const [error, setError] = useState<string>("");

  async function deploy(byteCode: `0x${string}`, chain: Chain) {
    try {
      setStatus("pending");
      setError("");

      const data =
        chain.id === umiDevnet.id ? wrapBytecodeForUmi(byteCode) : byteCode;

      const account = await getAccount();
      const hash = await walletClient(chain).sendTransaction({ account, data });
      const rec = await publicClient(chain).waitForTransactionReceipt({ hash });

      setTx({ hash, address: rec.contractAddress! });
      setStatus("success");
    } catch (e: any) {
      setError(String(e));
      setStatus("error");
    }
  }

  return { status, tx, error, deploy };
}
