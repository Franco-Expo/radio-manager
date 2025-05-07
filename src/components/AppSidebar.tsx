
import { ChevronLeft, Menu, Radio, Search } from "lucide-react";
import { PublishedPrograms } from "./sidebar/PublishedPrograms";
import { ProgramsList } from "./sidebar/ProgramsList";
import { useSidebarState } from "@/hooks/useSidebarState";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";

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
    toggleSidebar,
    isCollapsed
  } = useSidebarState();

  return (
    <>
      {/* Pulsante per mostrare sidebar quando è nascosta */}
      {isCollapsed && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-20 left-2 z-20 rounded-full h-10 w-10 shadow-md md:flex hidden"
          onClick={toggleSidebar}
          title="Mostra sidebar"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Mostra sidebar</span>
        </Button>
      )}
      
      <Sidebar 
        collapsible="icon" 
        variant="sidebar"
        side="left"
        className="h-[calc(100vh-4rem)]" // Adjust height to leave room for footer
      >
        <SidebarHeader>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5" />
              <span className="font-medium">Radio Manager</span>
            </div>
            <Button
              variant="outline"
              size="sm" 
              onClick={toggleSidebar}
              className="h-8 w-8 p-0 flex items-center justify-center rounded-md border"
              title="Nascondi sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Nascondi sidebar</span>
            </Button>
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
    </>
  );
}
