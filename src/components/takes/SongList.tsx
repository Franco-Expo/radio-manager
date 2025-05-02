
import { Button } from "@/components/ui/button";
import { SongItem } from "./SongItem";

type SongInfo = {
  id: string;
  title: string;
  news: string;
};

type SongListProps = {
  songs: SongInfo[];
  onSongChange: (id: string, field: "title" | "news", value: string) => void;
  onDeleteSong: (id: string) => void;
  onAddSong: () => void;
};

export function SongList({ songs, onSongChange, onDeleteSong, onAddSong }: SongListProps) {
  return (
    <div className="space-y-4">
      {songs.map((song) => (
        <SongItem
          key={song.id}
          id={song.id}
          title={song.title}
          news={song.news}
          onDelete={onDeleteSong}
          onChange={onSongChange}
        />
      ))}
      
      <Button onClick={onAddSong}>Aggiungi Canzone e Notizia</Button>
    </div>
  );
}
