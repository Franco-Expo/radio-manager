
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type TakeHeaderProps = {
  takeNumber: number;
  date: Date;
  onDateChange: (date: Date) => void;
};

export function TakeHeader({ takeNumber, date, onDateChange }: TakeHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between border-b pb-2 space-y-0">
      <h3 className="text-2xl font-semibold leading-none tracking-tight">
        Take{String(takeNumber).padStart(2, '0')}
      </h3>
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-auto justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "dd/MM/yyyy") : <span>Seleziona data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
              locale={it}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
