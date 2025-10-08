import React, { createContext, useContext, useMemo, useState } from "react";

type ResultsContextType = {
  names: string[];              // ordered list of pokemon names
  setNames: (list: string[]) => void;
};

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

export const ResultsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [names, setNames] = useState<string[]>([]);
  const value = useMemo(() => ({ names, setNames }), [names]);
  return <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>;
};

export const useResults = () => {
  const ctx = useContext(ResultsContext);
  if (!ctx) throw new Error("useResults must be used within ResultsProvider");
  return ctx;
};
