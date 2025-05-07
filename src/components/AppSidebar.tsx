
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
  } = useSidebarState();

  return (
    <Sidebar 
      collapsible="icon" 
      variant="sidebar"
      side="left"
    >
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <Menu className="h-5 w-5" />
            <span className="font-medium">Radio Manager</span>
          </div>
          <SidebarTrigger/>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <PublishedPrograms 
          programs={programs}
          searchQuery={publishedSearchQuery}
          onSearchChange={setPublishedSearchQuery}
          onProgramClick={onProgramClick}
          isMobile={isMobile}
          setIsCollapsed={() => {}}
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
          setIsCollapsed={() => {}}
        />
      </SidebarContent>
    </Sidebar>
  );
}
