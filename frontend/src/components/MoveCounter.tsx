'use client';
import { useState } from 'react';
import {
  counterPayload,
  extractOutput,
  getAccount,
  publicClient,
  walletClient,
} from '@/lib/config';
import { bcs } from '@mysten/bcs';

/* BCS layout for struct Counter { value: u64 } */
const MoveCounterBCS = bcs.struct('Counter', { value: bcs.u64() });

export default function MoveCounter() {
  /* ───────── local UI state ───────── */
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [value, setValue] = useState<number>();

  /* ───────── helpers ───────── */
  /** read counter value */
  const refresh = async () => {
    const acct = await getAccount();                               // <-- triggers wallet only AFTER connect click
    const { data } = await publicClient().call({
      to: acct as `0x${string}`,
      data: await counterPayload('get'),
    });

    const parsed = MoveCounterBCS.parse(extractOutput(data));
    setValue(Number(parsed.value));
  };

  /** connect wallet, then read */
  const connect = async () => {
    setBusy(true);
    try {
      await refresh();
      setConnected(true);
    } finally {
      setBusy(false);
    }
  };

  /** write tx then read */
  const increment = async () => {
    setBusy(true);
    try {
      const acct = await getAccount();
      const hash = await walletClient().sendTransaction({
        account: acct as `0x${string}`,
        to: acct as `0x${string}`,
        data: await counterPayload('increment'),
      });
      await publicClient().waitForTransactionReceipt({ hash });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  /* ───────── UI ───────── */
  return (
    <div className="m-10 text-center">
      <h2 className="text-xl font-semibold mb-4">Move Counter (entry-tx mode)</h2>

      {!connected ? (
        <button
          onClick={connect}
          disabled={busy}
          className="bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {busy ? 'Connecting…' : 'Connect & Load'}
        </button>
      ) : (
        <>
          <p className="mb-4">
            Current value:&nbsp;
            {value === undefined ? <em>loading…</em> : <strong>{value}</strong>}
          </p>

          <button
            onClick={increment}
            disabled={busy}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {busy ? 'Tx…' : 'Increment'}
          </button>
        </>
      )}
    </div>
  );
}
