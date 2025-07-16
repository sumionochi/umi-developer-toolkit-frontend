/* ------------------------------------------------------------------ */
/*  patch-bcs.d.ts ─ place anywhere picked-up by tsconfig “includes”   */
/* ------------------------------------------------------------------ */
import "node:buffer"; // <= for Buffer typings

declare module "@benfen/bcs" {
  /** Extra constructor / helper options exposed by the runtime. */
  interface RustBufferOptions {
    /** Initial buffer size for `BcsWriter` (bytes). */
    size?: number;
    /** Maximum buffer size before throw (bytes). */
    maxSize?: number;
    /** Step in which the buffer grows when `ensureSizeOrGrow()` triggers (bytes). */
    allocateSize?: number;
  }

  /* ---------------------------------------------------------------- */
  /* 1️⃣  widen `getRustConfig`                                       */
  /* ---------------------------------------------------------------- */
  /** Same defaults as before; now you may override any field. */
  export function getRustConfig(
    overrides?: Partial<BcsConfig> & RustBufferOptions
  ): BcsConfig;

  /* ---------------------------------------------------------------- */
  /* 2️⃣  overload the BCS constructor                                */
  /* ---------------------------------------------------------------- */
  interface BCS {
    /** Existing signature – left intact                                       */
    new (schema?: BcsConfig | BCS): BCS;
    /** NEW signature – allows passing only the sizing overrides               */
    new (overrides?: RustBufferOptions): BCS;
  }
}
