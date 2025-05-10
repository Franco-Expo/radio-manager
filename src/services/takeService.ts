
import { supabase } from '@/integrations/supabase/client';
import { Song, Take } from '@/types/takes';

/**
 * Fetches all takes for a given program
 */
export async function fetchTakes(programId: string): Promise<Take[]> {
  if (!programId) return [];
  
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
      date: take.date ? new Date(take.date) : new Date(),
      songs: songsData.map(song => ({
        id: song.id,
        title: song.title,
        artist: song.artist || undefined,
        news: song.news || '',
        productionDate: song.production_date ? new Date(song.production_date) : null,
      })),
    });
  }

  return takesWithSongs;
}

/**
 * Creates a new take for a program with an initial empty song
 */
export async function createTake(programId: string, number: number): Promise<Take | null> {
  if (!programId) return null;

  // Create the take with the current date
  const { data: takeData, error: takeError } = await supabase
    .from('takes')
    .insert({
      program_id: programId,
      number: number,
      date: new Date().toISOString(),
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
      artist: '',
      news: '',
      production_date: null,
    })
    .select()
    .single();

  if (songError) throw new Error(songError.message);

  const newTake: Take = {
    id: takeData.id,
    number: takeData.number,
    date: takeData.date ? new Date(takeData.date) : new Date(),
    songs: [{
      id: songData.id,
      title: songData.title,
      artist: songData.artist || undefined,
      news: songData.news || '',
      productionDate: null,
    }],
  };

  return newTake;
}

/**
 * Updates all songs for a take (deletes existing songs and creates new ones)
 */
export async function updateTake(takeId: string, songs: Song[], date: Date): Promise<boolean> {
  // Update the take date
  const { error: updateTakeError } = await supabase
    .from('takes')
    .update({ 
      date: date.toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', takeId);
  
  if (updateTakeError) throw new Error(updateTakeError.message);
  
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
    artist: song.artist || null,
    news: song.news,
    production_date: song.productionDate ? song.productionDate.toISOString() : null,
  }));

  const { error: insertError } = await supabase
    .from('songs')
    .insert(songsToInsert);

  if (insertError) throw new Error(insertError.message);

  return true;
}

/**
 * Deletes a take and updates the numbering of remaining takes
 */
export async function deleteTake(takeId: string, takes: Take[]): Promise<Take[]> {
  const { error } = await supabase
    .from('takes')
    .delete()
    .eq('id', takeId);

  if (error) throw new Error(error.message);
  
  // Prepare updated takes with renumbered sequence
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
  
  return updatedTakes;
}
