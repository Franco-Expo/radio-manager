
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TakeEditor } from "./TakeEditor";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Take } from "@/hooks/useTakes";

type Program = {
  id: string;
  name: string;
  publishDate: Date | null;
};

type ProgramCreationProps = {
  programs: Program[];
  takes: Take[];
  onProgramCreate: (program: Omit<Program, "id">) => void;
  onProgramUpdate: (program: Program) => void;
  selectedProgramId?: string;
  onTakeCreate: (takeNumber: number) => Promise<Take | null>;
  onTakeUpdate: (takeId: string, songs: { id: string; title: string; news: string }[]) => Promise<boolean>;
  onTakeDelete: (takeId: string) => Promise<void>;
};

export function ProgramCreation({
  programs,
  takes,
  onProgramCreate,
  onProgramUpdate,
  selectedProgramId,
  onTakeCreate,
  onTakeUpdate,
  onTakeDelete
}: ProgramCreationProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProgramName, setNewProgramName] = useState("");
  const [activeTake, setActiveTake] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  
  const selectedProgram = selectedProgramId 
    ? programs.find(p => p.id === selectedProgramId) 
    : undefined;
  
  // Set active take to first take if none selected and takes exist
  useEffect(() => {
    if (takes.length > 0 && !activeTake) {
      setActiveTake(takes[0].id);
    }
  }, [takes, activeTake]);
  
  const handleCreateProgram = () => {
    if (newProgramName.trim() === "") {
      toast({
        title: "Errore",
        description: "Inserisci un nome per il programma",
        variant: "destructive",
      });
      return;
    }
    
    onProgramCreate({
      name: newProgramName,
      publishDate: null,
    });
    
    setIsDialogOpen(false);
    setNewProgramName("");
    
    toast({
      title: "Programma creato",
      description: `Il programma "${newProgramName}" è stato creato con successo`,
    });
  };
  
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
  
  const handleSaveTake = async (takeId: string, songs: { id: string; title: string; news: string }[]) => {
    return await onTakeUpdate(takeId, songs);
  };
  
  const handleReturnToNewProgram = () => {
    // Clear the selected program to return to new program screen
    if (selectedProgramId) {
      // Reset internal state
      setActiveTake(undefined);
      // Clear selected program in parent
      onProgramUpdate({...selectedProgram!, id: 'reset'});
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col justify-center items-center my-8">
        {!selectedProgram && (
          <p className="text-center text-lg mb-4 max-w-md">
            Crea la tua Playlist con le informazioni musicali e le ultime notizie
          </p>
        )}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="text-lg py-6">
              Crea un Nuovo Programma
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuovo Programma Radiofonico</DialogTitle>
              <DialogDescription>
                Inserisci il nome del tuo nuovo programma radiofonico.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="program-name">Nome del programma</Label>
                <Input
                  id="program-name"
                  placeholder="Inserisci il nome del programma"
                  value={newProgramName}
                  onChange={(e) => setNewProgramName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProgram}>Crea Programma</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {selectedProgram && takes.length > 0 && (
        <div className="flex-1 p-4">
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
              <Button variant="outline" onClick={handleAddTake}>
                Aggiungi Altra Take
              </Button>
            </div>
            
            {takes.map((take) => (
              <TabsContent key={take.id} value={take.id} className="mt-4">
                <TakeEditor
                  takeId={take.id}
                  takeNumber={take.number}
                  initialSongs={take.songs}
                  onDelete={() => handleDeleteTake(take.id)}
                  onSave={(songs) => handleSaveTake(take.id, songs)}
                  onSaveComplete={handleReturnToNewProgram}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
}
