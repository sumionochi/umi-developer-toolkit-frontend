//   src/sol/compiler.ts

interface AbiIO {
  indexed?: boolean;
  internalType: string;
  name: string;
  type: string;
}

interface Abi {
  input: AbiIO[];
  output: AbiIO[];
  name: string;
  stateMutability: string;
  type: string;
  anonymous?: boolean;
}

export interface ContractData {
  contractName: string;
  byteCode: string;
  abi: Abi[];
}

/** Compile Solidity source code in a dedicated web-worker. */
export const compile = (contractCode: string): Promise<ContractData[]> => {
  return new Promise((resolve, reject) => {
    // NOTE: new URL(…, import.meta.url) → correct path after bundling
    const worker = new Worker(new URL("./solc.worker.ts", import.meta.url), {
      type: "module",
    });

    worker.onmessage = (e) => {
      const { output } = e.data as { output: any };

      // Basic validation
      if (!output.contracts) {
        if (output.errors?.length) {
          reject(output.errors[0].formattedMessage);
        } else {
          reject("Invalid source code");
        }
        return;
      }

      const result: ContractData[] = [];
      for (const contractName in output.contracts["contract"]) {
        const c = output.contracts["contract"][contractName];
        result.push({
          contractName,
          byteCode: c.evm.bytecode.object,
          abi: c.abi,
        });
      }
      resolve(result);
    };

    worker.onerror = reject;

    // Kick off compilation
    worker.postMessage({ contractCode });
  });
};
