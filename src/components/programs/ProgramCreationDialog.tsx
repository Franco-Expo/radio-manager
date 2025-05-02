
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Program } from "@/types/programs";

type ProgramCreationDialogProps = {
  onProgramCreate: (program: Omit<Program, "id">) => Promise<Program | null>;
};

export function ProgramCreationDialog({ onProgramCreate }: ProgramCreationDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProgramName, setNewProgramName] = useState("");
  const { toast } = useToast();
  
  const handleCreateProgram = async () => {
    if (newProgramName.trim() === "") {
      toast({
        title: "Errore",
        description: "Inserisci un nome per il programma",
        variant: "destructive",
      });
      return;
    }
    
    const createdProgram = await onProgramCreate({
      name: newProgramName,
      publishDate: null,
    });
    
    if (createdProgram) {
      setIsDialogOpen(false);
      setNewProgramName("");
      
      toast({
        title: "Programma creato",
        description: `Il programma "${newProgramName}" è stato creato con successo`,
      });
    }
    // We don't close the dialog in case of error to allow the user to correct the name
  };

  return (
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
            Inserisci il nome del tuo nuovo programma radiofonico. Il nome deve essere unico.
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
  );
}
