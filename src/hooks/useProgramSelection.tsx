
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Program } from "@/types/programs";

export function useProgramSelection() {
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>(undefined);
  
  // Debugging for selectedProgramId changes
  useEffect(() => {
    console.log("Selected program ID changed:", selectedProgramId);
  }, [selectedProgramId]);
  
  const handleProgramClick = (programId: string) => {
    console.log("Program clicked with ID:", programId);
    setSelectedProgramId(programId);
    
    // Provide UI feedback
    toast.success(`Programma selezionato`);
  };
  
  const handleUpdateProgram = (updatedProgram: { id: string; name: string; publishDate: Date | null }) => {
    // Special case for reset action
    if (updatedProgram.id === 'reset') {
      setSelectedProgramId(undefined);
      return;
    }
  };

  return {
    selectedProgramId,
    setSelectedProgramId,
    handleProgramClick,
    handleUpdateProgram
  };
}
