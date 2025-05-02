
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { ProgramCreation } from "@/components/ProgramCreation";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { generateProgramPdf } from "@/utils/pdfGenerator";

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

// In-memory storage for takes (in a real app, this would be in a database)
const programTakes: Record<string, Take[]> = {};

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  const handleCreateProgram = (newProgram: Omit<Program, "id">) => {
    const program = {
      ...newProgram,
      id: `program-${Date.now()}`,
    };
    setPrograms([...programs, program]);
    setSelectedProgramId(program.id);
    
    // Initialize program takes
    programTakes[program.id] = [];
  };
  
  const handleUpdateProgram = (updatedProgram: Program) => {
    // Special case for reset action
    if (updatedProgram.id === 'reset') {
      setSelectedProgramId(undefined);
      return;
    }
    
    setPrograms(
      programs.map((p) => (p.id === updatedProgram.id ? updatedProgram : p))
    );
  };
  
  const handleDeleteProgram = (programId: string) => {
    setPrograms(programs.filter((p) => p.id !== programId));
    
    if (selectedProgramId === programId) {
      setSelectedProgramId(undefined);
    }
    
    // Remove program takes
    if (programTakes[programId]) {
      delete programTakes[programId];
    }
    
    toast({
      title: "Programma eliminato",
      description: "Il programma è stato eliminato con successo",
    });
  };
  
  const handleProgramClick = (programId: string) => {
    setSelectedProgramId(programId);
  };
  
  const handlePublishDateChange = (programId: string, date: Date | null) => {
    setPrograms(
      programs.map((p) => 
        p.id === programId ? { ...p, publishDate: date } : p
      )
    );
  };
  
  const handleExportToPdf = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    if (!program) return;
    
    // Get takes for the program (or use empty array if none exist)
    const takes = programTakes[programId] || [];
    
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
  
  // Save takes to our in-memory storage
  const handleSaveTakes = (programId: string, takes: Take[]) => {
    if (programId) {
      programTakes[programId] = [...takes];
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          programs={programs}
          onProgramClick={handleProgramClick}
          onProgramDelete={handleDeleteProgram}
          onPublishDateChange={handlePublishDateChange}
          onExportPdf={handleExportToPdf}
        />
        <main className="flex-1 overflow-y-auto">
          <ProgramCreation
            programs={programs}
            onProgramCreate={handleCreateProgram}
            onProgramUpdate={handleUpdateProgram}
            selectedProgramId={selectedProgramId}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
