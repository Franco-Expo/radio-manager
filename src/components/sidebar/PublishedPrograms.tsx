
import { useState } from "react";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

type Program = {
  id: string;
  name: string;
  publishDate: Date | null;
};

type PublishedProgramsProps = {
  programs: Program[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onProgramClick: (programId: string) => void;
  isMobile: boolean;
  setIsCollapsed: (value: boolean) => void;
};

export function PublishedPrograms({
  programs,
  searchQuery,
  onSearchChange,
  onProgramClick,
  isMobile,
  setIsCollapsed
}: PublishedProgramsProps) {
  // Filter published programs by search query and sort them
  const filteredPublishedPrograms = programs
    .filter(p => p.publishDate && p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (a.publishDate && b.publishDate) {
        return b.publishDate.getTime() - a.publishDate.getTime();
      }
      return 0;
    });
  
  // Take only the first 2 items for initial display
  const visiblePublishedPrograms = filteredPublishedPrograms.slice(0, 2);
  const hasMorePublishedPrograms = filteredPublishedPrograms.length > 2;

  return (
    <div className="p-4 border-b flex flex-col">
      <div className="flex items-center mb-2">
        <h3 className="text-sm font-medium flex-1">Pubblicazione</h3>
      </div>
      
      <div className="flex items-center mb-3">
        <Search className="h-4 w-4 text-muted-foreground mr-1" />
        <Input 
          placeholder="Cerca pubblicazione..." 
          className="h-7 text-xs" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Cerca Pubblicazione"
        />
      </div>
      
      {/* Always show the section, even if no results */}
      {filteredPublishedPrograms.length > 0 ? (
        <>
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
          
          {/* Show ScrollArea if there are more than 2 items */}
          {hasMorePublishedPrograms && (
            <ScrollArea className="h-auto max-h-[15vh] pr-2 mt-1">
              <div className="space-y-1 pr-2">
                {filteredPublishedPrograms.slice(2).map((program) => (
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
        </>
      ) : (
        <div className="text-xs text-muted-foreground italic">
          Nessuna pubblicazione trovata
        </div>
      )}
    </div>
  );
}
