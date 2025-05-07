
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useDashboardState } from "@/hooks/useDashboardState";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const {
    selectedProgramId,
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
  } = useDashboardState();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  // Show loading state
  if (programsLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Caricamento programmi...</span>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <DashboardContent 
        programs={programs}
        takes={takes}
        takesLoading={takesLoading}
        selectedProgramId={selectedProgramId}
        onProgramClick={handleProgramClick}
        onProgramDelete={deleteProgram}
        onPublishDateChange={updateProgramPublishDate}
        onExportPdf={handleExportToPdf}
        onCreateTake={handleCreateTake}
        onProgramCreate={handleCreateProgram}
        onProgramUpdate={handleUpdateProgram}
        onTakeCreate={createTake}
        onTakeUpdate={updateTake}
        onTakeDelete={deleteTake}
        onProgramSave={saveProgram}
      />
    </DashboardLayout>
  );
}

export default Dashboard;
