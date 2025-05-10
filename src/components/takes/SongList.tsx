
import { Button } from "@/components/ui/button";
import { SongItem } from "./SongItem";

type SongInfo = {
  id: string;
  title: string;
  news: string;
  artist?: string;
};

type SongListProps = {
  songs: SongInfo[];
  onSongChange: (id: string, field: "title" | "news" | "artist", value: string) => void;
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
          onDelete={onDeleteSong}
          onChange={onSongChange}
          onClearContent={onClearSongContent}
        />
      ))}
      
      <Button onClick={onAddSong}>Aggiungi Canzone e Notizia</Button>
    </div>
  );
}
