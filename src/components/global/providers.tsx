import { TRPCReactProvider } from "@/trpc/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavCommand } from "@/components/global/nav-command";

import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <TooltipProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <Toaster position="top-center" />
          <NavCommand />
          {children}
        </SidebarProvider>
      </TooltipProvider>
    </TRPCReactProvider>
  );
}
