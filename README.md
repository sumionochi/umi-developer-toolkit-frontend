# 🖰 Umi Developer Toolkit

> **Create, test & ship dual‑VM apps on Umi in minutes, not days**

[![npm](https://img.shields.io/npm/v/create-umi-app?color=cb3837&label=npm%20%F0%9F%93%85)](https://www.npmjs.com/package/create-umi-app)
![CI](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)

---

## ✨ What's Inside?

| Layer                             | What You Get                                                                   | Key Files                                                |
| --------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------- |
| **`create-umi-app` CLI**          | One command → fully‑wired dual‑VM project                                      | `bin/create-umi-app.js`                                  |
| **Contracts (Move + EVM)**        | Dual Counter contracts — `Counter.move` (Move) and `Counterevm.sol` (Solidity) | `contracts/move/...`, `contracts/evm/...`                |
| **Hardhat + Aptos CLI**           | Compile, test & deploy both VMs with one config                                | `hardhat.config.js`, `scripts/*`                         |
| **End-to-End Tests**              | JS tests for Solidity + Move unit tests                                        | `test/Counter.test.js`, `contracts/move/tests/Test.move` |
| **Frontend (Next 15 + Tailwind)** | React page that talks to both counters via Viem & ts-sdk                       | `frontend/src/components/...`                            |
| **Faucet Helper**                 | `npm run faucet <addr>` to fund Devnet wallets                                 | `scripts/faucet.js`                                      |
| **umiIDE _(coming in v1.1)_**     | In-browser Monaco IDE, MoveAI & SolidityAI assistants                          | `frontend/pages/ide` (stub)                              |

---

## 🚀 Why It Matters — _Umi Try-a-thon_ Pitch

- **Zero-to-Deployed in < 3 min**

```bash
npx create-umi-app hello-umi
cd hello-umi
npm run compile && npm run deploy:all
```

...and see _both_ counters live on **Umi Devnet**.

- **Dual-VM Storyline**
  Showcases **Move ⭬ EVM parity**: identical APIs, identical UI, identical test UX.

- **Real-world Polish**
  Hardhat, Foundry-style gas reports, faucet script, CI-ready commands – not a toy repo.

- **Future-proof**
  `umiIDE` plug-in lands next week: live Monaco editor, one-click compile/deploy, and AI code completion for both Move & Solidity.

> **Outcome for Umi:** Hackathon teams can fork this, swap the counter for their own modules, and focus **100%** on product logic instead of plumbing.

---

## 🏗️ Quick Start

### 1. Scaffold a Fresh Project

```bash
npx create-umi-app my-counter
cd my-counter
```

CLI does:

- Copies Move + Solidity templates
- Drops Hardhat config for `https://devnet.uminetwork.com`
- Installs all deps: Hardhat, @moved plugin, ts-sdk, Viem, Next, Tailwind, etc.
- Prints next steps

### 1.5 Configure Secrets

After scaffolding (step 1) but **before compile/deploy**, create a `.env` file at the root:

```dotenv
# 👉 Devnet burner wallet recommended
PRIVATE_KEY="0xabc123…"
PUBLIC_KEY_DEPLOYER_ADDR="0xYourEOA20Byte"
```

- `PRIVATE_KEY` – used by Hardhat scripts (`hardhat.config.js`)
- `PUBLIC_KEY_DEPLOYER_ADDR` – used by faucet & explorer links

### 2. Compile Both VMs

```bash
npm run compile
```

- Solidity artifacts → `artifacts/`
- Move bytecode → `contracts/move/build/`

### 3. Deploy

```bash
# run separately…
npm run deploy:move
npm run deploy:evm
# …or the convenience macro
npm run deploy:all     # same as: deploy:evm && deploy:move
```

- EVM: wraps bytecode with BCS, sends `SerializableTransactionData`
- Move: publishes `Counter` module and sends `initialize` entry-tx

### 4. Fund Your Account (Optional)

```bash
npm run faucet 0xYourEOA
```

### 5. Spin Up the Web App

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to interact with both counters using Rabby or MetaMask Flash.

---

## 📂 Project Layout

```
umi-developer-toolkit/
├─ bin/                      # CLI launcher
├─ contracts/
│  ├─ move/                 # Move Counter
│  └─ evm/                  # Solidity Counter
├─ scripts/                 # deploy-evm.js, deploy-move.js, faucet.js
├─ test/                    # Hardhat tests
├─ frontend/                # Next.js 15 app (app router)
└─ hardhat.config.js        # Shared config for both VMs
```

---

## 🔧 Top-level Commands

| Script                | Description                              |
| --------------------- | ---------------------------------------- |
| `npm run compile`     | Compile Move + EVM via Hardhat/@moved    |
| `npm run deploy:evm`  | Deploy Solidity bytecode to Umi Devnet   |
| `npm run deploy:move` | Publish Move module + initialize counter |
| `npm run deploy:all`  | Run both deploy scripts in sequence      |
| `npm run test:evm`    | Run Hardhat unit tests                   |
| `npm run test:move`   | Run Move unit tests (`aptos move test`)  |
| `npm run faucet`      | Top-up Devnet EOA with ETH               |

Frontend also supports:

```bash
npm run dev
```

---

## 🚧 Roadmap to v1.1

| ETA     | Feature                                                       |
| ------- | ------------------------------------------------------------- |
| +2 days | `umiIDE` route: Monaco editor, tabs, Compile + Deploy buttons |
| +2 days | MoveAI / SolidityAI chat sidebar (doc embedding powered)      |
| +4 days | "Open in umiIDE" badge in scaffold README                     |
| +5 days | Dockerfile + GitHub Action for PR previews                    |

---

## 📝 Contributing

1. Clone: `git clone https://github.com/your-handle/umi-developer-toolkit`
2. Install deps: `npm i`
3. Link CLI: `npm link`
4. PRs welcome! Run:

```bash
npm run lint && npm run test:evm && npm run test:move
```

before pushing.

---

## ⚖️ License

MIT — free for everyone, forever.

---

_Built with ❤️ for the **Umi Try-a-thon** — let's push the dual-VM frontier together!_ 🚀
