'use client';
import { useEffect, useState } from 'react';
import { counterPayload, extractOutput, getAccount, publicClient, walletClient } from '@/lib/config';
import { bcs } from '@mysten/bcs';

const MoveCounter = bcs.struct('Counter', { value: bcs.u64() });

export default function Counter() {
  const [counter, setCounter] = useState(0);

  /* ---- read helper ---- */
  const fetchCounter = async () => {
    console.log("[ui] fetchCounter()");
    const acct = await getAccount();
    const call = await publicClient().call({
      to: acct as `0x${string}`,
      data: await counterPayload('get'),
    });
    console.log("[ui] call result:", call);

    const output = extractOutput(call.data);
    const parsed = MoveCounter.parse(output);
    console.log("[ui] parsed value:", parsed.value.toString());

    setCounter(parseInt(parsed.value));
  };

  /* ---- write helper ---- */
  const incrementCounter = async () => {
    console.log("[ui] incrementCounter()");
    const acct = await getAccount();
    const hash = await walletClient().sendTransaction({
      account: acct as `0x${string}`,
      to: acct as `0x${string}`,
      data: await counterPayload('increment'),
    });
    console.log("[ui] tx hash:", hash);

    await publicClient().waitForTransactionReceipt({ hash });
    console.log("[ui] tx confirmed");
    fetchCounter();
  };

  /* ---- init ---- */
  useEffect(() => {
    console.log("[ui] mounted");
    fetchCounter().catch(console.error);
  }, []);

  /* ---- render ---- */
  return (
    <div className="text-center m-24">
      <h1 className="py-6">Counter: {counter}</h1>
      <button
        className="bg-blue-700 rounded-lg px-5 py-2.5"
        onClick={incrementCounter}
      >
        Increment
      </button>
    </div>
  );
}
