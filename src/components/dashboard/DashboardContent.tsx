
import { useState } from "react";
import { Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProgramCreation } from "@/components/programs/ProgramCreation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Program } from "@/types/programs";
import { Take } from "@/types/takes";

type DashboardContentProps = {
  programs: Program[];
  takes: Take[];
  takesLoading: boolean;
  selectedProgramId: string | undefined;
  onProgramClick: (programId: string) => void;
  onProgramDelete: (programId: string) => void;
  onPublishDateChange: (programId: string, date: Date | null) => void;
  onExportPdf: (programId: string) => void;
  onCreateTake: (programId: string) => void;
  onProgramCreate: (newProgram: { name: string; publishDate: Date | null }) => Promise<Program | null>;
  onProgramUpdate: (updatedProgram: { id: string; name: string; publishDate: Date | null }) => void;
  onTakeCreate: (takeNumber: number) => Promise<Take | null>;
  onTakeUpdate: (takeId: string, songs: { id: string; title: string; news: string }[], date: Date) => Promise<boolean>;
  onTakeDelete: (takeId: string) => Promise<void>;
  onProgramSave: (programId: string) => Promise<void>;
};

export function DashboardContent({
  programs,
  takes,
  takesLoading,
  selectedProgramId,
  onProgramClick,
  onProgramDelete,
  onPublishDateChange,
  onExportPdf,
  onCreateTake,
  onProgramCreate,
  onProgramUpdate,
  onTakeCreate,
  onTakeUpdate,
  onTakeDelete,
  onProgramSave
}: DashboardContentProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-1 overflow-hidden group/sidebar-wrapper">
      <AppSidebar
        programs={programs}
        onProgramClick={onProgramClick}
        onProgramDelete={onProgramDelete}
        onPublishDateChange={onPublishDateChange}
        onExportPdf={onExportPdf}
        onCreateTake={onCreateTake}
      />
      <SidebarRail />
      <SidebarInset className="flex-1 overflow-y-auto">
        <div className="p-4">
          <Button variant="outline" size="icon" className="md:hidden mb-4" asChild>
            <SidebarTrigger>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </SidebarTrigger>
          </Button>
          {takesLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Caricamento takes...</span>
            </div>
          ) : (
            <ProgramCreation
              programs={programs}
              takes={takes}
              onProgramCreate={onProgramCreate}
              onProgramUpdate={onProgramUpdate}
              selectedProgramId={selectedProgramId}
              onTakeCreate={onTakeCreate}
              onTakeUpdate={onTakeUpdate}
              onTakeDelete={onTakeDelete}
              onProgramSave={onProgramSave}
            />
          )}
        </div>
      </SidebarInset>
    </div>
  );
}
