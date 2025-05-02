
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
import { CalendarIcon } from "lucide-react";

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
};

export function ProgramItem({ program, onClick, onDelete, onPublishDateChange }: ProgramItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
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
          className="text-destructive focus:text-destructive" 
          onClick={onDelete}
        >
          Cancella
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
