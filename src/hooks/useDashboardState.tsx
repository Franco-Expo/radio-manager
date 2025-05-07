
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateProgramPdf } from "@/utils/pdfGenerator";
import { usePrograms } from "@/hooks/usePrograms";
import { useTakes } from "@/hooks/useTakes";
import { toast } from "sonner";
import { Program } from "@/types/programs";
import { Take } from "@/types/takes";
import { useProgramSelection } from './useProgramSelection';
import { useProgramCreation } from './useProgramCreation';
import { useTakeCreation } from './useTakeCreation';
import { usePdfExport } from './usePdfExport';

export function useDashboardState() {
  // Use the programSelection hook for managing selected program
  const {
    selectedProgramId,
    setSelectedProgramId,
    handleProgramClick,
    handleUpdateProgram
  } = useProgramSelection();
  
  // Get program and take data from their respective hooks
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
  
  // Debugging for takes loading
  useEffect(() => {
    console.log("Takes updated:", takes);
  }, [takes]);
  
  // Use more specialized hooks and pass them the data they need
  const { handleCreateProgram } = useProgramCreation(
    createProgram, 
    (programId, number) => createTake(number), 
    setSelectedProgramId
  );
  
  const { handleCreateTake } = useTakeCreation(
    takes, 
    (programId, number) => createTake(number), 
    setSelectedProgramId
  );
  
  const { handleExportToPdf } = usePdfExport(
    programs, 
    takes, 
    selectedProgramId, 
    setSelectedProgramId
  );

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
