
import { useState, useEffect } from 'react';
import { Take } from '@/types/takes';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { fetchTakes, createTake as createTakeService, updateTake as updateTakeService, deleteTake as deleteTakeService } from '@/services/takeService';

// Change the re-export to use 'export type'
export type { Take } from '@/types/takes';

export function useTakes(programId: string | undefined) {
  const [takes, setTakes] = useState<Take[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (programId) {
      refreshTakes();
    } else {
      setTakes([]);
      setIsLoading(false);
    }
  }, [programId]);

  const refreshTakes = async () => {
    try {
      setIsLoading(true);
      const takesData = await fetchTakes(programId || '');
      setTakes(takesData);
    } catch (error: any) {
      console.error('Error fetching takes:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare le take',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTake = async (number: number) => {
    try {
      const newTake = await createTakeService(programId || '', number);
      if (newTake) {
        setTakes([...takes, newTake]);
      }
      return newTake;
    } catch (error: any) {
      console.error('Error creating take:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile creare la take',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateTake = async (takeId: string, songs: { id: string; title: string; news: string; artist?: string; productionDate?: Date | null }[], date: Date) => {
    try {
      // Pass date and productionDate to the service
      const success = await updateTakeService(takeId, songs, date);
      if (success) {
        // Update local state
        setTakes(takes.map(take => 
          take.id === takeId ? { ...take, songs, date } : take
        ));
        sonnerToast.success('Take salvata con successo');
      }
      return success;
    } catch (error: any) {
      console.error('Error updating take:', error);
      sonnerToast.error('Impossibile salvare la take');
      return false;
    }
  };

  const deleteTake = async (takeId: string) => {
    try {
      const updatedTakes = await deleteTakeService(takeId, takes);
      setTakes(updatedTakes);
      sonnerToast.success('Take eliminata con successo');
    } catch (error: any) {
      console.error('Error deleting take:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare la take',
        variant: 'destructive',
      });
    }
  };

  return {
    takes,
    isLoading,
    createTake,
    updateTake,
    deleteTake,
    refreshTakes,
  };
}
