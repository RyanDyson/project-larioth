"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarbellIcon,
  CurrencyDollarIcon,
  RobotIcon,
  MonitorPlayIcon,
  GearIcon,
  QuestionIcon,
  MagnifyingGlassIcon,
  CommandIcon,
} from "@phosphor-icons/react";
import Link from "next/link";

const data = {
  user: {
    name: "Ryan",
    email: "ryan@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Fitness Tracker",
      url: "/fitness",
      icon: <BarbellIcon />,
    },
    {
      title: "Finance Tracker",
      url: "/finance",
      icon: <CurrencyDollarIcon />,
    },
    {
      title: "Chatbot",
      url: "/chat",
      icon: <RobotIcon />,
    },
    {
      title: "Media Server",
      url: "/media",
      icon: <MonitorPlayIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <GearIcon />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <QuestionIcon />,
    },
    {
      title: "Search",
      url: "#",
      icon: <MagnifyingGlassIcon />,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Personal Apps</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
