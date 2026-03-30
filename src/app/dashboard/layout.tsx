import { AppSidebar } from "@/components/global/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/global/site-header";
import { NavCommand } from "@/components/global/nav-command";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <NavCommand />
        {children}
      </SidebarInset>
    </>
  );
}
