
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Save } from "lucide-react";
import { toast as sonnerToast } from 'sonner';
import { TakeHeader } from "./TakeHeader";
import { SongList } from "./SongList";

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
  onSaveComplete?: () => void; // Made optional, won't be called after successful save
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
  
  // Update date when initialDate changes
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
  
  const handleClearSongContent = (id: string) => {
    setSongs(
      songs.map((song) => (song.id === id ? { ...song, title: "", news: "" } : song))
    );
    sonnerToast.success("Contenuto cancellato");
  };
  
  const handleSave = async () => {
    const result = await onSave(songs, date);
    
    if (result) {
      sonnerToast.success("Salvataggio completato", {
        description: "I dati sono stati salvati con successo"
      });
      // Removed the onSaveComplete call here to prevent page navigation
    } else {
      sonnerToast.error("Errore durante il salvataggio", {
        description: "Si è verificato un errore durante il salvataggio dei dati"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-6 pb-2">
        <TakeHeader 
          takeNumber={takeNumber} 
          date={date} 
          onDateChange={setDate} 
        />
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        <SongList 
          songs={songs}
          onSongChange={handleSongChange}
          onDeleteSong={handleDeleteSong}
          onAddSong={handleAddSong}
          onClearSongContent={handleClearSongContent}
        />
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onDelete}>
          Cancella Take
        </Button>
        <Button variant="default" onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Salva
        </Button>
      </CardFooter>
    </Card>
  );
}
