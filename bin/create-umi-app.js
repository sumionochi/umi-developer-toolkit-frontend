#!/usr/bin/env node
/* -------------------------------------------------------------------------- *
 * create-umi-app – scaffold a dual-VM counter template
 *
 *   npx create-umi-app <my-project> [--skip-install] [--faucet] [--help]
 * -------------------------------------------------------------------------- */

const fs         = require('fs-extra');
const path       = require('path');
const { execSync } = require('child_process');
const pkg        = require('../package.json');      // uses your root package.json

/* ─────────────── parse argv ─────────────────────────────────────────────── */
const argv  = process.argv.slice(2);
let project = null;
let skipInstall = false;
let runFaucet   = false;

for (const a of argv) {
  if (a === '--help' || a === '-h')       return showHelp(0);
  if (a === '--version' || a === '-v')    { console.log(pkg.version); process.exit(0); }
  if (a === '--skip-install')             { skipInstall = true; continue; }
  if (a === '--faucet')                   { runFaucet   = true; continue; }
  if (!project) { project = a; continue; }
}

if (!project) showHelp(1);

/* ─────────────── paths ──────────────────────────────────────────────────── */
const ROOT = path.resolve(__dirname, '..');        // umi-developer-toolkit/
const DST  = path.resolve(process.cwd(), project);

/* ─────────────── scaffold ───────────────────────────────────────────────── */
console.log(`\n📁  Creating ${project} …`);
fs.mkdirpSync(DST);

/* –– copy template pieces –– */
const COPY = [
  ['contracts/move',         'contracts/move'],
  ['contractsevm/evm', 'contractsevm/evm'],
  ['scripts',                'scripts'],
  ['hardhat.config.js',      'hardhat.config.js'],
  ['package.json',           'package.json'],
];

for (const [srcRel, dstRel] of COPY) {
  fs.copySync(path.join(ROOT, srcRel), path.join(DST, dstRel));
}

/* blank .env so the new user knows where to add keys */
fs.writeFileSync(path.join(DST, '.env'), '# PRIVATE_KEY=\n# DEPLOYER_ADDR=\n');

console.log('✅  Files copied');

/* ─────────────── install deps ───────────────────────────────────────────── */
if (!skipInstall) {
  console.log('📦  Installing dependencies (npm i) …');
  execSync('npm install', { cwd: DST, stdio: 'inherit' });
}

/* ─────────────── optional faucet ────────────────────────────────────────── */
if (runFaucet) {
  try {
    console.log('⛽️  Requesting devnet test tokens …');
    execSync('npm run faucet', { cwd: DST, stdio: 'inherit' });
  } catch (e) {
    console.warn('⚠️  Faucet failed (ignored for now).');
  }
}

/* ─────────────── done ───────────────────────────────────────────────────── */
/* ─────────────── done ───────────────────────────────────────────────────── */
console.log(`
  🎉  Project ready!
  
    cd ${project}
  
    # ── build & tests ───────────────────────────────────────────
    npm run compile        # compile both Move & EVM
    npm run test:move      # run Move unit tests
    npm run test:evm       # run EVM unit tests
  
    # ── deploy helpers ──────────────────────────────────────────
    npm run deploy:move    # deploy Move counter
    npm run deploy:evm     # deploy EVM counter
    npm run deploy:all     # deploy both, Move then EVM
  
    # ── devnet faucet ──────────────────────────────────────────
    npm run faucet <addr>  # top-up any address on Umi devnet
  `);
  


/* ══════════════════════════════════════════════════════════════════════════ */
function showHelp(code = 0) {
  console.log(`
create-umi-app v${pkg.version}

Usage:  npx create-umi-app <project-name> [options]

Options:
  --skip-install      Just scaffold files (no npm install)
  --faucet            Run "npm run faucet" after initial deploy
  -h, --help          Show this help
  -v, --version       Show CLI version
`);
  process.exit(code);
}
