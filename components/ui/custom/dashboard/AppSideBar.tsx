"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Button } from "@base-ui/react"
import { Archive, Files, LayoutGrid, Settings, SparklesIcon, Users } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation";
import { Progress } from "../../progress"
import { useUser } from "@clerk/nextjs"
import CreateNewBoardDialog from "./CreateNewBoardDialog"

export function AppSidebar() {

    const Path = usePathname();
    const {user} = useUser();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">

        <Image src="/logo.svg" alt='logo' width={40} height={40} />
        <h2 className="text-xl font-bold">WhizBoard</h2>
        </div>
      </ SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <CreateNewBoardDialog />
        </SidebarGroup>

        <SidebarGroup>
            <SidebarGroupLabel>My boards</SidebarGroupLabel>
            <SidebarMenuButton className="p-5" isActive={Path === '/dashboard'}>
                <LayoutGrid />
                <span>All files</span>
            </SidebarMenuButton>
            <SidebarMenuButton className="p-5 mt-2" isActive={Path === '/shared-files'}>
                <Users />
                <span>Shared</span>
            </SidebarMenuButton>
            <SidebarMenuButton className="p-5 mt-2" isActive={Path === '/archived'}>
                <Archive />
                <span>Archived</span>
            </SidebarMenuButton>
        </SidebarGroup>

        <SidebarGroup>
            <SidebarGroupLabel>Others</SidebarGroupLabel>
            <SidebarMenuButton className="p-5" isActive={Path === '/ai'}>
                <SparklesIcon />
                <span>AI Helper</span>
            </SidebarMenuButton>
            <SidebarMenuButton className="p-5 mt-2" isActive={Path === '/settings'}>
                <Settings />
                <span>Settings</span>
            </SidebarMenuButton>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
            <CreateNewBoardDialog />
            <div className="p-4 my-3 border rounded-md">
                <h2 className="text-sm flex justify-between mb-1">2 Files created <span>total 3</span></h2>
                <Progress value={66} className="h-2 mt-2"/>
            </div>

            <div className="flex items-center gap-2">
                <Image src={user?.imageUrl ?? ""} alt="User Image" width={40} height={40} className="rounded-full"/>
                <h2>{user?.firstName} {user?.lastName}</h2>
            </div>
      </ SidebarFooter>
    </Sidebar>
  )
}