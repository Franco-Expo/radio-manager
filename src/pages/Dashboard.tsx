import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { ProgramCreation } from "@/components/ProgramCreation";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { generateProgramPdf } from "@/utils/pdfGenerator";
import { usePrograms } from "@/hooks/usePrograms";
import { useTakes } from "@/hooks/useTakes";
import { Loader2 } from "lucide-react";

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
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  const handleCreateProgram = async (newProgram: { name: string; publishDate: Date | null }) => {
    const createdProgram = await createProgram(newProgram.name);
    if (createdProgram) {
      setSelectedProgramId(createdProgram.id);
      
      // Create first take
      await createTake(1);
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
    setSelectedProgramId(programId);
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
