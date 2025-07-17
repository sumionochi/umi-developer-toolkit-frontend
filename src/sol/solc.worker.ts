/*  tiny WASM-only worker – fetched once, reused                         */
/*  ⚠️  if your network blocks the CDN, `npm i solc` and import local     */

importScripts("https://binaries.soliditylang.org/bin/soljson-latest.js");
import wrapper from "solc/wrapper";

let compiler: any; // cached

self.onmessage = ({ data }) => {
  const { contractCode } = data;
  console.log("[Worker] received code, bytes:", contractCode.length);

  compiler ??= wrapper((self as any).Module); // init once

  const input = {
    language: "Solidity",
    sources: { contract: { content: contractCode } },
    settings: { outputSelection: { "*": { "*": ["*"] } } },
  };

  const output = JSON.parse(compiler.compile(JSON.stringify(input)));
  console.log("[Worker] compile done, errors:", output.errors?.length);

  self.postMessage({ output });
};
