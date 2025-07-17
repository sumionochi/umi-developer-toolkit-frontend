/* ---------------------------------------------------------------------------
   lib/sol-compile.ts  —  Compile & Deploy Solidity to Umi Devnet (legacy tx)
--------------------------------------------------------------------------- */
import { compile } from "@/sol/compiler";
import type { Abi, Address, Hex } from "viem";
import {
  defineChain,
  createPublicClient,
  createWalletClient,
  custom,
  http,
  getAddress,
} from "viem";
import { addChain, switchChain } from "viem/actions"; // ◀ new
import { bcs } from "@mysten/bcs";
import { parseGwei } from "viem/utils"; // helper

/* ── tiny util ── */
export const stripFences = (s: string) =>
  s
    .replace(/^```(?:\w+)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

/* ── compile ── */
export interface CompiledContract {
  contractName: string;
  bytecode: `0x${string}`;
  abi: Abi;
}
export async function compileSolidity(src: string): Promise<CompiledContract> {
  const [first] = await compile(stripFences(src));
  return {
    contractName: first.contractName,
    bytecode: ("0x" + first.byteCode) as `0x${string}`,
    abi: first.abi as Abi,
  };
}

/* ── Umi Devnet chain ── */
export const umiDevnet = defineChain({
  id: 42069,
  name: "Umi Devnet",
  network: "umi-devnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://devnet.uminetwork.com"] } },
  blockExplorers: {
    default: {
      name: "Umi Explorer",
      url: "https://devnet.explorer.uminetwork.com",
    },
  },
  testnet: true,
});

/* ── BCS enum ── */
const TxEnum = bcs.enum("SerializableTransactionData", {
  EoaBaseTokenTransfer: bcs.vector(bcs.u8()),
  ScriptOrDeployment: bcs.vector(bcs.u8()),
  EntryFunction: bcs.vector(bcs.u8()),
  L2Contract: bcs.vector(bcs.u8()),
  EvmContract: bcs.vector(bcs.u8()),
});
const wrapBytecode = (code: `0x${string}`): `0x${string}` => {
  const raw = Uint8Array.from(Buffer.from(code.slice(2), "hex"));
  const ser = TxEnum.serialize({ EvmContract: raw }).toBytes();
  return ("0x" + Buffer.from(ser).toString("hex")) as `0x${string}`;
};

/* ── deploy ── */
export async function deployToUmi(
  compiled: CompiledContract
): Promise<{ address: Address; txHash: Hex }> {
  if (typeof window === "undefined" || !window.ethereum)
    throw new Error("window.ethereum missing");

  /* 1️⃣  clients bound to injected provider */
  const wallet = createWalletClient({
    chain: umiDevnet,
    transport: custom(window.ethereum),
  });
  const publicClient = createPublicClient({
    chain: umiDevnet,
    transport: http(),
  });

  /* 2️⃣  request accounts & permissions (ensures Rabby marks site “connected”) */
  await window.ethereum.request({
    method: "wallet_requestPermissions",
    params: [{ eth_accounts: {} }],
  });

  const [account] = (await wallet.request({
    method: "eth_requestAccounts",
  })) as Address[];
  if (!account) throw new Error("No account unlocked");

  /* 3️⃣  make sure wallet is on Umi Devnet */
  const current = parseInt(
    (await wallet.request({ method: "eth_chainId" })) as string,
    16
  );
  if (current !== umiDevnet.id) {
    try {
      await switchChain(wallet, { id: umiDevnet.id });
    } catch (err: any) {
      if (err?.code === 4902) {
        // unknown chain
        await addChain(wallet, { chain: umiDevnet });
        await switchChain(wallet, { id: umiDevnet.id });
      } else throw err;
    }
  }

  /* 4️⃣  send **legacy** tx (gasPrice forces type‑0) */
  const txHash = await wallet.sendTransaction({
    account,
    chain: umiDevnet,
    data: wrapBytecode(compiled.bytecode),
    gas: BigInt(2_500_000),
    gasPrice: parseGwei("15"),
  });

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  const contractAddress = getAddress((receipt as any).contractAddress);
  return { address: contractAddress, txHash };
}

/* ── convenience ── */
export async function compileAndDeploy(src: string) {
  return deployToUmi(await compileSolidity(src));
}
