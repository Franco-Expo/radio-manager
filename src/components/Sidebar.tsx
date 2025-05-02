
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
};

export function Sidebar({ programs, onProgramClick, onProgramDelete, onPublishDateChange, onExportPdf }: SidebarProps) {
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
  
  // Ordina i programmi per ID in ordine crescente (dal più recente al più vecchio)
  const sortedPrograms = [...programs].sort((a, b) => a.id.localeCompare(b.id));
  
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
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium mb-2">Pubblicazione</h3>
          <ScrollArea className="h-auto max-h-[250px]">
            <div className="space-y-1">
              {publishedPrograms.map((program) => (
                <div 
                  key={`pub-${program.id}`} 
                  className="text-xs flex justify-between cursor-pointer hover:bg-accent p-1 rounded-md"
                  onClick={() => onProgramClick(program.id)}
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
        <div className="p-4">
          <h3 className="text-sm font-medium mb-2 cursor-pointer flex items-center gap-2" onClick={() => sortedPrograms.length > 0 && onProgramClick(sortedPrograms[0]?.id)}>
            <Radio className="h-4 w-4" />
            <span>Programmi Radio</span>
          </h3>
          <ScrollArea className="h-[calc(100vh-240px)]">
            <div className="space-y-1 pr-2">
              {sortedPrograms.map((program) => (
                <ProgramItem 
                  key={program.id}
                  program={program}
                  onClick={() => onProgramClick(program.id)}
                  onDelete={() => onProgramDelete(program.id)}
                  onPublishDateChange={(date) => onPublishDateChange(program.id, date)}
                  onExportPdf={onExportPdf}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
