import React, { createContext, useState, ReactNode, FC, useContext } from 'react';

// Define the shape of your context state
interface MeshContextProps {
  conns: string[];
  setConns: React.Dispatch<React.SetStateAction<string[]>>;
}

// Create a context with a default value
export const MeshContext = createContext<MeshContextProps | undefined>(undefined);

// Create a provider component
export const MeshProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [conns, setConns] = useState<string[]>([]);

  return (
    <MeshContext.Provider value={{ conns, setConns }}>
      {children}
    </MeshContext.Provider>
  );
};
