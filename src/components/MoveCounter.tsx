//MoveCounter.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wallet, Plus, CheckCircle, AlertCircle } from "lucide-react"
import { counterPayload, extractOutput, getAccount, publicClient, walletClient } from "@/lib/config"
import { bcs } from "@mysten/bcs"
import { useChainId } from "wagmi"
import { umiDevnet, localMove } from "@/lib/customConfig";

/* BCS layout for struct Counter { value: u64 } */
const MoveCounterBCS = bcs.struct("Counter", { value: bcs.u64() })

export default function MoveCounter() {
  const chainId = useChainId()
  const chain   = chainId === localMove.id ? localMove : umiDevnet
  /* ───────── local UI state ───────── */
  const [connected, setConnected] = useState(false)
  const [busy, setBusy] = useState(false)
  const [value, setValue] = useState<number>()
  const [error, setError] = useState<string>("")

  /* ───────── helpers ───────── */
  /** read counter value */
  const refresh = async () => {
    try {
      setError("")
      const acct = await getAccount()
      const { data } = await publicClient(chain).call({
        to: acct as `0x${string}`,
        data: await counterPayload("get"),
      })
      const parsed = MoveCounterBCS.parse(extractOutput(data))
      setValue(Number(parsed.value))
    } catch (err) {
      setError("Failed to read counter value")
      console.error(err)
    }
  }

  /** connect wallet, then read */
  const connect = async () => {
    setBusy(true)
    try {
      setError("")
      await refresh()
      setConnected(true)
    } catch (err) {
      setError("Failed to connect wallet or read counter")
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  /** write tx then read */
  const increment = async () => {
    setBusy(true)
    try {
      setError("")
      const acct = await getAccount()
      const hash = await walletClient(chain).sendTransaction({
        account: acct as `0x${string}`,
        to: acct as `0x${string}`,
        data: await counterPayload("increment"),
      })
      await publicClient(chain).waitForTransactionReceipt({ hash })
      await refresh()
    } catch (err) {
      setError("Failed to increment counter")
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  /* ───────── UI ───────── */
  return (
    <div className="w-full">
      <Card className="w-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800">
        <CardHeader className="text-center p-3 sm:p-6 pb-2 sm:pb-4">
          <div className="flex flex-col items-center space-y-2 mb-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">🦀</span>
            </div>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-black dark:text-white">
              Move Counter
            </CardTitle>
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            Interact with your deployed Move smart contract
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6 pt-0">
          {/* Connection Status */}
          <div className="flex items-center justify-center space-x-2">
            {connected ? (
              <>
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs"
                >
                  Connected
                </Badge>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs"
                >
                  Not Connected
                </Badge>
              </>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-2 sm:p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-xs sm:text-sm text-center break-words">{error}</p>
            </div>
          )}

          {/* Counter Value Display */}
          {connected && (
            <div className="text-center border p-4 sm:p-6 bg-white/10 dark:bg-gray-800/10 rounded-xl border-gray-200 dark:border-gray-700">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Current Counter Value</p>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white">
                {value === undefined ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 sm:w-6 sm:h-6 animate-spin flex-shrink-0" />
                    <span className="text-sm sm:text-lg">Loading...</span>
                  </div>
                ) : (
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {value}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!connected ? (
              <Button
                onClick={connect}
                disabled={busy}
                className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 sm:py-3 h-auto text-sm sm:text-base"
              >
                {busy ? (
                  <>
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin flex-shrink-0" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                    Connect & Load Counter
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={increment}
                disabled={busy}
                className="bg-gradient-to-r w-full cursor-pointer from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 sm:py-3 h-auto text-sm sm:text-base"
              >
                {busy ? (
                  <>
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 animate-spin flex-shrink-0" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                    Increment
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Info Text */}
          <div className="text-center border text-xs text-gray-500 dark:text-gray-400 bg-gray-50/10 dark:bg-gray-800/10 p-2 sm:p-3 rounded-lg">
            <p className="break-words">Move modules live at the signer's address</p>
            <p className="break-words">No contract address needed for interaction</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

