import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrashIcon, Eraser } from "lucide-react";

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

  // Format date for display in text field
  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    // Just return the date as a string
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Handle text input change for date
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // If empty, set to null
    if (!value) {
      onChange(id, "productionDate", null);
      return;
    }
    
    // Otherwise create a new date from the input value or store as is
    try {
      // Try to create a date if the input is in a valid format
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) {
        onChange(id, "productionDate", newDate);
      } else {
        // If not a valid date, store the text as is
        // Since our interface expects a Date or null, we'll need to convert this
        // to a Date object somehow - using current date as placeholder with the text as note
        const placeholder = new Date();
        onChange(id, "productionDate", placeholder);
      }
    } catch (error) {
      console.error("Error parsing date:", error);
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
        <Input
          id={`production-date-${id}`}
          type="text"
          value={formatDateForInput(productionDate)}
          onChange={handleDateChange}
          placeholder="Data di produzione"
          className="w-full"
        />
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
