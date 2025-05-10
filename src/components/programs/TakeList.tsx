import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TakeEditor } from "@/components/takes/TakeEditor";
import { Save } from "lucide-react";
import type { Take } from "@/types/takes";
import type { Program } from "@/types/programs";

type TakeListProps = {
  selectedProgram: Program;
  takes: Take[];
  onTakeCreate: (takeNumber: number) => Promise<Take | null>;
  onTakeUpdate: (takeId: string, songs: { id: string; title: string; news: string; artist?: string }[], date: Date, publishDate: Date | null) => Promise<boolean>;
  onTakeDelete: (takeId: string) => Promise<void>;
  onSaveProgram: (programId: string) => Promise<void>;
  onSaveComplete: () => void;
};

export function TakeList({ 
  selectedProgram, 
  takes, 
  onTakeCreate, 
  onTakeUpdate, 
  onTakeDelete,
  onSaveProgram,
  onSaveComplete
}: TakeListProps) {
  const [activeTake, setActiveTake] = useState<string | undefined>(
    takes.length > 0 ? takes[0].id : undefined
  );
  
  const handleAddTake = async () => {
    const newTakeNumber = takes.length + 1;
    const newTake = await onTakeCreate(newTakeNumber);
    
    if (newTake) {
      setActiveTake(newTake.id);
    }
  };
  
  const handleDeleteTake = async (takeId: string) => {
    await onTakeDelete(takeId);
    
    // Set active take to first one if the active take was deleted
    if (takeId === activeTake && takes.length > 0) {
      setActiveTake(takes[0].id);
    }
  };
  
  const handleSaveTake = async (takeId: string, songs: { id: string; title: string; news: string; artist?: string }[], date: Date, publishDate: Date | null) => {
    return await onTakeUpdate(takeId, songs, date, publishDate);
  };
  
  const handleSaveProgram = async () => {
    await onSaveProgram(selectedProgram.id);
    onSaveComplete();
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{selectedProgram.name}</h2>
      </div>
      
      <Tabs value={activeTake} onValueChange={setActiveTake}>
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            {takes.map((take) => (
              <TabsTrigger key={take.id} value={take.id}>
                Take{String(take.number).padStart(2, '0')}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleAddTake}>
              Aggiungi Altra Take
            </Button>
            <Button 
              variant="default" 
              onClick={handleSaveProgram}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Salva il Programma
            </Button>
          </div>
        </div>
        
        {takes.map((take) => (
          <TabsContent key={take.id} value={take.id} className="mt-4">
            <TakeEditor
              takeId={take.id}
              takeNumber={take.number}
              initialSongs={take.songs}
              initialDate={take.date}
              initialPublishDate={take.publishDate}
              onDelete={() => handleDeleteTake(take.id)}
              onSave={(songs, date, publishDate) => handleSaveTake(take.id, songs, date, publishDate)}
              onSaveComplete={onSaveComplete}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
