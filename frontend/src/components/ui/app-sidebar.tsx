"use client"

import {
  AlignLeft,
  GitFork,
  Hammer,
  WandSparkles,
  type LucideIcon,
} from "lucide-react"
import { NavProjects } from "@/components/ui/nav-projects"
import { TeamSwitcher } from "@/components/ui/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "./button"
import Link from "next/link"
import type { Tab } from "@/app/ide/page"

/* ─── static data ──────────────────────────────────────────────── */
const teams = [
  {
    name: "UmiIDE",
    logo: AlignLeft,
    plan: "Goal: AI-powered editor for Move & Solidity on Umi",
  },
]

const projects: { name: string; icon: LucideIcon; tab: Tab }[] = [
  { name: "Generate Contracts", icon: WandSparkles, tab: "generate" },
  { name: "Compile Contracts",  icon: Hammer,       tab: "compile"  },
  { name: "Deploy Contracts",   icon: GitFork,      tab: "deploy"   },
]

/* ─── sidebar component ────────────────────────────────────────── */
export function AppSidebar({
  onTabSelect,
  activeTab,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  onTabSelect?: (t: Tab) => void
  activeTab?: Tab
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-col items-start gap-2">
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavProjects
          projects={projects}
          onTabSelect={onTabSelect}
          active={activeTab}
        />
      </SidebarContent>

      <SidebarFooter className="w-full">
        <Link href="#" className="w-full p-2 cursor-pointer">
          <Button onClick={() => onTabSelect?.("settings")} className="w-full cursor-pointer">Settings</Button>
        </Link>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
