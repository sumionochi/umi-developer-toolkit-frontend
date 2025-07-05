// scripts/deploy-evm-local.js
require("dotenv").config();
const { ethers } = require("hardhat");
const fs   = require("fs");
const path = require("path");        

async function main() {
  // 0. Grab your deployer signer
  const [deployer] = await ethers.getSigners();

  // 1. Get the compiled contract factory
  const Factory = await ethers.getContractFactory("Counterevm");

  // 2. Fetch the current nonce
  const currentNonce = await deployer.getNonce();
  console.log("🚀 Using nonce", currentNonce, "for", deployer.address);

  // 3. Deploy with explicit nonce
  console.log("📡 Deploying Counter to local Hardhat (31337)...");
  const counter = await Factory.deploy({ nonce: currentNonce });

  // 4. Wait for it to be mined
  await counter.waitForDeployment();
  const address = await counter.getAddress();
  console.log("✅ EVM Counter deployed at:", address);

  // 5. Persist address so the front-end can auto-load it
  const outfile = path.resolve(__dirname, "../cache/local-counter.json");
  fs.mkdirSync(path.dirname(outfile), { recursive: true });
  fs.writeFileSync(outfile, JSON.stringify({ address }, null, 2));
  console.log("✨ Saved address to", outfile);
}

main().catch((err) => {
  console.error("❌ deploy-evm-local failed:", err);
  process.exit(1);
});
