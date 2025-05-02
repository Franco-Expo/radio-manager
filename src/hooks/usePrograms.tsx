
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import type { Program } from '@/types/programs';
import {
  fetchPrograms as fetchProgramsService,
  createProgramInDB,
  updateProgramPublishDateInDB,
  saveProgramInDB,
  deleteTakesAndSongsForProgram,
  deleteProgramInDB
} from '@/services/programService';

export type { Program };

export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchPrograms();
    }
  }, [user]);

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      const programsData = await fetchProgramsService();
      setPrograms(programsData);
    } catch (error: any) {
      console.error('Error fetching programs:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare i programmi',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isNameUnique = (name: string): boolean => {
    return !programs.some(program => program.name.toLowerCase() === name.toLowerCase());
  };

  const createProgram = async (programName: string) => {
    try {
      // Verify program name is unique
      if (!isNameUnique(programName)) {
        toast({
          title: 'Errore',
          description: 'Esiste già un programma con questo nome. Scegli un nome diverso.',
          variant: 'destructive',
        });
        return null;
      }

      const newProgram = await createProgramInDB(programName, user?.id || '');
      setPrograms([newProgram, ...programs]);
      return newProgram;
    } catch (error: any) {
      console.error('Error creating program:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile creare il programma',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateProgramPublishDate = async (programId: string, date: Date | null) => {
    try {
      // Find the program to get its name
      const currentProgram = programs.find(p => p.id === programId);
      if (!currentProgram) {
        throw new Error("Programma non trovato");
      }
      
      await updateProgramPublishDateInDB(programId, date, currentProgram.name);

      // Update local state
      setPrograms(
        programs.map(p =>
          p.id === programId ? { ...p, publishDate: date } : p
        )
      );

      sonnerToast.success('Data di pubblicazione aggiornata con successo');
    } catch (error: any) {
      console.error('Error updating program publish date:', error);
      sonnerToast.error('Impossibile aggiornare la data di pubblicazione');
    }
  };

  const deleteProgram = async (programId: string) => {
    try {
      // First delete all related takes and songs
      await deleteTakesAndSongsForProgram(programId);
      
      // Then delete the program itself
      await deleteProgramInDB(programId);

      // Update local state
      setPrograms(programs.filter(p => p.id !== programId));
      sonnerToast.success('Programma eliminato con successo');
    } catch (error: any) {
      console.error('Error deleting program:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare il programma',
        variant: 'destructive',
      });
    }
  };

  const saveProgram = async (programId: string) => {
    try {
      // Find the program
      const currentProgram = programs.find(p => p.id === programId);
      if (!currentProgram) {
        throw new Error("Programma non trovato");
      }
      
      await saveProgramInDB(programId, currentProgram.name, currentProgram.publishDate);
      sonnerToast.success('Programma salvato con successo');
    } catch (error: any) {
      console.error('Error saving program:', error);
      sonnerToast.error('Impossibile salvare il programma');
    }
  };

  return {
    programs,
    isLoading,
    createProgram,
    updateProgramPublishDate,
    deleteProgram,
    saveProgram,
    refreshPrograms: fetchPrograms,
  };
}
