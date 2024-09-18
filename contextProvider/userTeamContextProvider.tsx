import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchTeam } from '@/supabaseCalls/getRequests';
import { addPlayerToTeamDB, removePlayerFromTeamDB } from '@/supabaseCalls/postRequests';
import { TeamContextType } from '@/types';

const TeamContext = createContext<TeamContextType | undefined>(undefined);

type TeamProviderProps = {
  children: ReactNode;
}

export const TeamContextProvider = ({ children }: TeamProviderProps): React.JSX.Element => {
  const [team, setTeam] = useState<number[]>([]); // Array of player IDs

  const fetchTeamData = async () => {
    const playerIds = await fetchTeam();
    setTeam(playerIds);
  };

  const addPlayerToTeam = async (playerId: number) => {
    const success = await addPlayerToTeamDB(playerId);
    if (success) {
      setTeam((prevTeam) => [...prevTeam, playerId]);
    } else {
      console.error(`Failed to add player with ID ${playerId}`);
    }
  };

  const removePlayerFromTeam = async (playerId: number) => {
    const success = await removePlayerFromTeamDB(playerId);
    if (success) {
      setTeam((prevTeam) => prevTeam.filter((id) => id !== playerId));
    } else {
      console.error(`Failed to remove player with ID ${playerId}`);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  return (
    <TeamContext.Provider value={{ team, addPlayerToTeam, removePlayerFromTeam, fetchTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeamContext = (): TeamContextType => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
