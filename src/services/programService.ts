
import { supabase } from '@/integrations/supabase/client';
import { Program } from '@/types/programs';

export const fetchPrograms = async (): Promise<Program[]> => {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Transform data to match our Program type
  return data.map(program => ({
    id: program.id,
    name: program.name,
    publishDate: program.publish_date ? new Date(program.publish_date) : null,
  }));
};

export const createProgramInDB = async (programName: string, userId: string): Promise<Program> => {
  const { data, error } = await supabase
    .from('programs')
    .insert({
      name: programName,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    name: data.name,
    publishDate: data.publish_date ? new Date(data.publish_date) : null,
  };
};

export const updateProgramPublishDateInDB = async (programId: string, date: Date | null, programName: string): Promise<void> => {
  // Convert the date to ISO string if exists, otherwise null
  const isoDate = date ? date.toISOString() : null;
  
  const { error } = await supabase
    .from('programs')
    .update({
      name: programName,
      publish_date: isoDate,
      updated_at: new Date().toISOString(),
    })
    .eq('id', programId);

  if (error) {
    throw new Error(error.message);
  }
};

export const saveProgramInDB = async (programId: string, programName: string, publishDate: Date | null): Promise<void> => {
  const { error } = await supabase
    .from('programs')
    .update({
      name: programName,
      publish_date: publishDate ? publishDate.toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', programId);

  if (error) {
    throw new Error(error.message);
  }
};

export const deleteTakesAndSongsForProgram = async (programId: string): Promise<void> => {
  // Get all takes for the program
  const { data: takesData, error: takesError } = await supabase
    .from('takes')
    .select('id')
    .eq('program_id', programId);

  if (takesError) {
    throw new Error(takesError.message);
  }

  // For each take, delete all associated songs
  for (const take of takesData) {
    const { error: songsError } = await supabase
      .from('songs')
      .delete()
      .eq('take_id', take.id);

    if (songsError) {
      throw new Error(songsError.message);
    }
  }

  // Delete all takes for the program
  const { error: deleteTakesError } = await supabase
    .from('takes')
    .delete()
    .eq('program_id', programId);

  if (deleteTakesError) {
    throw new Error(deleteTakesError.message);
  }
};

export const deleteProgramInDB = async (programId: string): Promise<void> => {
  const { error } = await supabase
    .from('programs')
    .delete()
    .eq('id', programId);

  if (error) {
    throw new Error(error.message);
  }
};
