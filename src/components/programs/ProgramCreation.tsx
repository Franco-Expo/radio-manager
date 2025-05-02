
import { useState, useEffect } from "react";
import { ProgramCreationDialog } from "./ProgramCreationDialog";
import { ProgramHeader } from "./ProgramHeader";
import { TakeManager } from "./TakeManager";
import { Take } from "@/types/takes";

type Program = {
  id: string;
  name: string;
  publishDate: Date | null;
};

type ProgramCreationProps = {
  programs: Program[];
  takes: Take[];
  onProgramCreate: (program: Omit<Program, "id">) => Promise<Program | null>;
  onProgramUpdate: (program: Program) => void;
  selectedProgramId?: string;
  onTakeCreate: (takeNumber: number) => Promise<Take | null>;
  onTakeUpdate: (takeId: string, songs: { id: string; title: string; news: string }[], date: Date) => Promise<boolean>;
  onTakeDelete: (takeId: string) => Promise<void>;
  onProgramSave: (programId: string) => Promise<void>;
};

export function ProgramCreation({
  programs,
  takes,
  onProgramCreate,
  onProgramUpdate,
  selectedProgramId,
  onTakeCreate,
  onTakeUpdate,
  onTakeDelete,
  onProgramSave
}: ProgramCreationProps) {
  const selectedProgram = selectedProgramId 
    ? programs.find(p => p.id === selectedProgramId) 
    : undefined;
  
  const handleReturnToNewProgram = () => {
    // Clear the selected program to return to new program screen
    if (selectedProgramId && selectedProgram) {
      // Reset internal state and clear selected program in parent
      onProgramUpdate({...selectedProgram, id: 'reset'});
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col justify-center items-center my-8">
        {!selectedProgram && (
          <p className="text-center text-lg mb-4 max-w-md">
            Crea la tua Playlist con le informazioni musicali e le ultime notizie
          </p>
        )}
        <ProgramCreationDialog onProgramCreate={onProgramCreate} />
      </div>
      
      {selectedProgram && takes.length > 0 && (
        <div className="flex-1 p-4">
          <ProgramHeader programName={selectedProgram.name} />
          <TakeManager 
            takes={takes}
            selectedProgram={selectedProgram}
            onTakeCreate={onTakeCreate}
            onTakeUpdate={onTakeUpdate}
            onTakeDelete={onTakeDelete}
            onSaveProgram={onProgramSave}
            onSaveComplete={handleReturnToNewProgram}
          />
        </div>
      )}
    </div>
  );
}
