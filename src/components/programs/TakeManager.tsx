
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TakeEditor } from "@/components/takes/TakeEditor";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Take } from "@/types/takes";
import type { Program } from "@/types/programs";

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
            <TabsTrigger key={take.id} value={take.id}>
              Take{String(take.number).padStart(2, '0')}
            </TabsTrigger>
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

type ActionButtonsProps = {
  onAddTake: () => void;
  onSaveProgram: () => void;
};

function ActionButtons({ onAddTake, onSaveProgram }: ActionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={onAddTake}>
        Aggiungi Altra Take
      </Button>
      <Button 
        variant="default" 
        onClick={onSaveProgram}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        Salva il Programma
      </Button>
    </div>
  );
}

type TabContentsProps = {
  takes: Take[];
  activeTake: string | undefined;
  onDeleteTake: (takeId: string) => void;
  onSaveTake: (takeId: string, songs: { id: string; title: string; news: string }[], date: Date) => Promise<boolean>;
  onSaveComplete: () => void;
};

function TabContents({ takes, activeTake, onDeleteTake, onSaveTake, onSaveComplete }: TabContentsProps) {
  return (
    <>
      {takes.map((take) => (
        <TabsContent key={take.id} value={take.id} className="mt-4">
          <TakeEditor
            takeId={take.id}
            takeNumber={take.number}
            initialSongs={take.songs}
            initialDate={take.date}
            onDelete={() => onDeleteTake(take.id)}
            onSave={(songs, date) => onSaveTake(take.id, songs, date)}
            onSaveComplete={onSaveComplete}
          />
        </TabsContent>
      ))}
    </>
  );
}
