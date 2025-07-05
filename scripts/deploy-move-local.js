// scripts/deploy-move-local.js
const { execSync } = require("child_process");
const path = require("path");

async function main() {
  const pkgDir = path.resolve(__dirname, "../contracts/move");
  console.log("📦 Publishing Move module (local profile)…");

  execSync(
    [
      "aptos move publish",
      `--package-dir ${pkgDir}`,
      "--profile local",         // ← use the local profile
      "--dev",                   // enables [dev-addresses]
      "--assume-yes"
    ].join(" "),
    { stdio: "inherit" }
  );

  console.log("✅ Move module published on localnet");
}

main();
