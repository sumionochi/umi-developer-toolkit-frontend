#!/usr/bin/env node
require('dotenv').config();

const {
  Aptos,
  AptosConfig,
  Network
} = require('@aptos-labs/ts-sdk');

async function main() {
  const rawAddr = process.argv[2] || process.env.DEPLOYER_ADDR;
  if (!rawAddr) {
    console.error('Usage: npm run faucet <YOUR_EOA_ADDRESS>');
    process.exit(1);
  }

  // strip leading 0x and pad to 64 hex chars (32 bytes)
  const hex = rawAddr.toLowerCase().replace(/^0x/, '');
  const padded = hex.padStart(64, '0');
  const moveAddr = '0x' + padded;

  // configure Umi Devnet endpoints
  const config = new AptosConfig({
    network:   Network.DEVNET,
    nodeUrl:   'https://devnet.moved.network',
    faucetUrl: 'https://devnet.moved.network/faucet'
  });
  const aptos = new Aptos(config);

  console.log(`⛽️  Requesting tokens for Move address ${moveAddr}…`);
  await aptos.faucet.fundAccount({
    accountAddress: moveAddr,
    amount:         1_000_000_000
  });
  console.log('✅ Faucet top-up complete!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
