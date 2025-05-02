
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TakeEditor } from "./TakeEditor";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Program = {
  id: string;
  name: string;
  publishDate: Date | null;
};

type Take = {
  id: string;
  number: number;
  songs: { id: string; title: string; news: string }[];
};

type ProgramCreationProps = {
  programs: Program[];
  onProgramCreate: (program: Omit<Program, "id">) => void;
  onProgramUpdate: (program: Program) => void;
  selectedProgramId?: string;
};

export function ProgramCreation({ programs, onProgramCreate, onProgramUpdate, selectedProgramId }: ProgramCreationProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProgramName, setNewProgramName] = useState("");
  const [activeTake, setActiveTake] = useState("take-0");
  const [takes, setTakes] = useState<Take[]>([]);
  const { toast } = useToast();
  
  const selectedProgram = selectedProgramId 
    ? programs.find(p => p.id === selectedProgramId) 
    : undefined;
  
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
    
    // Create first take
    setTakes([{ id: "take-0", number: 1, songs: [{ id: `song-${Date.now()}`, title: "", news: "" }] }]);
    setActiveTake("take-0");
    
    toast({
      title: "Programma creato",
      description: `Il programma "${newProgramName}" è stato creato con successo`,
    });
  };
  
  const handleAddTake = () => {
    const newTakeNumber = takes.length + 1;
    const newTakeId = `take-${Date.now()}`;
    
    setTakes([
      ...takes,
      { 
        id: newTakeId, 
        number: newTakeNumber, 
        songs: [{ id: `song-${Date.now()}`, title: "", news: "" }]
      }
    ]);
    
    setActiveTake(newTakeId);
  };
  
  const handleDeleteTake = (takeId: string) => {
    if (takes.length <= 1) {
      toast({
        title: "Impossibile eliminare",
        description: "È necessario almeno una take nel programma",
        variant: "destructive",
      });
      return;
    }
    
    const updatedTakes = takes.filter(t => t.id !== takeId);
    setTakes(updatedTakes);
    
    // Update take numbers
    const renumberedTakes = updatedTakes.map((take, idx) => ({
      ...take,
      number: idx + 1
    }));
    
    setTakes(renumberedTakes);
    
    // Set active take to first one if the active take was deleted
    if (takeId === activeTake && renumberedTakes.length > 0) {
      setActiveTake(renumberedTakes[0].id);
    }
  };
  
  const handleSaveTake = (takeId: string, songs: { id: string; title: string; news: string }[]) => {
    setTakes(
      takes.map(take => 
        take.id === takeId ? { ...take, songs } : take
      )
    );
  };
  
  const handleSaveAll = () => {
    // In a real app, this would send data to a backend
    toast({
      title: "Salvato",
      description: "Tutte le take sono state salvate con successo",
    });
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center my-8">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="text-lg py-6">
              Crea un Nuovo Programma
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuovo Programma Radiofonico</DialogTitle>
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
                  onDelete={() => handleDeleteTake(take.id)}
                  onSave={handleSaveTake}
                />
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="flex justify-end mt-8">
            <Button size="lg" onClick={handleSaveAll}>
              Salva Tutto
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
