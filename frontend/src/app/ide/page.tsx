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
import { Loader2, Sparkles } from "lucide-react";
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
    <div className="p-4 bg-[#1e1e1e] text-gray-400">Loading editor…</div>
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
                <>
                  <h1 className="font-bold text-xl">AI Assistant</h1>

                  {/* --- language toggle */}
                  <div className="flex gap-2 mb-2">
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

                  {/* --- prompt box */}
                  <Textarea
                    value={genInput}
                    onChange={handleGenInput}
                    placeholder="Describe the contract you need…"
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

                  {/* --- Doubts */}
                  <div className="mt-8 space-y-2">
                    <p className="font-semibold">Ask doubts</p>
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

                    <Textarea
                      value={question}
                      onChange={handleQuestion}
                      placeholder={`Ask about ${
                        faqLang === "move" ? "Move/Umi" : "Solidity"
                      }…`}
                      className="h-24"
                    />
                    <Button
                      onClick={askDoubt}
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
                </>
              )}

              {/* ===================================================== */}
              {/*  Compile TAB                                          */}
              {/* ===================================================== */}
              {tab === "compile" && (
                <>
                  <h3 className="font-semibold mb-2">Compile</h3>

                  {/* --- Compile button */}
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

                  {/* --- compiler output */}
                  {compileOut ? (
                    <pre className="bg-muted p-2 mt-4 rounded text-xs whitespace-pre-wrap">
                      {compileOut}
                    </pre>
                  ) : (
                    <p className="text-xs text-gray-500 mt-4">
                      compile logs will appear here
                    </p>
                  )}
                </>
              )}

              {/* ===================================================== */}
              {/*  Deploy TAB                                           */}
              {/* ===================================================== */}

              {tab === "deploy" && (
                <>
                  <h3 className="font-semibold mb-4">Deploy</h3>

                  {/* must have a compiled artefact first */}
                  {!compiled && (
                    <p className="text-xs text-gray-500">
                      Compile a contract first ↗
                    </p>
                  )}

                  {compiled && (
                    <div className="space-y-3">
                      <p className="text-xs">
                        <span className="font-medium">Contract:</span>{" "}
                        {compiled.contractName}
                      </p>

                      {/* -------------------------------------------------- */}
                      {/*  Deploy button – ALWAYS visible (except pending)   */}
                      {/* -------------------------------------------------- */}
                      {chain && (
                        <Button
                          onClick={deployCode}
                          disabled={deployStatus === "pending"}
                          className="w-full"
                        >
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

                      {/* -------------------------------------------------- */}
                      {/*  Messages                                          */}
                      {/* -------------------------------------------------- */}

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

                      {deployStatus === "error" && (
                        <p className="text-xs text-red-500 break-all">{deployErr}</p>
                      )}
                    </div>
                  )}
                </>
              )}


              {/* ===================================================== */}
              {/*  Settings TAB                                         */}
              {/* ===================================================== */}
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

