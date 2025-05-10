
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrashIcon, Eraser, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type SongItemProps = {
  id: string;
  title: string;
  news: string;
  artist?: string;
  productionDate?: Date | null;
  onDelete: (id: string) => void;
  onChange: (id: string, field: "title" | "news" | "artist" | "productionDate", value: string | Date | null) => void;
  onClearContent?: (id: string) => void;
};

export function SongItem({ 
  id, 
  title, 
  news, 
  artist = "", 
  productionDate = null, 
  onDelete, 
  onChange, 
  onClearContent 
}: SongItemProps) {
  const handleClearContent = () => {
    if (onClearContent) {
      onClearContent(id);
    } else {
      // Fallback if onClearContent is not provided
      onChange(id, "title", "");
      onChange(id, "news", "");
      onChange(id, "artist", "");
      onChange(id, "productionDate", null);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md relative">
      <div className="space-y-2">
        <Label htmlFor={`title-${id}`}>Artista - Titolo Canzone</Label>
        <Input
          id={`title-${id}`}
          value={title}
          onChange={(e) => onChange(id, "title", e.target.value)}
          placeholder="Inserisci l'artista e il titolo della canzone"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`production-date-${id}`}>Data di Produzione</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={`production-date-${id}`}
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !productionDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {productionDate ? format(productionDate, "PPP", { locale: it }) : <span>Seleziona data di produzione</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={productionDate || undefined}
              onSelect={(date) => onChange(id, "productionDate", date)}
              locale={it}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`news-${id}`}>Notizia</Label>
        <div className="border rounded-md p-2 min-h-[150px]">
          <textarea
            id={`news-${id}`}
            value={news}
            onChange={(e) => onChange(id, "news", e.target.value)}
            placeholder="Inserisci la notizia qui..."
            className="w-full h-full min-h-[120px] outline-none resize-y bg-transparent"
          />
        </div>
      </div>
      
      <div className="absolute top-2 right-2 flex gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleClearContent}
          title="Cancella contenuto"
        >
          <Eraser className="h-4 w-4" />
          <span className="sr-only">Cancella contenuto</span>
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(id)}
          title="Elimina elemento"
        >
          <TrashIcon className="h-4 w-4" />
          <span className="sr-only">Elimina</span>
        </Button>
      </div>
    </div>
  );
}
