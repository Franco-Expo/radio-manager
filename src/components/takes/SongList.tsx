
import { Button } from "@/components/ui/button";
import { SongItem } from "./SongItem";

type SongInfo = {
  id: string;
  title: string;
  news: string;
  artist?: string;
  productionDate?: Date | null;
};

type SongListProps = {
  songs: SongInfo[];
  onSongChange: (id: string, field: "title" | "news" | "artist" | "productionDate", value: string | Date | null) => void;
  onDeleteSong: (id: string) => void;
  onAddSong: () => void;
  onClearSongContent?: (id: string) => void;
};

export function SongList({ 
  songs, 
  onSongChange, 
  onDeleteSong, 
  onAddSong,
  onClearSongContent 
}: SongListProps) {
  return (
    <div className="space-y-4">
      {songs.map((song) => (
        <SongItem
          key={song.id}
          id={song.id}
          title={song.title}
          news={song.news}
          artist={song.artist}
          productionDate={song.productionDate}
          onDelete={onDeleteSong}
          onChange={onSongChange}
          onClearContent={onClearSongContent}
        />
      ))}
      
      <Button onClick={onAddSong}>Aggiungi Canzone e Notizia</Button>
    </div>
  );
}
