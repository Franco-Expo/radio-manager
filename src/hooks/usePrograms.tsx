import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

export type Program = {
  id: string;
  name: string;
  publishDate: Date | null;
};

export type Take = {
  id: string;
  number: number;
  date?: Date;
  songs: { id: string; title: string; news: string }[];
};

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
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Transform data to match our Program type
      const transformedPrograms = data.map(program => ({
        id: program.id,
        name: program.name,
        publishDate: program.publish_date ? new Date(program.publish_date) : null,
      }));

      setPrograms(transformedPrograms);
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

  const createProgram = async (programName: string) => {
    try {
      const { data, error } = await supabase.from('programs').insert({
        name: programName,
        user_id: user?.id,
      }).select().single();

      if (error) {
        throw new Error(error.message);
      }

      const newProgram: Program = {
        id: data.id,
        name: data.name,
        publishDate: data.publish_date ? new Date(data.publish_date) : null,
      };

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
      // Convertire la data in formato ISO string se esiste, altrimenti null
      const isoDate = date ? date.toISOString() : null;
      
      // Trova il programma corrente per ottenere il nome
      const currentProgram = programs.find(p => p.id === programId);
      if (!currentProgram) {
        throw new Error("Programma non trovato");
      }
      
      // Aggiorniamo sia la data di pubblicazione che il nome nel database
      const { error } = await supabase
        .from('programs')
        .update({
          name: currentProgram.name,
          publish_date: isoDate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', programId);

      if (error) {
        throw new Error(error.message);
      }

      // Aggiorniamo lo stato locale
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
      // Prima eliminiamo tutte le takes associate al programma
      // Otteniamo tutte le takes per il programma
      const { data: takesData, error: takesError } = await supabase
        .from('takes')
        .select('id')
        .eq('program_id', programId);

      if (takesError) {
        throw new Error(takesError.message);
      }

      // Per ogni take, eliminiamo tutte le songs associate
      for (const take of takesData) {
        // Eliminiamo tutte le canzoni associate alla take
        const { error: songsError } = await supabase
          .from('songs')
          .delete()
          .eq('take_id', take.id);

        if (songsError) {
          throw new Error(songsError.message);
        }
      }

      // Ora eliminiamo tutte le takes
      const { error: deleteTakesError } = await supabase
        .from('takes')
        .delete()
        .eq('program_id', programId);

      if (deleteTakesError) {
        throw new Error(deleteTakesError.message);
      }

      // Infine, eliminiamo il programma stesso
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId);

      if (error) {
        throw new Error(error.message);
      }

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
      // Trova il programma corrente
      const currentProgram = programs.find(p => p.id === programId);
      if (!currentProgram) {
        throw new Error("Programma non trovato");
      }
      
      // Aggiorniamo il nome e la data di pubblicazione nel database
      const { error } = await supabase
        .from('programs')
        .update({
          name: currentProgram.name,
          publish_date: currentProgram.publishDate ? currentProgram.publishDate.toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', programId);

      if (error) {
        throw new Error(error.message);
      }

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
