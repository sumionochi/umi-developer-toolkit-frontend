// src/lib/sol-config.ts
import CounterJson from "../../../artifacts/contractsevm/evm/Counterevm.sol/Counterevm.json" assert { type: "json" };
import { BCS, getRustConfig } from "@benfen/bcs";
import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  type Chain,
  encodeFunctionData,
} from "viem";
import { publicActionsL2, walletActionsL2 } from "viem/op-stack";
import { umiDevnet, localEvm } from "@/lib/customConfig";

// ─── 2. ABI + BCS Serializer ────────────────────────────────────────
export const counterAbi = CounterJson.abi as readonly any[];
export const counterBytecode = CounterJson.bytecode as `0x${string}`;

const bcs = new BCS(getRustConfig());
bcs.registerEnumType("SerializableTransactionData", {
  EoaBaseTokenTransfer: "",
  ScriptOrDeployment: "",
  EntryFunction: "",
  L2Contract: "",
  EvmContract: "Vec<u8>",
});

/** Wrap raw EVM calldata in Move’s enum for Umi */
function wrapForMove(data: `0x${string}`): `0x${string}` {
  const code = Uint8Array.from(Buffer.from(data.slice(2), "hex"));
  const wrapped = bcs.ser("SerializableTransactionData", { EvmContract: code });
  return `0x${wrapped.toString("hex")}`;
}

// ─── 3. Wallet Helpers ─────────────────────────────────────────────
/** Prompt the injected wallet (Metamask/Rabby) and return the first address */
export async function getAccount(): Promise<`0x${string}`> {
  const [acct] = (await window.ethereum!.request({
    method: "eth_requestAccounts",
  })) as string[];
  return acct as `0x${string}`;
}

export async function getEvmFunction(
  method: "count" | "increment",
  contract: `0x${string}`,
  chain: Chain
): Promise<{ to: `0x${string}`; data: `0x${string}` }> {
  // 1. Use Viem to ABI-encode the function selector
  const rawData = encodeFunctionData({
    abi: counterAbi,
    functionName: method,
    args: [], // no inputs
  });

  // 2. On Umi Devnet wrap in BCS; otherwise use raw EVM calldata
  const data = chain.id === umiDevnet.id ? wrapForMove(rawData) : rawData;

  return { to: contract, data };
}

// ─── 4. RPC Clients ────────────────────────────────────────────────
export function publicClient(chain: Chain) {
  return createPublicClient({
    chain,
    transport: custom(window.ethereum!),
  }).extend(publicActionsL2());
}

export function walletClient(chain: Chain) {
  return createWalletClient({
    chain,
    transport: custom(window.ethereum!),
  }).extend(walletActionsL2());
}
