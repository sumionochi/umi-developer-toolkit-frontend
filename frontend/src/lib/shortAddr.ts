export const shortAddress = (addr?: `0x${string}`) =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";
