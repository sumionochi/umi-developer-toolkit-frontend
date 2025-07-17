/* ------------------------------------------------------------------ */
/*  app/ide/page.tsx                                                  */
/* ------------------------------------------------------------------ */
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, MessageCircleCode, Sparkles } from "lucide-react";
import Header from "@/components/Header";

import { useAiGenerate } from "@/hooks/useAiGenerate";
import { useAiDoubt } from "@/hooks/useAiDoubt";

/* ─── compile & deploy helpers ───────────────────────────────────── */
import {
  compileSolidity,
  CompiledContract,
  deployToUmi,
} from "@/lib/sol-compile";
import { useAccount } from "wagmi";

/* ─── lazy-load Monaco so SSR passes on Vercel/Netlify etc. ───────── */
const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-secondary">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <span className="ml-2 text-muted-foreground text-2xl">Loading editor…</span>
    </div>
  ),
});

/* ─── internal types ─────────────────────────────────────────────── */
export type Tab = "generate" | "compile" | "deploy" | "settings";

/* ================================================================== */
/*  PAGE COMPONENT                                                    */
/* ================================================================== */
export default function IDE() {
  /* ————————————————— wagmi ———————————————— */
  const { chain } = useAccount(); // shows the connected chain (Metamask)

  /* ————————————————— UI Tabs ———————————————— */
  const [tab, setTab] = useState<Tab>("generate");

  /* ————————————————— Editor state ————————— */
  const [code, setCode] = useState("// write your contract here …");
  const [genLang, setGenLang] = useState<"solidity" | "move">("solidity");
  const [faqLang, setFaqLang] = useState<"solidity" | "move">("move");

  /* ————————————————— Compile state ——————— */
  const [compileBusy, setCompileBusy] = useState(false);
  const [compileOut, setCompileOut] = useState("");
  const [compiled, setCompiled] = useState<CompiledContract | null>(null);

  /* ————————————————— Deploy state ———————— */
  type DeployStatus = "idle" | "pending" | "success" | "error";
  const [deployStatus, setDeployStatus] = useState<DeployStatus>("idle");
  const [deployTx, setDeployTx] = useState<`0x${string}` | null>(null);
  const [deployAddr, setDeployAddr] = useState<`0x${string}` | null>(null);
  const [deployErr, setDeployErr] = useState<string>("");

  /* ─────────────────────────────────── AI Generate hook */
  const {
    input: genInput,
    handleInputChange: handleGenInput,
    submitMessage: doGenerate,
    status: genStatus,
  } = useAiGenerate(
    genLang,
    (streamingCode) => setCode(streamingCode), // live stream
    () => {} // no auto-compile afterwards
  );

  /* ─────────────────────────────────── AI Doubt hook */
  const {
    input: question,
    handleInputChange: handleQuestion,
    submitMessage: askDoubt,
    messages: doubtMsgs,
    status: askStatus,
  } = useAiDoubt(faqLang);

  /* ================================================================== */
  /*  HANDLERS                                                          */
  /* ================================================================== */
  const compileCode = async () => {
    setCompileBusy(true);
    setCompileOut("");
    setCompiled(null);

    if (genLang !== "solidity") {
      setCompileOut("⚠️  Move compilation coming soon!");
      setCompileBusy(false);
      return;
    }

    try {
      const artefact = await compileSolidity(code);
      setDeployErr(""); 
      setCompiled(artefact);
      setCompileOut(
        [
          "✅ Solidity compiled",
          "",
          `• Contract:   ${artefact.contractName}`,
          `• Byte-code:  ${(artefact.bytecode.length - 2) / 2} bytes`,
          `• ABI items:  ${artefact.abi.length}`,
        ].join("\n"),
      );
    } catch (e: any) {
      console.error("[Compile] ERROR:", e);
      setCompileOut(`❌ ${e?.message ?? String(e)}`);
    } finally {
      setCompileBusy(false);
    }
  };

  const deployCode = async () => {
    if (!compiled) return;

    setDeployStatus("pending");
    setDeployErr("");
    setDeployTx(null);
    setDeployAddr(null);

    try {
      const { address, txHash } = await deployToUmi(compiled);
      setDeployAddr(address);
      setDeployTx(txHash);
      setDeployStatus("success");
    } catch (e: any) {
      console.error("[Deploy] ERROR:", e);
      setDeployErr(e?.message ?? String(e));
      setDeployStatus("error");
    }
  };
    
  /* ================================================================== */
  /*  RENDER                                                            */
  /* ================================================================== */
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

        {/* -------- split layout ------------------------------------- */}
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-screen border-2"
        >
          {/* ------------- LEFT TOOL PANE ---------------------------- */}
          <ResizablePanel
            minSize={22}
            defaultSize={28}
            className="border-r overflow-y-auto"
          >
            <div className="p-4 space-y-6 text-sm">
              {/* ===================================================== */}
              {/*  AI Generate TAB                                      */}
              {/* ===================================================== */}
              {tab === "generate" && (
                <div className="space-y-8">
                  {/* Header */}
                  <h1 className="font-bold text-xl">AI Assistant</h1>
            
                  {/* Generate Contract Section */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <p className="font-semibold">Generate Contract</p>
                      <div className="flex gap-2">
                        {(["solidity", "move"] as const).map((l) => (
                          <Button
                            key={l}
                            variant={l === genLang ? "default" : "outline"}
                            size="sm"
                            onClick={() => setGenLang(l)}
                            className="capitalize"
                          >
                            {l}
                          </Button>
                        ))}
                      </div>
                    </div>
            
                    <div className="space-y-3">
                      <Textarea
                        value={genInput}
                        onChange={handleGenInput}
                        placeholder="Describe the contract you need…"
                        className="h-32"
                      />
                      <Button onClick={() => doGenerate()} disabled={genStatus === "in_progress"} className="w-full gap-2">
                        {genStatus === "in_progress" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        Generate
                      </Button>
                    </div>
                  </div>
          
                  {/* Ask Doubts Section */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <p className="font-semibold">Ask Doubts</p>
                      <div className="flex gap-2">
                        {(["solidity", "move"] as const).map((t) => (
                          <Button
                            key={t}
                            variant={t === faqLang ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFaqLang(t)}
                            className="capitalize"
                          >
                            {t}
                          </Button>
                        ))}
                      </div>
                    </div>
            
                    <div className="space-y-3">
                      <Textarea
                        value={question}
                        onChange={handleQuestion}
                        placeholder={`Ask about ${faqLang === "move" ? "Move/Umi" : "Solidity"}…`}
                        className="h-24"
                      />
                      <Button onClick={askDoubt} disabled={askStatus === "in_progress"} className="w-full gap-2">
                        {askStatus === "in_progress" ? <Loader2 className="h-4 w-4 animate-spin" /> : <div className="flex flex-row gap-2 items-center justify-center"><MessageCircleCode className="w-5 h-5"/> Ask</div>}
                      </Button>
                    </div>
            
                    {/* Answers */}
                    {doubtMsgs.filter((m) => m.role === "assistant").length > 0 && (
                      <div className="space-y-3">
                        <p className="font-semibold text-sm text-muted-foreground">Answers</p>
                        <div className="space-y-3">
                          {doubtMsgs
                            .filter((m) => m.role === "assistant")
                            .map((m) => (
                              <pre key={m.id} className="bg-muted/50 p-4 rounded-lg text-xs whitespace-pre-wrap border">
                                {m.content}
                              </pre>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

               {/* ===================================================== */}
              {/*  Compile TAB                                          */}
              {/* ===================================================== */}
              {tab === "compile" && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Compile</h3>

                  {/* Compile Button */}
                  <Button onClick={compileCode} disabled={compileBusy} className="w-full">
                    {compileBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Run compiler"}
                  </Button>

                  {/* Compiler Output */}
                  <div className="space-y-2">
                    {compileOut ? (
                      <pre className="bg-muted p-3 rounded text-xs whitespace-pre-wrap">{compileOut}</pre>
                    ) : (
                      <p className="text-xs text-gray-500">compile logs will appear here</p>
                    )}
                  </div>

                  {/* Coming Soon Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <p className="text-sm font-medium text-blue-800">Automation Compile and Deploy for "Move Contracts" coming soon!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ===================================================== */}
              {/*  Deploy TAB                                           */}
              {/* ===================================================== */}
              {tab === "deploy" && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Deploy</h3>

                  {/* Must have compiled artifact first */}
                  {!compiled && <p className="text-xs text-gray-500">Compile a contract first ↗</p>}

                  {compiled && (
                    <div className="space-y-3">
                      <p className="text-xs">
                        <span className="font-medium">Contract:</span> {compiled.contractName}
                      </p>

                      {/* Deploy Button */}
                      {chain && (
                        <Button onClick={deployCode} disabled={deployStatus === "pending"} className="w-full">
                          {deployStatus === "pending" ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending&nbsp;tx…
                            </>
                          ) : (
                            <>Deploy to {chain.name}</>
                          )}
                        </Button>
                      )}

                      {/* Messages */}
                      <div className="space-y-2">
                        {deployTx && (
                          <p className="text-xs break-all">
                            <span className="font-medium">Tx&nbsp;Hash:</span> {deployTx}
                          </p>
                        )}

                        {deployStatus === "success" && deployAddr && (
                          <div className="text-xs break-all space-y-1">
                            <p>✅ Deployed!</p>
                            <p>
                              <span className="font-medium">Address:</span> {deployAddr}
                            </p>
                            <p>
                              <span className="font-medium">Tx&nbsp;Hash:</span> {deployTx}
                            </p>
                          </div>
                        )}

                        {deployStatus === "error" && <p className="text-xs text-red-500 break-all">{deployErr}</p>}

                        {/* Coming Soon Notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <p className="text-sm font-medium text-blue-800">Automation Compile and Deploy for "Move Contracts" coming soon!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ResizablePanel>

          {/* --------- Splitter handle */}
          <ResizableHandle withHandle />

          {/* ------------- RIGHT CODE-EDITOR PANE ------------------ */}
          <ResizablePanel minSize={40} className="flex flex-col">
            <CodeEditor
              language={genLang === "move" ? "move" : "solidity"}
              code={code}
              onChange={setCode}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarInset>
    </SidebarProvider>
  );
}

