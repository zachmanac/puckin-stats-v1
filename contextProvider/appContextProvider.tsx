import React, { ReactNode } from 'react';
import { TeamContextProvider } from './userTeamContextProvider';
import { ModifiersContextProvider } from './modifiersContextProvider';

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  return (
    <TeamContextProvider>
      <ModifiersContextProvider>
        {children}
      </ModifiersContextProvider>
    </TeamContextProvider>
  );
};

export default AppContextProvider;