// lib/sol-config.ts
import { BCS, getRustConfig } from "@benfen/bcs";
import { ethers } from "ethers";
import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  type EIP1193Provider,
} from "viem";
import { publicActionsL2, walletActionsL2 } from "viem/op-stack";
import { abi } from "../../../artifacts/contractsevm/evm/Counterevm.sol/Counterevm.json";

declare global {
  interface Window {
    ethereum?: { request: (a: { method: string }) => Promise<any> };
  }
}

/* ---------------------- chain ---------------------- */
export const devnet = defineChain({
  id: 42069,
  sourceId: 42069,
  name: "Umi",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  rpcUrls: { default: { http: ["https://devnet.uminetwork.com"] } },
});

/* ---------------------- helpers ---------------------- */
export const getAccount = async () => {
  const [acct] = await window.ethereum!.request({
    method: "eth_requestAccounts",
  });
  return acct as `0x${string}`;
};

/* ---------------------- viem clients ---------------------- */
export const publicClient = () =>
  createPublicClient({
    chain: devnet,
    transport: custom(window.ethereum!),
  }).extend(publicActionsL2());

export const walletClient = () =>
  createWalletClient({
    chain: devnet,
    transport: custom(window.ethereum!),
  }).extend(walletActionsL2());

/* ---------------------- BCS wrapper ---------------------- */
const bcs = new BCS(getRustConfig());
bcs.registerEnumType("SerializableTransactionData", {
  EoaBaseTokenTransfer: "",
  ScriptOrDeployment: "",
  EntryFunction: "",
  L2Contract: "",
  EvmContract: "Vec<u8>",
});

const serialize = (data: string): `0x${string}` => {
  const bytes = Uint8Array.from(Buffer.from(data.replace("0x", ""), "hex"));
  const blob = bcs.ser("SerializableTransactionData", { EvmContract: bytes });
  return `0x${blob.toString("hex")}`;
};

/* ---------------------- main util ---------------------- */
export const getEvmFunction = async (
  name: "count" | "increment",
  contract: `0x${string}`
) => {
  const counter = new ethers.Contract(contract, abi);
  const tx = await counter.getFunction(name).populateTransaction();
  return { to: tx.to as `0x${string}`, data: serialize(tx.data as string) };
};
