"use client"

import type { LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { Tab } from "@/app/ide/page"

export function NavProjects({
  projects,
  onTabSelect,
  active,
}: {
  projects: { name: string; icon: LucideIcon; tab: Tab }[]
  onTabSelect?: (t: Tab) => void
  active?: Tab
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Features</SidebarGroupLabel>

      <SidebarMenu>
        {projects.map((p) => (
          <SidebarMenuItem
            key={p.tab}
            data-active={p.tab === active}
          >
            <SidebarMenuButton
              className="w-full cursor-pointer"
              onClick={() => onTabSelect?.(p.tab)}
            >
              <p.icon />
              <span>{p.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
