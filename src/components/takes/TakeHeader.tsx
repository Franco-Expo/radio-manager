
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TakeHeaderProps = {
  takeNumber: number;
  date: Date;
  onDateChange: (date: Date) => void;
  publishDate?: Date | null;
  onPublishDateChange?: (date: Date | null) => void;
};

export function TakeHeader({ 
  takeNumber, 
  date, 
  onDateChange,
  publishDate,
  onPublishDateChange
}: TakeHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Take {String(takeNumber).padStart(2, '0')}</h2>
        <p className="text-sm text-muted-foreground">
          Data registrazione: {format(date, 'PPP', { locale: it })}
        </p>
      </div>
      
      <div className="mt-4 md:mt-0 flex flex-col space-y-2">
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full md:w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: it }) : <span>Seleziona data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && onDateChange(newDate)}
                locale={it}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Publication Date Selector */}
        <div>
          <p className="text-sm font-medium mb-1">Data di pubblicazione</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full md:w-[240px] justify-start text-left font-normal",
                  !publishDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {publishDate ? format(publishDate, "PPP", { locale: it }) : <span>Seleziona data pubblicazione</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={publishDate || undefined}
                onSelect={(newDate) => onPublishDateChange && onPublishDateChange(newDate)}
                locale={it}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
