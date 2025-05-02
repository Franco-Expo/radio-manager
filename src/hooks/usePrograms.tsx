
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
        title: 'Error',
        description: 'Could not load programs',
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
        title: 'Error',
        description: 'Could not create program',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateProgramPublishDate = async (programId: string, date: Date | null) => {
    try {
      // Convertire la data in formato ISO string se esiste, altrimenti null
      const isoDate = date ? date.toISOString() : null;
      
      const { error } = await supabase
        .from('programs')
        .update({
          publish_date: isoDate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', programId);

      if (error) {
        throw new Error(error.message);
      }

      setPrograms(
        programs.map(p =>
          p.id === programId ? { ...p, publishDate: date } : p
        )
      );

      sonnerToast.success('Publish date updated successfully');
    } catch (error: any) {
      console.error('Error updating program publish date:', error);
      sonnerToast.error('Could not update publish date');
    }
  };

  const deleteProgram = async (programId: string) => {
    try {
      const { error } = await supabase.from('programs').delete().eq('id', programId);

      if (error) {
        throw new Error(error.message);
      }

      setPrograms(programs.filter(p => p.id !== programId));
      sonnerToast.success('Program deleted successfully');
    } catch (error: any) {
      console.error('Error deleting program:', error);
      toast({
        title: 'Error',
        description: 'Could not delete program',
        variant: 'destructive',
      });
    }
  };

  return {
    programs,
    isLoading,
    createProgram,
    updateProgramPublishDate,
    deleteProgram,
    refreshPrograms: fetchPrograms,
  };
}
