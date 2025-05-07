
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Program } from "@/types/programs";
import { Take } from "@/types/takes";

export function useProgramCreation(
  createProgram: (name: string) => Promise<Program | null>,
  createTake: (programId: string, number: number) => Promise<Take | null>,
  setSelectedProgramId: (id: string | undefined) => void
) {
  const { toast: uiToast } = useToast();
  
  const handleCreateProgram = async (newProgram: { name: string; publishDate: Date | null }) => {
    const createdProgram = await createProgram(newProgram.name);
    if (createdProgram) {
      console.log("Program created:", createdProgram);
      setSelectedProgramId(createdProgram.id);
      
      // Create first take
      const firstTake = await createTake(createdProgram.id, 1);
      console.log("First take created:", firstTake);
    }
    
    return createdProgram;
  };

  return {
    handleCreateProgram
  };
}
