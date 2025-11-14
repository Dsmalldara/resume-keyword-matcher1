import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden w-full">
          <div className="flex items-center p-2 md:p-4 border-b gap-2">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-sm md:text-base font-semibold md:ml-4">
              Dashboard
            </h1>
          </div>
          <div className="flex-1 overflow-auto w-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
