// scripts/deploy-evm.js
require("dotenv").config();
const { BCS, getRustConfig } = require("@benfen/bcs");
const { ethers } = require("hardhat");

// Initialize BCS with the Rust config
const bcs = new BCS(getRustConfig());

// Register the Move-VM enum types for EVM bytecode
bcs.registerEnumType("ScriptOrDeployment", {
  Script: "",
  Module: "",
  EvmContract: "Vec<u8>",
});
bcs.registerEnumType("SerializableTransactionData", {
  EoaBaseTokenTransfer: "",
  ScriptOrDeployment: "",
  EntryFunction: "",
  L2Contract: "",
  EvmContract: "Vec<u8>",
});

// Helper to wrap raw bytecode in the Move-VM enum
function serialize(bytecode) {
  const buf = Uint8Array.from(Buffer.from(bytecode.replace(/^0x/, ""), "hex"));
  const evmContract = bcs.ser("ScriptOrDeployment", { EvmContract: buf });
  return "0x" + evmContract.toString("hex");
}

async function main() {
  // 1. Compile & serialize
  const Factory = await ethers.getContractFactory("Counterevm");
  const code = serialize(Factory.bytecode);
  console.log("Serialized CODE:", code);

  // 2. Deploy via raw transaction (not .deploy())
  const [deployer] = await ethers.getSigners();
  console.log("Deploying EVM Counter with:", deployer.address);
  const tx = await deployer.sendTransaction({ data: code });
  console.log("Deployment tx hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("Counter deployed at:", receipt.contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
