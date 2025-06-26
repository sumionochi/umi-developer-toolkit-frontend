// components/EvmCounter.tsx
"use client";
import { useState } from "react";
import {
  getAccount,
  getEvmFunction,
  publicClient,
  walletClient,
} from "@/lib/sol-config";
import { toBigInt } from "ethers";

export default function EvmCounter() {
  /* --------------- local UI state --------------- */
  const [addr, setAddr] = useState("");           // user-typed contract address
  const [value, setValue] = useState<number>();   // counter value
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);

  /* --------------- wire up once the user clicks ---------------- */
  const connect = async () => {
    try {
      setBusy(true);
      await getAccount();          // triggers wallet popup only now
      await refresh();             // read current value
      setConnected(true);
    } finally {
      setBusy(false);
    }
  };

  /* --------------- read helper --------------- */
  const refresh = async () => {
    const { to, data } = await getEvmFunction("count", addr as `0x${string}`);
    const { data: ret } = await publicClient().call({ to, data });
    if (!ret || typeof ret === "string") throw new Error("no data");
    setValue(Number(toBigInt(new Uint8Array(ret))));
  };

  /* --------------- write helper --------------- */
  const increment = async () => {
    setBusy(true);
    try {
      const { to, data } = await getEvmFunction("increment", addr as `0x${string}`);
      const hash = await walletClient().sendTransaction({
        account: await getAccount(),
        to,
        data,
      });
      await publicClient().waitForTransactionReceipt({ hash });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  /* --------------- UI --------------- */
  return (
    <div className="m-10 text-center">
      <h2 className="text-xl font-semibold mb-4">EVM Counter (Solidity)</h2>

      {/* Address input */}
      <input
        type="text"
        placeholder="0x… deployed counter address"
        value={addr}
        onChange={(e) => setAddr(e.target.value)}
        className="w-96 px-3 py-2 border rounded-lg mb-4 text-black"
      />

      {/* Connect / Read */}
      {!connected ? (
        <button
          disabled={!addr || busy}
          onClick={connect}
          className="bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {busy ? "Connecting…" : "Connect & Load"}
        </button>
      ) : (
        <>
          <p className="mb-4">
            Current value:{" "}
            {value === undefined ? <em>loading…</em> : <strong>{value}</strong>}
          </p>
          <button
            onClick={increment}
            disabled={busy}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {busy ? "Tx…" : "Increment"}
          </button>
        </>
      )}
    </div>
  );
}
