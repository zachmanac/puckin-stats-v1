import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modifiers, ModifiersContextType } from '@/types';

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
    goalModifier: { value: '1', enabled: false },
    assistModifier: { value: '1', enabled: false },
    GWGModifier: { value: '0', enabled: false },
    SHGModifier: { value: '0', enabled: false },
  });

  return (
    <ModifiersContext.Provider value={{ modifiers, setModifiers }}>
      {children}
    </ModifiersContext.Provider>
  );
};