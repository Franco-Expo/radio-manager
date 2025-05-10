
import { TabsContent } from "@/components/ui/tabs";
import { TakeEditor } from "@/components/takes/TakeEditor";
import type { Take } from "@/types/takes";

type TabContentsProps = {
  takes: Take[];
  activeTake: string | undefined;
  onDeleteTake: (takeId: string) => void;
  onSaveTake: (takeId: string, songs: { id: string; title: string; news: string; artist?: string }[], date: Date, publishDate: Date | null) => Promise<boolean>; // Updated signature to include publishDate
  onSaveComplete: () => void;
};

export function TabContents({ 
  takes, 
  activeTake, 
  onDeleteTake, 
  onSaveTake, 
  onSaveComplete 
}: TabContentsProps) {
  return (
    <>
      {takes.map((take) => (
        <TabsContent key={take.id} value={take.id} className="mt-4">
          <TakeEditor
            takeId={take.id}
            takeNumber={take.number}
            initialSongs={take.songs}
            initialDate={take.date}
            initialPublishDate={take.publishDate}
            onDelete={() => onDeleteTake(take.id)}
            onSave={(songs, date, publishDate) => onSaveTake(take.id, songs, date, publishDate)}
            onSaveComplete={onSaveComplete}
          />
        </TabsContent>
      ))}
    </>
  );
}
