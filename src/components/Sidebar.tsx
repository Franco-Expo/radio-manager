
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProgramItem } from "./ProgramItem";
import { ChevronLeft, ChevronRight, Menu, Radio, Search } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "./ui/input";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [programSearchQuery, setProgramSearchQuery] = useState("");
  const [publishedSearchQuery, setPublishedSearchQuery] = useState("");
  const isMobile = useIsMobile();
  
  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  // Filter published programs by search query and sort them
  const filteredPublishedPrograms = programs
    .filter(p => p.publishDate && p.name.toLowerCase().includes(publishedSearchQuery.toLowerCase()))
    .sort((a, b) => {
      if (a.publishDate && b.publishDate) {
        return b.publishDate.getTime() - a.publishDate.getTime();
      }
      return 0;
    });
  
  // Filter and sort programs by name, applying search filter
  const filteredPrograms = programs
    .filter(p => p.name.toLowerCase().includes(programSearchQuery.toLowerCase()))
    .sort((a, b) => b.name.localeCompare(a.name));
  
  // Improved handler with better logging and making sure a valid program ID is available
  const handleProgramsHeaderClick = () => {
    console.log("Programmi Radio header clicked");
    if (filteredPrograms.length > 0) {
      const programToSelect = filteredPrograms[0];
      console.log(`Selecting program: ${programToSelect.name} with ID: ${programToSelect.id}`);
      onProgramClick(programToSelect.id);
    } else {
      console.log("No programs available to select");
    }
  };

  // Take only the first 4 items for initial display
  const visiblePublishedPrograms = filteredPublishedPrograms.slice(0, 4);
  const hasMorePublishedPrograms = filteredPublishedPrograms.length > 4;

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
      
      {!isCollapsed && filteredPublishedPrograms.length > 0 && (
        <div className="p-4 border-b flex flex-col">
          <div className="flex items-center mb-2">
            <h3 className="text-sm font-medium flex-1">Pubblicazione</h3>
          </div>
          
          {/* Updated placeholder text for pubblicazione search field */}
          <div className="flex items-center mb-3">
            <Search className="h-4 w-4 text-muted-foreground mr-1" />
            <Input 
              placeholder="Cerca pubblicazione..." 
              className="h-7 text-xs" 
              value={publishedSearchQuery}
              onChange={(e) => setPublishedSearchQuery(e.target.value)}
              aria-label="Cerca Pubblicazione"
            />
          </div>
          
          {/* Display first 4 items without scroll */}
          <div className="space-y-1 pr-2">
            {visiblePublishedPrograms.map((program) => (
              <div 
                key={`pub-${program.id}`}
                className="text-xs flex justify-between cursor-pointer hover:bg-accent p-1 rounded-md"
                onClick={() => {
                  console.log(`Clicking published program: ${program.name}`);
                  onProgramClick(program.id);
                  if (isMobile) setIsCollapsed(true);
                }}
              >
                <span>{program.name}</span>
                <span className="text-muted-foreground">
                  {program.publishDate ? new Date(program.publishDate).toLocaleDateString('it-IT') : ''}
                </span>
              </div>
            ))}
          </div>
          
          {/* Show ScrollArea only if there are more than 4 items */}
          {hasMorePublishedPrograms && (
            <ScrollArea className="h-auto max-h-[20vh] pr-2 mt-1">
              <div className="space-y-1 pr-2">
                {filteredPublishedPrograms.slice(4).map((program) => (
                  <div 
                    key={`pub-${program.id}`}
                    className="text-xs flex justify-between cursor-pointer hover:bg-accent p-1 rounded-md"
                    onClick={() => {
                      console.log(`Clicking published program: ${program.name}`);
                      onProgramClick(program.id);
                      if (isMobile) setIsCollapsed(true);
                    }}
                  >
                    <span>{program.name}</span>
                    <span className="text-muted-foreground">
                      {program.publishDate ? new Date(program.publishDate).toLocaleDateString('it-IT') : ''}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      )}
      
      {!isCollapsed && (
        <div className="p-4 flex-1 flex flex-col overflow-hidden">
          <h3 
            className="text-sm font-medium mb-2 cursor-pointer flex items-center gap-2" 
            onClick={handleProgramsHeaderClick}
          >
            <Radio className="h-4 w-4" />
            <span>Programmi Radio</span>
          </h3>
          
          {/* Moved search field under the "Programmi Radio" title */}
          <div className="flex items-center mb-3">
            <Search className="h-4 w-4 text-muted-foreground mr-1" />
            <Input 
              placeholder="Cerca programmi..." 
              className="h-7 text-xs" 
              value={programSearchQuery}
              onChange={(e) => setProgramSearchQuery(e.target.value)}
              aria-label="Cerca Programmazione Radio"
            />
          </div>
          
          <ScrollArea className="flex-1 pr-2">
            <div className="space-y-1 pr-2">
              {filteredPrograms.map((program) => (
                <ProgramItem 
                  key={program.id}
                  program={program}
                  onClick={() => {
                    console.log(`Clicking program: ${program.name}`);
                    onProgramClick(program.id);
                    if (isMobile) setIsCollapsed(true);
                  }}
                  onDelete={() => onProgramDelete(program.id)}
                  onPublishDateChange={(date) => onPublishDateChange(program.id, date)}
                  onExportPdf={onExportPdf}
                  onCreateTake={onCreateTake}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
