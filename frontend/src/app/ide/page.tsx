// src/app/ide/page.tsx
"use client"

import { useState } from "react"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import CodeEditor from "@/components/CodeEditor"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Header from "@/components/Header"

export type Tab = "generate" | "compile" | "deploy" | "settings"

export default function IDE() {
  // ui state
  const [tab, setTab] = useState<Tab>("generate")
  const [lang, setLang] = useState<"solidity" | "move">("solidity")
  const [prompt, setPrompt] = useState("")
  const [code, setCode]   = useState("// write your contract here …")
  const [busy, setBusy]   = useState(false)
  const [compileOut, setCompileOut] = useState("")

  // —— Ask-doubts ————————————————————————————
  const [question, setQuestion]   = useState("")
  const [answer,   setAnswer]     = useState("")
  const [askBusy,  setAskBusy]    = useState(false)

  // ─── state ───────────────────────────────────────────────────────
  const [genLang, setGenLang]   = useState<"solidity" | "move">("solidity") // ← for Generate
  const [faqLang, setFaqLang]   = useState<"solidity"    | "move">("move") // for Ask-doubts


  /* — helpers ——————————————————————————— */
  const generateCode = async () => {
    setBusy(true)
    setCompileOut("")
    try {
      const r = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ lang: genLang, prompt }),
        headers: { "Content-Type": "application/json" },
      })
      const { result } = await r.json()
      setCode(result)
    } catch (e) {
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  const compileCode = () => {
    setBusy(true)
    setCompileOut("")
    // ⬇︎ placeholder – replace with real solc / move compile
    setTimeout(() => {
      setCompileOut("✅ compiled successfully (fake output)")
      setBusy(false)
    }, 800)
  }

  const askDoubt = async () => {
    if (!question.trim()) return
    setAskBusy(true)
    setAnswer("")
    try {
      const r = await fetch("/api/ai/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: faqLang, question }),
      })
      const { result } = await r.json()
      setAnswer(result)          // full text return; swap for stream if you like
    } catch (err) {
      console.error(err)
      setAnswer("❌ Failed to fetch answer")
    } finally {
      setAskBusy(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeTab={tab} onTabSelect={setTab} collapsible="offcanvas" />
      <SidebarInset className="min-h-screen bg-background flex flex-col">
        <SidebarTrigger className="-ml-1 absolute top-0 left-0 cursor-pointer" />
        <Header/>
        {/* ------------- SPLIT PANE ------------- */}
        <ResizablePanelGroup direction="horizontal" className="min-h-screen border-2">
          {/* LEFT TOOL PANE */}
          <ResizablePanel minSize={22} defaultSize={28} className="border-r">
            <div className="h-full overflow-y-auto p-4 space-y-6 text-sm">
              {tab === "generate" && (
                <>
                  <h1 className="font-bold text-start text-xl">AI Assistant</h1>   
                  <div className="flex flex-col gap-4">
                    <p className="font-semibold">Generate Contract with AI</p>
                    {/* ── Generate card language toggle ── */}
                    <div className="flex gap-2">
                      {(["solidity","move"] as const).map(l => (
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
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      placeholder="Describe the contract you need"
                      className="h-32"
                    />
                  </div>
                  <div className="flex flex-col gap-4 mt-6">
                    <p className="font-semibold">Ask doubts</p>

                    {/* language toggle */}
                    <div className="flex gap-2">
                      {(["solidity","move"] as const).map(t => (
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

                    {/* question box */}
                    <Textarea
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      placeholder={`Ask doubts about ${faqLang === "move" ? "Move" : "Solidity"}…`}
                      className="h-24"
                    />

                    {/* submit */}
                    <Button onClick={askDoubt} disabled={askBusy} className="w-full">
                      {askBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
                    </Button>

                    {/* answer display */}
                    {answer && (
                      <pre className="bg-muted/50 mt-2 p-3 rounded text-xs whitespace-pre-wrap">
                        {answer}
                      </pre>
                    )}
                  </div>
                </>
              )}

              {tab === "compile" && (
                <>
                  <h3 className="font-semibold">Compile</h3>
                  <Button onClick={compileCode} disabled={busy} className="w-full">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Run compiler"}
                  </Button>
                  {compileOut && (
                    <pre className="bg-muted p-2 mt-4 rounded text-xs whitespace-pre-wrap">
                      {compileOut}
                    </pre>
                  )}
                </>
              )}

              {tab === "deploy" && (
                <>
                  <h3 className="font-semibold">Deploy</h3>
                  {/* place-holders; wire to your viem helpers later */}
                  <Input placeholder="Contract name" />
                  <Button className="w-full mt-2">Deploy to Devnet</Button>
                </>
              )}

              {tab === "settings" && (
                <>
                  <h3 className="font-semibold">Settings</h3>
                  <Input
                    placeholder="OpenAI API key"
                    onChange={e => localStorage.setItem("openai", e.target.value)}
                  />
                </>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* RIGHT CODE EDITOR PANE */}
          <ResizablePanel minSize={40}>
            <CodeEditor language={genLang === "move" ? "move" : "solidity"} code={code} onChange={setCode} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarInset>
    </SidebarProvider>
  )
}
