"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { PlusCircleIcon } from "@phosphor-icons/react";
import { openCommand } from "@/components/global/nav-command";
import { type NavItem } from "@/lib/nav-items";
import Link from "next/link";

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Access"
              onClick={openCommand}
              className="from-primary/20 to-primary/30 border-primary/30 hover:from-primary/30 text-primary-foreground hover:text-primary-foreground active:text-primary-foreground min-w-8 cursor-pointer border bg-linear-to-b transition-all duration-200 ease-linear hover:bg-transparent"
            >
              <PlusCircleIcon />
              <span>Quick Access</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <Link href={item.href} key={item.label}>
              <SidebarMenuItem className="cursor-pointer">
                <SidebarMenuButton tooltip={item.label}>
                  {<item.icon />}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
