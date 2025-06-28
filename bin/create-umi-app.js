#!/usr/bin/env node
/* -------------------------------------------------------------------------- *
 * create-umi-app – scaffold a dual-VM counter template
 *
 *   npx create-umi-app <my-project> [--skip-install] [--faucet] [--help]
 * -------------------------------------------------------------------------- */

const fs          = require('fs-extra');
const path        = require('path');
const { execSync } = require('child_process');
const readline    = require('readline');                    // NEW
const pkg         = require('../package.json');

/* ─────────────── tiny helper to ask a question ──────────────────────────── */
async function ask(q) {                                     // NEW
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(res => rl.question(q, ans => { rl.close(); res(ans.trim()); }));
}

/* ─────────────── parse argv ─────────────────────────────────────────────── */
const argv  = process.argv.slice(2);
let project = null;
let skipInstall = false;
let runFaucet   = false;

for (const a of argv) {
  if (a === '--help'    || a === '-h')    return showHelp(0);
  if (a === '--version' || a === '-v')    { console.log(pkg.version); process.exit(0); }
  if (a === '--skip-install')             { skipInstall = true; continue; }
  if (a === '--faucet')                   { runFaucet   = true; continue; }
  if (!project)                           { project = a; continue; }
}

/* ─────────────── interactive prompt if name missing ─────────────────────── */
(async () => {                      
  const isTTY = process.stdin.isTTY && process.stdout.isTTY;      // NEW – wrap main flow in async IIFE
  if (!project) {
    if (!isTTY) {
      console.error('\n❌  Please pass a project name (non-interactive mode).\n' +
                    '    Example: npx create-umi-app my-dapp');
      process.exit(1);
    }
    project = await ask('\n🛠  Enter the project name: ');
    if (!project) {
      console.error('❌  A project name is required.');
      process.exit(1);
    }
  }

  /* ─────────────── paths ───────────────────────────────────────────────── */
  const ROOT = path.resolve(__dirname, '..');
  const DST  = path.resolve(process.cwd(), project);

  /* stop if dir exists */
  if (fs.existsSync(DST) && fs.readdirSync(DST).length) {   // NEW
    console.error(`❌  Directory "${project}" already exists and is not empty.`);
    process.exit(1);
  }

  /* ─────────────── scaffold ────────────────────────────────────────────── */
  console.log(`\n📁  Creating ${project} …`);
  fs.mkdirpSync(DST);

  const COPY = [
    ['contracts/move',            'contracts/move'],
    ['contractsevm/evm',          'contractsevm/evm'],
    ['scripts',                   'scripts'],
    ['frontend',                  'frontend'],
    ['.gitignore',                '.gitignore'],
    ['hardhat.config.js',         'hardhat.config.js'],
    ['package.json',              'package.json'],
  ];

  for (const [srcRel, dstRel] of COPY) {
    fs.copySync(path.join(ROOT, srcRel), path.join(DST, dstRel));
  }

  fs.writeFileSync(path.join(DST, '.env'), '# PRIVATE_KEY=\n# DEPLOYER_ADDR=\n');
  console.log('✅  Files copied');

  /* ─────────────── install deps ───────────────────────────────────────── */
  if (!skipInstall) {
    console.log('📦  Installing dependencies (npm i) …');
    execSync('npm install', { cwd: DST, stdio: 'inherit' });
  }

  /* ─────────────── optional faucet ────────────────────────────────────── */
  if (runFaucet) {
    try {
      console.log('⛽️  Requesting devnet test tokens …');
      execSync('npm run faucet', { cwd: DST, stdio: 'inherit' });
    } catch (_) {
      console.warn('⚠️  Faucet failed (ignored for now).');
    }
  }

  /* ─────────────── done ───────────────────────────────────────────────── */
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
})();                                                         // NEW – end IIFE

/* ══════════════════════════════════════════════════════════════════════════ */
function showHelp(code = 0) {
  console.log(`
create-umi-app v${pkg.version}

Usage:  npx create-umi-app <project-name> [options]

Options:
  --skip-install      Just scaffold files (no npm install)
  --faucet            Run "npm run faucet" after scaffold
  -h, --help          Show this help
  -v, --version       Show CLI version
`);
  process.exit(code);
}
