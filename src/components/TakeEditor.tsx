
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { it } from "date-fns/locale";
import { toast as sonnerToast } from 'sonner';

type SongInfo = {
  id: string;
  title: string;
  news: string;
};

type TakeEditorProps = {
  takeId: string;
  takeNumber: number;
  initialSongs: SongInfo[];
  initialDate?: Date;
  onDelete: () => void;
  onSave: (songs: SongInfo[], date: Date) => Promise<boolean>;
  onSaveComplete?: () => void;
};

export function TakeEditor({ 
  takeId, 
  takeNumber, 
  initialSongs,
  initialDate,
  onDelete, 
  onSave, 
  onSaveComplete 
}: TakeEditorProps) {
  const [songs, setSongs] = useState<SongInfo[]>(
    initialSongs.length > 0 
      ? initialSongs 
      : [{ id: `song-${Date.now()}`, title: "", news: "" }]
  );
  const [date, setDate] = useState<Date>(initialDate || new Date());
  const { toast } = useToast();
  
  // Aggiorniamo la data quando cambia initialDate
  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);
  
  const handleAddSong = () => {
    setSongs([...songs, { id: `song-${Date.now()}`, title: "", news: "" }]);
  };
  
  const handleSongChange = (id: string, field: keyof SongInfo, value: string) => {
    setSongs(
      songs.map((song) => (song.id === id ? { ...song, [field]: value } : song))
    );
  };
  
  const handleDeleteSong = (id: string) => {
    if (songs.length <= 1) {
      toast({
        title: "Impossibile eliminare",
        description: "È necessario almeno una canzone nella take",
        variant: "destructive",
      });
      return;
    }
    setSongs(songs.filter((song) => song.id !== id));
  };
  
  const handleSave = async () => {
    const result = await onSave(songs, date);
    
    if (result) {
      // Mostriamo un messaggio di conferma in italiano
      sonnerToast.success("Salvataggio completato", {
        description: "I dati sono stati salvati con successo"
      });
    } else {
      sonnerToast.error("Errore durante il salvataggio", {
        description: "Si è verificato un errore durante il salvataggio dei dati"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-2 space-y-0">
        <CardTitle>Take{String(takeNumber).padStart(2, '0')}</CardTitle>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
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
                onSelect={(date) => date && setDate(date)}
                initialFocus
                locale={it}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {songs.map((song) => (
          <div key={song.id} className="space-y-4 p-4 border rounded-md relative">
            <div className="space-y-2">
              <Label htmlFor={`title-${song.id}`}>Titolo Canzone - Artista</Label>
              <Input
                id={`title-${song.id}`}
                value={song.title}
                onChange={(e) => handleSongChange(song.id, "title", e.target.value)}
                placeholder="Inserisci il titolo della canzone e l'artista"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`news-${song.id}`}>Notizia</Label>
              <div className="border rounded-md p-2 min-h-[150px]">
                <textarea
                  id={`news-${song.id}`}
                  value={song.news}
                  onChange={(e) => handleSongChange(song.id, "news", e.target.value)}
                  placeholder="Inserisci la notizia qui..."
                  className="w-full h-full min-h-[120px] outline-none resize-y bg-transparent"
                />
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleDeleteSong(song.id)}
              className="absolute top-2 right-2"
            >
              Cancella
            </Button>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button onClick={handleAddSong}>Aggiungi Canzone e Notizia</Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onDelete}>Cancella Take</Button>
          <Button variant="default" onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Salva
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
