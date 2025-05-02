
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

export type Song = {
  id: string;
  title: string;
  news: string;
};

export type Take = {
  id: string;
  number: number;
  songs: Song[];
};

export function useTakes(programId: string | undefined) {
  const [takes, setTakes] = useState<Take[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (programId) {
      fetchTakes();
    } else {
      setTakes([]);
      setIsLoading(false);
    }
  }, [programId]);

  const fetchTakes = async () => {
    if (!programId) return;

    try {
      setIsLoading(true);
      // First get all takes for this program
      const { data: takesData, error: takesError } = await supabase
        .from('takes')
        .select('*')
        .eq('program_id', programId)
        .order('number', { ascending: true });

      if (takesError) throw new Error(takesError.message);

      // For each take, get its songs
      const takesWithSongs: Take[] = [];
      
      for (const take of takesData) {
        const { data: songsData, error: songsError } = await supabase
          .from('songs')
          .select('*')
          .eq('take_id', take.id)
          .order('created_at', { ascending: true });
        
        if (songsError) throw new Error(songsError.message);
        
        takesWithSongs.push({
          id: take.id,
          number: take.number,
          songs: songsData.map(song => ({
            id: song.id,
            title: song.title,
            news: song.news || '',
          })),
        });
      }

      setTakes(takesWithSongs);
    } catch (error: any) {
      console.error('Error fetching takes:', error);
      toast({
        title: 'Error',
        description: 'Could not load takes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTake = async (number: number) => {
    if (!programId) return null;

    try {
      // Create the take
      const { data: takeData, error: takeError } = await supabase
        .from('takes')
        .insert({
          program_id: programId,
          number: number,
        })
        .select()
        .single();

      if (takeError) throw new Error(takeError.message);

      // Create an initial empty song for the take
      const { data: songData, error: songError } = await supabase
        .from('songs')
        .insert({
          take_id: takeData.id,
          title: '',
          news: '',
        })
        .select()
        .single();

      if (songError) throw new Error(songError.message);

      const newTake: Take = {
        id: takeData.id,
        number: takeData.number,
        songs: [{
          id: songData.id,
          title: songData.title,
          news: songData.news || '',
        }],
      };

      setTakes([...takes, newTake]);
      return newTake;
    } catch (error: any) {
      console.error('Error creating take:', error);
      toast({
        title: 'Error',
        description: 'Could not create take',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateTake = async (takeId: string, songs: Song[]) => {
    try {
      // Delete all existing songs for this take
      const { error: deleteError } = await supabase
        .from('songs')
        .delete()
        .eq('take_id', takeId);

      if (deleteError) throw new Error(deleteError.message);

      // Create all songs from scratch
      const songsToInsert = songs.map(song => ({
        take_id: takeId,
        title: song.title,
        news: song.news,
      }));

      const { error: insertError } = await supabase
        .from('songs')
        .insert(songsToInsert);

      if (insertError) throw new Error(insertError.message);

      // Update local state
      setTakes(takes.map(take => 
        take.id === takeId ? { ...take, songs } : take
      ));

      sonnerToast.success('Take saved successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating take:', error);
      sonnerToast.error('Could not save take');
      return false;
    }
  };

  const deleteTake = async (takeId: string) => {
    try {
      const { error } = await supabase
        .from('takes')
        .delete()
        .eq('id', takeId);

      if (error) throw new Error(error.message);

      setTakes(takes.filter(take => take.id !== takeId));
      
      // Renumber the remaining takes
      const updatedTakes = takes
        .filter(take => take.id !== takeId)
        .sort((a, b) => a.number - b.number)
        .map((take, index) => ({ ...take, number: index + 1 }));
      
      // Update the numbers in the database
      for (const take of updatedTakes) {
        await supabase
          .from('takes')
          .update({ number: take.number })
          .eq('id', take.id);
      }
      
      setTakes(updatedTakes);
      sonnerToast.success('Take deleted successfully');
    } catch (error: any) {
      console.error('Error deleting take:', error);
      toast({
        title: 'Error',
        description: 'Could not delete take',
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
    refreshTakes: fetchTakes,
  };
}
