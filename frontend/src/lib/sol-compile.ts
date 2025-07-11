import { compile } from "@/sol/compiler";

/* ------------------------------------------------------------ */
/* Strip ``` fences the model often adds                         */
/* ------------------------------------------------------------ */
export function unwrapSolidity(raw: string): string {
  const match = raw.match(/```(?:solidity)?\s*([\s\S]*?)```/i);
  return (match ? match[1] : raw).trim();
}

export function stripFences(raw: string): string {
  return raw
    .replace(/^```(?:\w+)?\s*/, "") // opening ```solidity
    .replace(/```$/, ""); // closing ```
}

/* ------------------------------------------------------------ */
/* Compile Solidity via the WASM worker                          */
/* ------------------------------------------------------------ */
export async function compileSolidity(
  sourceWithFences: string
): Promise<string> {
  const source = unwrapSolidity(sourceWithFences);
  const contracts = await compile(source); // implements the worker call
  const c = contracts[0];

  return [
    "✅ Solidity compiled",
    "",
    `• Contract:   ${c.contractName}`,
    `• Byte-code:  ${c.byteCode.length / 2} bytes`,
    `• ABI items:  ${c.abi.length}`,
  ].join("\n");
}
