#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');

// Usage check
const projectName = process.argv[2];
if (!projectName) {
  console.error('Usage: create-umi-app <project-name>');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');
const DEST = path.resolve(process.cwd(), projectName);

// 1) Make project folder
fs.mkdirpSync(DEST);

// 2) Copy over only the parts a fresh counter-app needs
fs.copySync(path.join(ROOT, 'contracts/move'), path.join(DEST, 'contracts/move'));
fs.copySync(path.join(ROOT, 'contractsevm/evm'),           path.join(DEST, 'contracts/evm'));
fs.copySync(path.join(ROOT, 'scripts'),       path.join(DEST, 'scripts'));
fs.copySync(path.join(ROOT, 'hardhat.config.js'),      path.join(DEST, 'hardhat.config.js'));
fs.copySync(path.join(ROOT, '.env'),           path.join(DEST, '.env'));
fs.copySync(path.join(ROOT, 'package.json'),           path.join(DEST, 'package.json'));

// 3) Install deps in the new project
console.log(`\n🛠  Installing dependencies in ./${projectName}…`);
execSync('npm install', { cwd: DEST, stdio: 'inherit' });

console.log(`\n✅  All done!  
➜ cd ${projectName}
➜ npm run compile        # compile both Move & EVM
➜ npm run deploy:move    # deploy Move counter
➜ npm run deploy:evm     # deploy EVM counter
`);
