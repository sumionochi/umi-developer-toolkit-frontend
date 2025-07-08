"use client"

import * as React from "react"
import {
  AlignLeft,
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  GitFork,
  Hammer,
  Map,
  PieChart,
  Settings2,
  Sparkles,
  SquareTerminal,
  WandSparkles,
} from "lucide-react"

import { NavMain } from "@/components/ui/nav-main"
import { NavProjects } from "@/components/ui/nav-projects"
import { NavUser } from "@/components/ui/nav-user"
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

const data = {
  teams: [
    {
      name: "UmiIDE",
      logo: AlignLeft,
      plan: "Goal: AI-powered online editor that can compile, test, and deploy both Move and Solidity code to Umi.",
    },
  ],
  projects: [
    {
      name: "Generate Contracts",
      url: "#",
      icon: WandSparkles,
    },
    {
      name: "Compile Contracts",
      url: "#",
      icon: Hammer,
    },
    {
      name: "Deploy Contracts",
      url: "#",
      icon: GitFork,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-col items-start justify-items-start gap-2">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter className="w-full">
        <Link className="w-full" href="#">
          <Button className="w-full">Settings</Button>
        </Link>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
