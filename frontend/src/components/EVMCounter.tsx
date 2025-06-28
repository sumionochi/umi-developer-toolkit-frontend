"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wallet, Plus, CheckCircle, AlertCircle, Copy, ExternalLink } from "lucide-react"
import { getAccount, getEvmFunction, publicClient, walletClient } from "@/lib/sol-config"
import { toBigInt } from "ethers"

export default function EvmCounter() {
  /* --------------- local UI state --------------- */
  const [addr, setAddr] = useState("")
  const [value, setValue] = useState<number>()
  const [connected, setConnected] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>("")

  /* --------------- wire up once the user clicks ---------------- */
  const connect = async () => {
    try {
      setBusy(true)
      setError("")
      await getAccount()
      await refresh()
      setConnected(true)
    } catch (err) {
      setError("Failed to connect wallet or read counter")
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  /* --------------- read helper --------------- */
  const refresh = async () => {
    try {
      setError("")
      const { to, data } = await getEvmFunction("count", addr as `0x${string}`)
      const { data: ret } = await publicClient().call({ to, data })
      if (!ret || typeof ret === "string") throw new Error("no data")
      setValue(Number(toBigInt(new Uint8Array(ret))))
    } catch (err) {
      setError("Failed to read counter value")
      console.error(err)
    }
  }

  /* --------------- write helper --------------- */
  const increment = async () => {
    setBusy(true)
    try {
      setError("")
      const { to, data } = await getEvmFunction("increment", addr as `0x${string}`)
      const hash = await walletClient().sendTransaction({
        account: await getAccount(),
        to,
        data,
      })
      await publicClient().waitForTransactionReceipt({ hash })
      await refresh()
    } catch (err) {
      setError("Failed to increment counter")
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(addr)
  }

  const isValidAddress = addr.length === 42 && addr.startsWith("0x")

  /* --------------- UI --------------- */
  return (
    <div className="w-full">
      <Card className="w-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800">
        <CardHeader className="text-center p-3 sm:p-6 pb-2 sm:pb-4">
          <div className="flex flex-col items-center space-y-2 mb-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">⚙️</span>
            </div>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-black dark:text-white">
              EVM Counter
            </CardTitle>
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            Interact with your deployed Solidity smart contract
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6 pt-0">
          {/* Contract Address Input */}
          <div className="space-y-2">
            <Label
              htmlFor="contract-address"
              className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Contract Address
            </Label>
            <div className="relative">
              <Input
                id="contract-address"
                type="text"
                placeholder="0x... deployed counter address"
                value={addr}
                onChange={(e) => setAddr(e.target.value)}
                className={`text-xs sm:text-sm pr-16 sm:pr-20 ${isValidAddress ? "border-green-300 dark:border-green-700" : addr ? "border-red-300 dark:border-red-700" : ""}`}
              />
              {addr && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyAddress}
                    className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Copy className="w-2 h-2 sm:w-3 sm:h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3" />
                  </Button>
                </div>
              )}
            </div>
            {addr && !isValidAddress && (
              <p className="text-xs text-red-600 dark:text-red-400">Please enter a valid Ethereum address</p>
            )}
          </div>

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
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
                disabled={!isValidAddress || busy}
                onClick={connect}
                className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 sm:py-3 h-auto disabled:opacity-50 text-sm sm:text-base"
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
                className="bg-gradient-to-r w-full cursor-pointer from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 sm:py-3 h-auto text-sm sm:text-base"
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
            <p className="break-words">EVM contracts require a deployed address</p>
            <p className="break-words">Each deployment creates a new contract instance</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
