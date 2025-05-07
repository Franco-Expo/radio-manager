
import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppSidebar } from "@/components/AppSidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <SidebarProvider defaultOpen={!isMobile}>
          <AppSidebar 
            programs={[]} 
            onProgramClick={() => {}} 
            onProgramDelete={() => {}} 
            onPublishDateChange={() => {}} 
            onExportPdf={() => {}}
          />
          <main className="flex-1 flex flex-col overflow-y-auto">
            {children}
          </main>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}
