// scripts/deploy-move-local.js
const { execSync } = require("child_process");
const path = require("path");

async function main() {
  const pkgDir = path.resolve(__dirname, "../contracts/move");

  console.log("Publishing Move module to local Move testnet...");
  // Assuming you have Counter named-address in Move.toml
  // and `aptos` CLI in your PATH
  execSync(
    `aptos move publish --package-dir ${pkgDir} --named-addresses Counter=0x1 --assume-yes`,
    { stdio: "inherit" }
  );

  console.log("✅ Move module published locally under address 0x1::Counter");
}

main();
