import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modifiers } from '@/types';

type ModifiersContextType = {
  modifiers: Modifiers;
  setModifiers: React.Dispatch<React.SetStateAction<Modifiers>>;
};

const ModifiersContext = createContext<ModifiersContextType | undefined>(undefined);

export const useModifiersContext = () => {
  const context = useContext(ModifiersContext);
  if (!context) {
    throw new Error('useModifiers must be used within a ModifiersProvider');
  }
  return context;
};

export const ModifiersContextProvider = ({ children }: { children: ReactNode }) => {
  const [modifiers, setModifiers] = useState<Modifiers>({
    goalModifier: '1',
    assistModifier: '1',
    GWGModifier: '1',
    SHGModifier: '1',
  });

  return (
    <ModifiersContext.Provider value={{ modifiers, setModifiers }}>
      {children}
    </ModifiersContext.Provider>
  );
};