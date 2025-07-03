import {
  AccountAddress,
  EntryFunction,
  FixedBytes,
  TransactionPayloadEntryFunction,
} from "@aptos-labs/ts-sdk";
import { bcs } from "@mysten/bcs";
import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  type Chain,
} from "viem";
import { publicActionsL2, walletActionsL2 } from "viem/op-stack";

declare global {
  interface Window {
    ethereum?: { request: (a: { method: string }) => Promise<any> };
  }
}

/* ───────────────────────────── chain def ── */
export const devnet = defineChain({
  id: 42069,
  sourceId: 42069,
  name: "Umi",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  rpcUrls: { default: { http: ["https://devnet.uminetwork.com"] } },
});

/* ───────────────────────────── helpers ── */
export const getAccount = async () => {
  const [acct] = await window.ethereum!.request({
    method: "eth_requestAccounts",
  });
  console.log("[cfg] EOA 20-byte:", acct);
  return acct;
};

export const getMoveAccount = async () => {
  const evm = await getAccount();
  const move = evm.slice(0, 2) + "000000000000000000000000" + evm.slice(2);
  console.log("[cfg] padded Move addr:", move);
  return move;
};

/* ───────────────────────────── viem clients ── */
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

/* ───────────────────────────── payload builder ── */
export const counterPayload = async (method: string) => {
  const moveAccount = await getMoveAccount();
  const address =
    method === "get"
      ? AccountAddress.fromString(moveAccount)
      : getSigner(moveAccount);
  const entryFunction = EntryFunction.build(
    `${moveAccount}::Counter`,
    method,
    [],
    [address]
  );
  const transactionPayload = new TransactionPayloadEntryFunction(entryFunction);
  return transactionPayload.bcsToHex().toString() as `0x${string}`;
};

/* ───────────────────────────── signer helper ── */
export const getSigner = (addr: string) => {
  const bytes = [33, 0, ...AccountAddress.fromString(addr).toUint8Array()];
  console.log("[cfg] signer bytes:", bytes);
  return new FixedBytes(new Uint8Array(bytes));
};

/* ───────────────────────────── output decoder ── */
export const extractOutput = (data: `0x${string}` | undefined) => {
  console.log("[cfg] extract raw:", data);
  if (!data || typeof data === "string")
    throw new Error("No data or wrong type");

  const decoded = new Uint8Array(
    bcs
      .vector(bcs.tuple([bcs.vector(bcs.u8())]))
      .parse(new Uint8Array(data))[0][0]
  );
  console.log("[cfg] decoded bytes:", decoded);
  return decoded;
};
