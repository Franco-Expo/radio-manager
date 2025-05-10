
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrashIcon, Eraser } from "lucide-react";

type SongItemProps = {
  id: string;
  title: string;
  news: string;
  artist?: string; // Added artist as optional prop
  onDelete: (id: string) => void;
  onChange: (id: string, field: "title" | "news" | "artist", value: string) => void;
  onClearContent?: (id: string) => void;
};

export function SongItem({ id, title, news, artist = "", onDelete, onChange, onClearContent }: SongItemProps) {
  const handleClearContent = () => {
    if (onClearContent) {
      onClearContent(id);
    } else {
      // Fallback if onClearContent is not provided
      onChange(id, "title", "");
      onChange(id, "news", "");
      onChange(id, "artist", "");
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
