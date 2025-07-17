# 🖰 Umi Developer Toolkit

_Dual‑VM scaffold + browser IDE for **Move & EVM** on the Umi Network_

[![npm](https://img.shields.io/npm/v/create-umi-app?color=cb3837&label=npm)](https://www.npmjs.com/package/create-umi-app)
![CI](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![MIT](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 🚦 Overview — the “60‑second pitch”

```bash
Link to the Repository : https://github.com/sumionochi/umi-developer-toolkit
```

```

┌──────────────────── create-umi-app ────────────────────┐
│ 1 CLI command → fully‑wired repo                      │
│  ├─ Move  counter            (contracts/move)         │
│  ├─ Solidity counter         (contracts/evm)          │
│  ├─ Hardhat + Aptos build / deploy scripts            │
│  ├─ Next‑15 frontend  (+Tailwind)                     │
│  └─ umiIDE  (Monaco + AI)                             │
└────────────────────────────────────────────────────────┘

```

<table>
<tr><th>Layer</th><th>Delivered out‑of‑the‑box</th><th>Key paths / files</th></tr>
<tr><td>🔹 CLI</td><td>Project scaffold, env setup, hooks</td><td><code>bin/create-umi-app.js</code></td></tr>
<tr><td>Contracts</td><td>Move <code>Counter.move</code> + Solidity <code>Counterevm.sol</code></td><td><code>contracts/move</code>, <code>contracts/evm</code></td></tr>
<tr><td>Build & Deploy</td><td>Hardhat + Aptos CLI (Devnet & local)</td><td><code>hardhat.config.js</code>, <code>scripts/*</code></td></tr>
<tr><td>🔹 umiIDE</td><td>Browser Monaco editor + **Solidity** Compile / Deploy + AI chat</td><td><code>frontend/src/app/ide</code></td></tr>
<tr><td>Frontend</td><td>Next.js counters page — live Move & EVM demo</td><td><code>frontend/src/app/counters/page.tsx</code></td></tr>
<tr><td>Testing</td><td>Hardhat (JS) + Move unit tests</td><td><code>test/</code>, <code>contracts/move/tests</code></td></tr>
</table>

---

## ⚡ Quick Start

```bash
# ➊ Scaffold project
npx create-umi-app hello-umi && cd hello-umi

# ➋ Add burner key
PRIVATE_KEY="0xabc123…"
PUBLIC_KEY_DEPLOYER_ADDR=0xYourEOA20Byte

# ➌ Compile & deploy to Devnet
npm run compile
npm run deploy:all     # deploys Solidity ➜ Move

# ➍ Run frontend + umiIDE
cd frontend
OPENAI_API_KEY=sk-...                >> .env.local
UMI_MOVE_ASSISTANT_ID=<umi-and-move‑assistant> >> .env.local
SOLIDITY_ASSISTANT_ID=<sol‑assistant>  >> .env.local
npm run dev           # open http://localhost:3000

```

---

## 🗺️ Project Map

```
.
├─ bin/................ CLI launcher
├─ contracts/
│  ├─ move/............ Counter.move  (+ tests)
│  └─ evm/............. Counterevm.sol
├─ scripts/............ deploy‑evm, deploy‑move, faucet, *
├─ test/............... Hardhat tests
├─ frontend/........... Next 15 + umiIDE
└─ hardhat.config.js... Dual‑VM tool‑chain
```

### “Dual Counter” contract pair

| VM   | Source           | Storage                      | Mutator                         |
| ---- | ---------------- | ---------------------------- | ------------------------------- |
| Move | `Counter.move`   | `resource Counter { value }` | `increment(entry &signer)`      |
| EVM  | `Counterevm.sol` | `uint256 public count;`      | `function increment() external` |

---

## 🛠️ Scripts & Workflows

<details><summary><b>Devnet tooling</b></summary>

| Script                     | Purpose                                                            |
| -------------------------- | ------------------------------------------------------------------ |
| **compile**                | Hardhat ➜ Solidity & Move (via <code>@moved/hardhat-plugin</code>) |
| **deploy\:evm**            | Deploy Solidity (wrap byte‑code in BCS)                            |
| **deploy\:move**           | Publish Move module + initialize counter                           |
| **deploy\:all**            | Shortcut = `deploy:evm` ➜ `deploy:move`                            |
| **test\:evm / test\:move** | Unit tests for each VM                                             |

</details>

<details><summary><b>Local dual‑VM stack</b></summary>

| Script                  | What it does                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **chain\:local**        | Starts Hardhat node :8545 **and** Aptos localnet :8080                                                                                     |
| **deploy\:evm\:local**  | Deploy Solidity to localhost chain                                                                                                         |
| **deploy\:move\:local** | Publish Move to localnet                                                                                                                   |
| **dev\:local**          | ① Start both chains  ② Deploy both counters ✔ — Front‑end auto‑connects (`cache/local-counter.json`). Increment both counters **offline**. |

</details>

---

## 🖥️ umiIDE (browser)

```
┌── sidebar ──┐┌──────────── Monaco editor ────────────┐
│ Generate AI ││ // Counterevm.sol                    │
│ Compile     ││ pragma solidity ^0.8.28;            │
│ Deploy      ││ contract Counter { ... }            │
└─────────────┘└──────────────────────────────────────┘
```

| Tab          | Supports            | Notes                                                                                              |
| ------------ | ------------------- | -------------------------------------------------------------------------------------------------- |
| **Generate** | MoveAI / SolidityAI | Describe your idea, get boiler‑plate.                                                              |
| **Compile**  | **Solidity only**   | Solc‑wasm in WebWorker → ABI + byte‑code. _Move compile coming soon._                              |
| **Deploy**   | **Solidity only**   | One‑click deploy (BCS wrap, gasPrice 15 gwei). Shows address + tx‑hash. _Move deploy coming soon._ |

> **Tip:** Switch MetaMask to `127.0.0.1:8545` and the Deploy tab targets your **local** Hardhat chain.

---

## 🧪 Tests Snapshot

| Suite            | Check                        | Result |
| ---------------- | ---------------------------- | ------ |
| `Counterevm.sol` | 0 → increment() → 1          | ✅     |
| `Counter.move`   | resource 0 → increment() → 1 | ✅     |

```bash
npm run test:evm && npm run test:move
```

---

Replace the **Roadmap** block in your README with the one below.
It shows everything delivered up to **v 1.5** (so judges see the breadth of completed work) and lists the pipeline through **v 1.8**.

## 🌄 Roadmap

### ✅ Completed (v1.0 → v1.5)

| Version | Status | Highlight                                                        |
| ------- | ------ | ---------------------------------------------------------------- |
| **1.0** | ✅     | `create-umi-app` CLI scaffold + dual Counter contracts           |
| **1.1** | ✅     | Hardhat + Aptos unified **compile** pipeline                     |
| **1.2** | ✅     | Devnet deploy scripts (**Solidity + Move**)                      |
| **1.3** | ✅     | Next‑15 **frontend** with live Move & EVM counter UI             |
| **1.4** | ✅     | Local dual‑VM stack  (Hardhat + Aptos) + auto‑frontend wiring    |
| **1.5** | ✅     | umiIDE — Monaco editor + AI chat + **Solidity** compile / deploy |

### 🚧 In Progress / Planned (v1.6 → v1.8)

| Target  | Status | Upcoming feature (high‑level)                             |
| ------- | ------ | --------------------------------------------------------- |
| **1.6** | 🔄     | **Move** in‑browser compile + deploy in umiIDE            |
|         | 🔄     | “Open in umiIDE” badge (1‑click GitHub link)              |
| **1.7** | ⏳     | Docker one‑command full stack + GitHub Action CI preview  |
|         | ⏳     | Extra templates: **ERC‑20 token** & Move coin parity      |
| **1.8** | ⏳     | GraphQL subgraph + React hooks template for indexed reads |
|         | ⏳     | Multi‑wallet support (Petra / Pontem) in frontend & IDE   |

_Legend: ✅ done 🔄 in progress ⏳ planned_

---

## 🤝 Contributing

```bash
git clone https://github.com/<you>/umi-developer-toolkit
npm i && npm link           # hack on CLI
npm run test:evm
npm run test:move
```

PRs for templates, IDE UX, or docs are welcome!
Licensed MIT — build amazing dual‑VM dApps & share back. 🚀
