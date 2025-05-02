
import { useState, useEffect } from "react";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Take } from "@/types/takes";
import type { Program } from "@/types/programs";
import { ActionButtons } from "./ActionButtons";
import { TabContents } from "./TabContents";
import { TakeTab } from "./TakeTab";

type TakeManagerProps = {
  takes: Take[];
  selectedProgram: Program;
  onTakeCreate: (takeNumber: number) => Promise<Take | null>;
  onTakeUpdate: (takeId: string, songs: { id: string; title: string; news: string }[], date: Date) => Promise<boolean>;
  onTakeDelete: (takeId: string) => Promise<void>;
  onSaveProgram: (programId: string) => Promise<void>;
  onSaveComplete: () => void;
};

export function TakeManager({
  takes,
  selectedProgram,
  onTakeCreate,
  onTakeUpdate,
  onTakeDelete,
  onSaveProgram,
  onSaveComplete
}: TakeManagerProps) {
  const [activeTake, setActiveTake] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  // Set active take to first take if none selected and takes exist
  useEffect(() => {
    if (takes.length > 0 && !activeTake) {
      setActiveTake(takes[0].id);
    }
  }, [takes, activeTake]);

  const handleAddTake = async () => {
    const newTakeNumber = takes.length + 1;
    const newTake = await onTakeCreate(newTakeNumber);
    
    if (newTake) {
      setActiveTake(newTake.id);
    }
  };

  const handleDeleteTake = async (takeId: string) => {
    if (takes.length <= 1) {
      toast({
        title: "Impossibile eliminare",
        description: "È necessario almeno una take nel programma",
        variant: "destructive",
      });
      return;
    }
    
    await onTakeDelete(takeId);
    
    // Set active take to first one if the active take was deleted
    if (takeId === activeTake && takes.length > 0) {
      setActiveTake(takes[0].id);
    }
  };

  const handleSaveTake = async (takeId: string, songs: { id: string; title: string; news: string }[], date: Date) => {
    return await onTakeUpdate(takeId, songs, date);
  };

  const handleSaveProgram = async () => {
    if (selectedProgram) {
      await onSaveProgram(selectedProgram.id);
      toast({
        title: "Programma salvato",
        description: "Il programma è stato salvato con successo nel database",
      });
      // After saving, return to the initial screen
      onSaveComplete();
    }
  };

  return (
    <Tabs value={activeTake} onValueChange={setActiveTake}>
      <div className="flex items-center justify-between mb-2">
        <TabsList>
          {takes.map((take) => (
            <TakeTab key={take.id} id={take.id} number={take.number} />
          ))}
        </TabsList>
        <ActionButtons 
          onAddTake={handleAddTake} 
          onSaveProgram={handleSaveProgram} 
        />
      </div>
      
      <TabContents 
        takes={takes} 
        activeTake={activeTake} 
        onDeleteTake={handleDeleteTake}
        onSaveTake={handleSaveTake}
        onSaveComplete={onSaveComplete}
      />
    </Tabs>
  );
}
