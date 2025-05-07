
import { toast } from "sonner";
import { Take } from "@/types/takes";

export function useTakeCreation(
  takes: Take[],
  createTake: (programId: string, number: number) => Promise<Take | null>,
  setSelectedProgramId: (id: string | undefined) => void
) {
  const handleCreateTake = async (programId: string) => {
    console.log("Creating new take for program ID:", programId);
    
    // First select the program
    setSelectedProgramId(programId);
    
    // Find the highest take number to create the next one
    const programTakes = takes.filter(take => take.number);
    const nextTakeNumber = programTakes.length > 0 
      ? Math.max(...programTakes.map(take => take.number)) + 1 
      : 1;
    
    try {
      const newTake = await createTake(programId, nextTakeNumber);
      if (newTake) {
        toast.success(`Nuova Take ${nextTakeNumber} creata`);
        console.log("New take created:", newTake);
      }
      return newTake;
    } catch (error) {
      console.error("Error creating new take:", error);
      toast.error("Errore nella creazione della nuova take");
      return null;
    }
  };

  return {
    handleCreateTake
  };
}
