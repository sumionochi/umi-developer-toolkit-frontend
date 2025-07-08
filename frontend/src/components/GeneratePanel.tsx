"use client"
import dynamic from "next/dynamic"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input }  from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

/* Monaco needs a dynamic import because it relies on window. */
const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false })

export default function IDEGeneratePanel() {
  const [prompt, setPrompt] = useState("")
  const [lang,   setLang]   = useState<"move" | "solidity">("solidity")
  const [code,   setCode]   = useState("// Your code will appear here…")

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      {/* prompt bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Textarea
          placeholder="Describe the contract you need…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 dark:bg-gray-800"
          value={lang}
          onChange={(e) => setLang(e.target.value as any)}
        >
          <option value="solidity">Solidity</option>
          <option value="move">Move</option>
        </select>
        <Button
          onClick={() => {
            // 🚧  later we’ll call `/api/generate`
            setCode(`// TODO: AI output for "${prompt}" in ${lang}`)
          }}
        >
          Generate
        </Button>
      </div>

      {/* editor */}
      <Monaco
        height="60vh"
        defaultLanguage={lang === "move" ? "rust" : "solidity"}
        value={code}
        onChange={(v) => setCode(v ?? "")}
        theme="vs-dark"
        options={{ fontSize: 14, minimap: { enabled: false } }}
      />
    </div>
  )
}
