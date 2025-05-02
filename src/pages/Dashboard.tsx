
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { ProgramCreation } from "@/components/ProgramCreation";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type Program = {
  id: string;
  name: string;
  publishDate: Date | null;
};

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
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          programs={programs}
          onProgramClick={handleProgramClick}
          onProgramDelete={handleDeleteProgram}
          onPublishDateChange={handlePublishDateChange}
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
