
import { Radio, Search, Menu, ChevronLeft } from "lucide-react";
import { PublishedPrograms } from "./sidebar/PublishedPrograms";
import { ProgramsList } from "./sidebar/ProgramsList";
import { useSidebarState } from "@/hooks/useSidebarState";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type Program = {
  id: string;
  name: string;
  publishDate: Date | null;
};

type AppSidebarProps = {
  programs: Program[];
  onProgramClick: (programId: string) => void;
  onProgramDelete: (programId: string) => void;
  onPublishDateChange: (programId: string, date: Date | null) => void;
  onExportPdf: (programId: string) => void;
  onCreateTake?: (programId: string) => void;
};

export function AppSidebar({
  programs,
  onProgramClick,
  onProgramDelete,
  onPublishDateChange,
  onExportPdf,
  onCreateTake,
}: AppSidebarProps) {
  const {
    programSearchQuery,
    setProgramSearchQuery,
    publishedSearchQuery,
    setPublishedSearchQuery,
    isMobile,
    toggleSidebar
  } = useSidebarState();

  return (
    <Sidebar 
      collapsible="icon" 
      variant="sidebar"
      side="left"
      className="h-[calc(100vh-4rem)]" // Adjust height to leave room for footer
    >
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <Menu className="h-5 w-5" />
            <span className="font-medium">Radio Manager</span>
          </div>
          <SidebarTrigger className="flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <PublishedPrograms 
          programs={programs}
          searchQuery={publishedSearchQuery}
          onSearchChange={setPublishedSearchQuery}
          onProgramClick={onProgramClick}
          isMobile={isMobile}
        />
        
        <ProgramsList 
          programs={programs}
          searchQuery={programSearchQuery}
          onSearchChange={setProgramSearchQuery}
          onProgramClick={onProgramClick}
          onProgramDelete={onProgramDelete}
          onPublishDateChange={onPublishDateChange}
          onExportPdf={onExportPdf}
          onCreateTake={onCreateTake}
          isMobile={isMobile}
        />
      </SidebarContent>
    </Sidebar>
  );
}
