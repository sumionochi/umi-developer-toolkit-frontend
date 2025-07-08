"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"

/** Valid centre-panel tabs                                                 */
export type Tab = "generate" | "compile" | "deploy" | "settings"

/** The IDE page – single route, state-driven centre panel                  */
export default function IDE() {
  const [tab, setTab] = useState<Tab>("generate")

  return (
    <SidebarProvider>
      <AppSidebar
        activeTab={tab}
        onTabSelect={setTab}
        collapsible="offcanvas"
      />

      <SidebarInset className="min-h-screen bg-background">
        <SidebarTrigger className="-ml-1 absolute top-0 left-0 cursor-pointer" />
        {tab === "generate" && (
          <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">🎨 Generate</h1>
            <p>GPT prompt → Move / Solidity boilerplate will live here.</p>
          </div>
        )}

        {tab === "compile" && (
          <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">🔨 Compile</h1>
            <p>Run <code>solc-js</code> or Move compiler and show the output.</p>
          </div>
        )}

        {tab === "deploy" && (
          <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">🚀 Deploy</h1>
            <p>Connect wallet &amp; push byte-/module-code to Umi devnet.</p>
          </div>
        )}

        {tab === "settings" && (
          <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">⚙️ Settings</h1>
            <p>Theme, RPC, OpenAI key, etc.</p>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}
