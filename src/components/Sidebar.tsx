
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useSidebarState } from "@/hooks/useSidebarState";
import { PublishedPrograms } from "./sidebar/PublishedPrograms";
import { ProgramsList } from "./sidebar/ProgramsList";

type Program = {
  id: string;
  name: string;
  publishDate: Date | null;
};

type SidebarProps = {
  programs: Program[];
  onProgramClick: (programId: string) => void;
  onProgramDelete: (programId: string) => void;
  onPublishDateChange: (programId: string, date: Date | null) => void;
  onExportPdf: (programId: string) => void;
  onCreateTake?: (programId: string) => void;
};

export function Sidebar({ 
  programs, 
  onProgramClick, 
  onProgramDelete, 
  onPublishDateChange, 
  onExportPdf,
  onCreateTake 
}: SidebarProps) {
  const {
    isCollapsed,
    setIsCollapsed,
    programSearchQuery,
    setProgramSearchQuery,
    publishedSearchQuery,
    setPublishedSearchQuery,
    isMobile,
    toggleSidebar
  } = useSidebarState();

  return (
    <div 
      className={`border-r bg-sidebar transition-all duration-300 flex flex-col h-full fixed md:relative z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-2 md:p-4 border-b flex items-center justify-between bg-sidebar">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2" 
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <Menu className="h-5 w-5" />
              <span>Radio Manager</span>
            </>
          )}
        </Button>
        
        {!isCollapsed && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar} 
            className="md:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {/* Show components only when sidebar is expanded */}
      {!isCollapsed && (
        <>
          <PublishedPrograms 
            programs={programs}
            searchQuery={publishedSearchQuery}
            onSearchChange={setPublishedSearchQuery}
            onProgramClick={onProgramClick}
            isMobile={isMobile}
            setIsCollapsed={setIsCollapsed}
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
            setIsCollapsed={setIsCollapsed}
          />
        </>
      )}
    </div>
  );
}
