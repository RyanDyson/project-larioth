import { AppSidebar } from "@/components/global/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/global/site-header";
import { NavCommand } from "@/components/global/nav-command";
import { authClient } from "@/server/better-auth/client";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { data: session } = await authClient.getSession();
  // if (!session) {
  //   redirect("/");
  // }
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
