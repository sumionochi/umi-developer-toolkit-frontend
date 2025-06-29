// scripts/deploy-evm-local.js
require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  // 1. Get the compiled EVM Counter contract factory
  const Factory = await ethers.getContractFactory("Counterevm");
  // 2. Deploy to your local Hardhat node
  console.log("Deploying EVM Counter to local Hardhat (chainId 31337)...");
  const counter = await Factory.deploy();
  // 3. Wait for the deployment transaction to be mined
  await counter.waitForDeployment();
  // 4. Retrieve and log the deployed address
  const address = await counter.getAddress();
  console.log("✅ EVM Counter deployed at:", address);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ deploy-evm-local failed:", err);
    process.exit(1);
  });
