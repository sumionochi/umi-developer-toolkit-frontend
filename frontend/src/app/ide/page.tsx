// src/app/ide/page.tsx
"use client"

import { useState } from "react"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import CodeEditor from "@/components/CodeEditor"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Loader2, Sparkles } from "lucide-react"
import Header from "@/components/Header"

import { useAiGenerate } from "@/hooks/useAiGenerate"
import { useAiDoubt } from "@/hooks/useAiDoubt"

export type Tab = "generate" | "compile" | "deploy" | "settings"

export default function IDE() {
  // ─────────────────────────────────── UI Tabs
  const [tab, setTab] = useState<Tab>("generate")

  // ─────────────────────────────────── Shared editor state
  const [code, setCode] = useState("// write your contract here …")
  const [genLang, setGenLang] = useState<"solidity" | "move">("solidity")
  const [faqLang, setFaqLang] = useState<"solidity" | "move">("move")

  // ─────────────────────────────────── Compile placeholder
  const [compileBusy, setCompileBusy] = useState(false)
  const [compileOut, setCompileOut] = useState("")

  // ─────────────────────────────────── Generate hook
  const {
    input: genInput,
    handleInputChange: handleGenInput,
    submitMessage: doGenerate,
    status: genStatus,
  } = useAiGenerate(genLang, setCode)

  // ─────────────────────────────────── Doubt hook
  const {
    input: question,
    handleInputChange: handleQuestion,
    submitMessage: askDoubt,
    messages: doubtMsgs,
    status: askStatus,
  } = useAiDoubt(faqLang)

  /* — helpers ——————————————————————————— */
  const compileCode = () => {
    setCompileBusy(true)
    setCompileOut("")
    // ⬇︎ placeholder – wire Solc / Move WASM here
    setTimeout(() => {
      setCompileOut("✅ compiled successfully (fake output)")
      setCompileBusy(false)
    }, 800)
  }

  return (
    <SidebarProvider>
      <AppSidebar
        activeTab={tab}
        onTabSelect={setTab}
        collapsible="offcanvas"
      />
      <SidebarInset className="min-h-screen bg-background flex flex-col">
        <SidebarTrigger className="-ml-1 absolute top-0 left-0 cursor-pointer" />
        <Header />

        {/* ------------- SPLIT PANE ------------- */}
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-screen border-2"
        >
          {/* LEFT TOOL PANE */}
          <ResizablePanel
            minSize={22}
            defaultSize={28}
            className="border-r overflow-y-auto"
          >
            <div className="p-4 space-y-6 text-sm">
              {/* ─────────────────── Generate TAB ─────────────────── */}
              {tab === "generate" && (
                <>
                  <h1 className="font-bold text-xl">AI Assistant</h1>

                  {/* — Generate card — */}
                  <div className="flex flex-col gap-4">
                    <p className="font-semibold">Generate contract with AI</p>

                    {/* language toggle */}
                    <div className="flex gap-2">
                      {(["solidity", "move"] as const).map((l) => (
                        <Button
                          key={l}
                          variant={l === genLang ? "default" : "outline"}
                          size="sm"
                          className="px-4 capitalize"
                          onClick={() => setGenLang(l)}
                        >
                          {l}
                        </Button>
                      ))}
                    </div>

                    <Textarea
                      value={genInput}
                      onChange={handleGenInput}
                      placeholder="Describe the contract you need"
                      className="h-32"
                    />

                    <Button
                      onClick={() => doGenerate()}
                      disabled={genStatus === "in_progress"}
                      className="w-full gap-1"
                    >
                      {genStatus === "in_progress" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      Generate
                    </Button>
                  </div>

                  {/* — Doubt card — */}
                  <div className="flex flex-col gap-4 mt-6">
                    <p className="font-semibold">Ask doubts</p>

                    {/* language toggle */}
                    <div className="flex gap-2">
                      {(["solidity", "move"] as const).map((t) => (
                        <Button
                          key={t}
                          variant={t === faqLang ? "default" : "outline"}
                          size="sm"
                          className="px-3 capitalize"
                          onClick={() => setFaqLang(t)}
                        >
                          {t}
                        </Button>
                      ))}
                    </div>

                    <Textarea
                      value={question}
                      onChange={handleQuestion}
                      placeholder={`Ask about ${
                        faqLang === "move" ? "Move/Umi" : "Solidity"
                      }…`}
                      className="h-24"
                    />

                    <Button
                      onClick={() => askDoubt()}
                      disabled={askStatus === "in_progress"}
                      className="w-full"
                    >
                      {askStatus === "in_progress" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Ask"
                      )}
                    </Button>

                    {/* answers */}
                    <div className="space-y-2">
                      {doubtMsgs
                        .filter((m) => m.role === "assistant")
                        .map((m) => (
                          <pre
                            key={m.id}
                            className="bg-muted/50 p-2 rounded text-xs whitespace-pre-wrap"
                          >
                            {m.content}
                          </pre>
                        ))}
                    </div>
                  </div>
                </>
              )}

              {/* ─────────────────── Compile TAB ─────────────────── */}
              {tab === "compile" && (
                <>
                  <h3 className="font-semibold mb-2">Compile</h3>
                  <Button
                    onClick={compileCode}
                    disabled={compileBusy}
                    className="w-full"
                  >
                    {compileBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Run compiler"
                    )}
                  </Button>
                  {compileOut && (
                    <pre className="bg-muted p-2 mt-4 rounded text-xs whitespace-pre-wrap">
                      {compileOut}
                    </pre>
                  )}
                </>
              )}

              {/* ─────────────────── Deploy TAB ─────────────────── */}
              {tab === "deploy" && (
                <>
                  <h3 className="font-semibold mb-2">Deploy</h3>
                  {/* place-holders; wire helpers later */}
                  <Input placeholder="Contract name" />
                  <Button className="w-full mt-2">Deploy to Devnet</Button>
                </>
              )}

              {/* ─────────────────── Settings TAB ─────────────────── */}
              {tab === "settings" && (
                <>
                  <h3 className="font-semibold mb-2">Settings</h3>
                  <Input
                    placeholder="OpenAI API key"
                    onChange={(e) =>
                      localStorage.setItem("openai", e.target.value)
                    }
                  />
                </>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* RIGHT CODE EDITOR PANE */}
          <ResizablePanel minSize={40}>
            <CodeEditor
              language={genLang === "move" ? "move" : "solidity"}
              code={code}
              onChange={setCode}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarInset>
    </SidebarProvider>
  )
}