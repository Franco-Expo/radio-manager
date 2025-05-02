
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SongItemProps = {
  id: string;
  title: string;
  news: string;
  onDelete: (id: string) => void;
  onChange: (id: string, field: "title" | "news", value: string) => void;
};

export function SongItem({ id, title, news, onDelete, onChange }: SongItemProps) {
  return (
    <div className="space-y-4 p-4 border rounded-md relative">
      <div className="space-y-2">
        <Label htmlFor={`title-${id}`}>Titolo Canzone - Artista</Label>
        <Input
          id={`title-${id}`}
          value={title}
          onChange={(e) => onChange(id, "title", e.target.value)}
          placeholder="Inserisci il titolo della canzone e l'artista"
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
      
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => onDelete(id)}
        className="absolute top-2 right-2"
      >
        Cancella
      </Button>
    </div>
  );
}
