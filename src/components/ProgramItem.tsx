
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarIcon, FileText, FilePlus, Trash2, X, Music } from "lucide-react";
import { toast as sonnerToast } from "sonner";

type Program = {
  id: string;
  name: string;
  publishDate: Date | null;
};

type ProgramItemProps = {
  program: Program;
  onClick: () => void;
  onDelete: () => void;
  onPublishDateChange: (date: Date | null) => void;
  onExportPdf: (programId: string) => void;
  onCreateTake?: (programId: string) => void;
};

export function ProgramItem({ 
  program, 
  onClick, 
  onDelete, 
  onPublishDateChange, 
  onExportPdf,
  onCreateTake 
}: ProgramItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Sei sicuro di voler cancellare questo programma e tutte le sue take?")) {
      onDelete();
    }
  };

  const handleClearPublishDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPublishDateChange(null);
    sonnerToast.success("Data di pubblicazione cancellata");
  };

  const handleCreateTake = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCreateTake) {
      onCreateTake(program.id);
    }
  };

  const handleExportProgramPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExportPdf(program.id);
  };

  const handleExportPlaylistPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    // We'll reuse the same handler but pass a special flag to indicate this is a playlist export
    onExportPdf(`${program.id}?playlist=true`);
  };
  
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer"
          onClick={onClick}
        >
          <span className="font-medium truncate">{program.name}</span>
          
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <CalendarIcon className="h-4 w-4" />
                <span className="sr-only">Seleziona data</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={program.publishDate || undefined}
                onSelect={(date) => {
                  onPublishDateChange(date);
                  setIsOpen(false);
                }}
                locale={it}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem 
          onClick={handleCreateTake}
          className="flex items-center gap-2"
        >
          <FilePlus className="h-4 w-4" />
          Crea nuova Take
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={handleExportProgramPdf}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Salva programma come PDF
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={handleExportPlaylistPdf}
          className="flex items-center gap-2"
        >
          <Music className="h-4 w-4" />
          Salva playlist come PDF
        </ContextMenuItem>
        {program.publishDate && (
          <ContextMenuItem 
            onClick={handleClearPublishDate}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancella data pubblicazione
          </ContextMenuItem>
        )}
        <ContextMenuItem 
          className="text-destructive focus:text-destructive flex items-center gap-2" 
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
          Cancella
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
