
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { ProgramCreation } from "@/components/programs/ProgramCreation";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { generateProgramPdf } from "@/utils/pdfGenerator";
import { usePrograms } from "@/hooks/usePrograms";
import type { Program } from '@/types/programs';
import { useTakes } from "@/hooks/useTakes";
import { Loader2 } from "lucide-react";
import { toast as sonnerToast } from "sonner";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
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
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

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
  
  const handleExportToPdf = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    if (!program) return;
    
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
  };
  
  // Show loading state
  if (programsLoading) {
    return (
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Caricamento programmi...</span>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          programs={programs}
          onProgramClick={handleProgramClick}
          onProgramDelete={deleteProgram}
          onPublishDateChange={updateProgramPublishDate}
          onExportPdf={handleExportToPdf}
        />
        <main className="flex-1 overflow-y-auto">
          {takesLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Caricamento takes...</span>
            </div>
          ) : (
            <ProgramCreation
              programs={programs}
              takes={takes}
              onProgramCreate={handleCreateProgram}
              onProgramUpdate={handleUpdateProgram}
              selectedProgramId={selectedProgramId}
              onTakeCreate={createTake}
              onTakeUpdate={updateTake}
              onTakeDelete={deleteTake}
              onProgramSave={saveProgram}
            />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
