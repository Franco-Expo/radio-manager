
import { Radio, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ProgramItem } from "../ProgramItem";
import { useSidebar } from "@/components/ui/sidebar";

type Program = {
  id: string;
  name: string;
  publishDate: Date | null;
};

type ProgramsListProps = {
  programs: Program[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onProgramClick: (programId: string) => void;
  onProgramDelete: (programId: string) => void;
  onPublishDateChange: (programId: string, date: Date | null) => void;
  onExportPdf: (programId: string) => void;
  onCreateTake?: (programId: string) => void;
  isMobile: boolean;
};

export function ProgramsList({
  programs,
  searchQuery,
  onSearchChange,
  onProgramClick,
  onProgramDelete,
  onPublishDateChange,
  onExportPdf,
  onCreateTake,
  isMobile
}: ProgramsListProps) {
  // Get sidebar state from the shadcn sidebar context
  const { setOpen } = useSidebar();
  
  // Filter and sort programs by name, applying search filter
  const filteredPrograms = programs
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
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

  return (
    <div className="p-4 flex-1 flex flex-col overflow-hidden">
      <h3 
        className="text-sm font-medium mb-2 cursor-pointer flex items-center gap-2" 
        onClick={handleProgramsHeaderClick}
      >
        <Radio className="h-4 w-4" />
        <span>Programmi Radio</span>
      </h3>
      
      {/* Search field under the "Programmi Radio" title */}
      <div className="flex items-center mb-3">
        <Search className="h-4 w-4 text-muted-foreground mr-1" />
        <Input 
          placeholder="Cerca programmi..." 
          className="h-7 text-xs" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
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
                if (isMobile) setOpen(false);
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
  );
}
