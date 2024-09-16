import { supabase } from '@/config/supabaseClient';

export const addPlayerToTeamDB = async (playerId: number) => {
  const { error } = await supabase
    .from('user_teams')
    .insert([{ player_id: playerId }]);

  if (error) {
    console.error('Error adding player:', error);
    return false;
  } else {
    return true;
  }
};

export const removePlayerFromTeamDB = async (playerId: number) => {
  const { error } = await supabase
    .from('user_teams')
    .delete()
    .eq('player_id', playerId);

  if (error) {
    console.error('Error removing player:', error);
    return false;
  } else {
    return true;
  }
};