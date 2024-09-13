import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/config/supabaseClient';

interface TeamContextType {
  team: number[]; // Array of player IDs
  addPlayerToTeam: (playerId: number) => Promise<void>;
  removePlayerFromTeam: (playerId: number) => Promise<void>;
  fetchTeam: () => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

interface TeamProviderProps {
  children: ReactNode;
}

export const TeamContextProvider = ({ children }: TeamProviderProps): JSX.Element => {
  const [team, setTeam] = useState<number[]>([]); // Array of player IDs

  const fetchTeam = async () => {
    const { data, error } = await supabase
      .from('user_teams')
      .select('player_id');

    if (error) {
      console.error('Error fetching team:', error);
    } else {
      setTeam(data.map((row) => row.player_id));
    }
  };

  // Add a player to the team
  const addPlayerToTeam = async (playerId: number) => {
    const { error } = await supabase
      .from('user_teams')
      .insert([{ player_id: playerId }]);

    if (error) {
      console.error('Error adding player:', error);
    } else {
      setTeam((prevTeam) => [...prevTeam, playerId]);
    }
  };

  // Remove a player from the team
  const removePlayerFromTeam = async (playerId: number) => {
    const { error } = await supabase
      .from('user_teams')
      .delete()
      .eq('player_id', playerId);

    if (error) {
      console.error('Error removing player:', error);
    } else {
      setTeam((prevTeam) => prevTeam.filter((id) => id !== playerId));
    }
  };

  useEffect(() => {
    fetchTeam(); // Fetch the team when the component mounts
  }, []);

  return (
    <TeamContext.Provider value={{ team, addPlayerToTeam, removePlayerFromTeam, fetchTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

// Custom hook for accessing the team context
export const useTeamContext = (): TeamContextType => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
