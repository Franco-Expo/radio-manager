
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateProgramPdf } from "@/utils/pdfGenerator";
import { usePrograms } from "@/hooks/usePrograms";
import { useTakes } from "@/hooks/useTakes";
import { sonnerToast } from "sonner";
import { Program } from "@/types/programs";
import { Take } from "@/types/takes";

export function useDashboardState() {
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  
  const { 
    programs, 
    isLoading: programsLoading, 
    createProgram, 
    updateProgramPublishDate, 
    deleteProgram,
    saveProgram
  } = usePrograms();
  
  const {
    takes,
    isLoading: takesLoading,
    createTake,
    updateTake,
    deleteTake
  } = useTakes(selectedProgramId);
  
  // Debugging for selectedProgramId changes
  useEffect(() => {
    console.log("Selected program ID changed:", selectedProgramId);
  }, [selectedProgramId]);

  // Debugging for takes loading
  useEffect(() => {
    console.log("Takes updated:", takes);
  }, [takes]);
  
  const handleCreateProgram = async (newProgram: { name: string; publishDate: Date | null }) => {
    const createdProgram = await createProgram(newProgram.name);
    if (createdProgram) {
      console.log("Program created:", createdProgram);
      setSelectedProgramId(createdProgram.id);
      
      // Create first take
      const firstTake = await createTake(1);
      console.log("First take created:", firstTake);
    }
    
    return createdProgram;
  };
  
  const handleUpdateProgram = (updatedProgram: { id: string; name: string; publishDate: Date | null }) => {
    // Special case for reset action
    if (updatedProgram.id === 'reset') {
      setSelectedProgramId(undefined);
      return;
    }
  };
  
  const handleProgramClick = (programId: string) => {
    console.log("Program clicked with ID:", programId);
    setSelectedProgramId(programId);
    
    // Provide UI feedback
    const program = programs.find(p => p.id === programId);
    if (program) {
      sonnerToast.success(`Programma selezionato: ${program.name}`);
    }
  };
  
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
      const newTake = await createTake(nextTakeNumber);
      if (newTake) {
        sonnerToast.success(`Nuova Take ${nextTakeNumber} creata`);
        console.log("New take created:", newTake);
      }
      return newTake;
    } catch (error) {
      console.error("Error creating new take:", error);
      sonnerToast.error("Errore nella creazione della nuova take");
      return null;
    }
  };
  
  const handleExportToPdf = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    if (!program) {
      toast({
        title: "Errore",
        description: "Programma non trovato",
        variant: "destructive",
      });
      return;
    }
    
    // Make sure we have the takes for this specific program
    if (selectedProgramId !== programId) {
      setSelectedProgramId(programId);
      setTimeout(() => {
        try {
          generateProgramPdf(program, takes);
          toast({
            title: "PDF generato",
            description: `Il programma "${program.name}" è stato salvato come PDF`,
          });
        } catch (error) {
          toast({
            title: "Errore",
            description: "Si è verificato un errore durante la generazione del PDF",
            variant: "destructive",
          });
          console.error("PDF generation error:", error);
        }
      }, 1000); // Give time for the takes to load
    } else {
      try {
        generateProgramPdf(program, takes);
        toast({
          title: "PDF generato",
          description: `Il programma "${program.name}" è stato salvato come PDF`,
        });
      } catch (error) {
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante la generazione del PDF",
          variant: "destructive",
        });
        console.error("PDF generation error:", error);
      }
    }
  };

  return {
    selectedProgramId,
    setSelectedProgramId,
    programs,
    takes,
    programsLoading,
    takesLoading,
    handleCreateProgram,
    handleUpdateProgram,
    handleProgramClick,
    handleCreateTake,
    handleExportToPdf,
    updateProgramPublishDate,
    deleteProgram,
    createTake,
    updateTake,
    deleteTake,
    saveProgram
  };
}
