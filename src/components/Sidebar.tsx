
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgramItem } from "./ProgramItem";
import { Menu, Radio } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  // Ordina i programmi pubblicati per data di pubblicazione in ordine crescente
  const publishedPrograms = programs
    .filter(p => p.publishDate)
    .sort((a, b) => {
      if (a.publishDate && b.publishDate) {
        return a.publishDate.getTime() - b.publishDate.getTime();
      }
      return 0;
    });
  
  // Ordina i programmi per nome in ordine decrescente alfabetico (dalla Z alla A)
  const sortedPrograms = [...programs].sort((a, b) => b.name.localeCompare(a.name));
  
  // Improved handler with better logging and making sure a valid program ID is available
  const handleProgramsHeaderClick = () => {
    console.log("Programmi Radio header clicked");
    if (sortedPrograms.length > 0) {
      const programToSelect = sortedPrograms[0];
      console.log(`Selecting program: ${programToSelect.name} with ID: ${programToSelect.id}`);
      onProgramClick(programToSelect.id);
    } else {
      console.log("No programs available to select");
    }
  };
  
  return (
    <div className={`border-r bg-sidebar transition-all duration-300 flex flex-col h-full ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 border-b flex items-center justify-between bg-sidebar">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2" 
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          {!isCollapsed && <span>Radio Manager</span>}
        </Button>
      </div>
      
      {!isCollapsed && publishedPrograms.length > 0 && (
        <div className="p-4 border-b flex flex-col">
          <h3 className="text-sm font-medium mb-2">Pubblicazione</h3>
          <ScrollArea className="h-auto max-h-[25vh] overflow-auto">
            <div className="space-y-1 pr-2">
              {publishedPrograms.map((program) => (
                <div 
                  key={`pub-${program.id}`} 
                  className="text-xs flex justify-between cursor-pointer hover:bg-accent p-1 rounded-md"
                  onClick={() => {
                    console.log(`Clicking published program: ${program.name}`);
                    onProgramClick(program.id);
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
          <ScrollArea className="flex-1 overflow-auto">
            <div className="space-y-1 pr-2">
              {sortedPrograms.map((program) => (
                <ProgramItem 
                  key={program.id}
                  program={program}
                  onClick={() => {
                    console.log(`Clicking program: ${program.name}`);
                    onProgramClick(program.id);
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
