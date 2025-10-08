import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type AppStateContextValue = {
  selectedDay: Date;
  setSelectedDay: React.Dispatch<React.SetStateAction<Date>>;
};

const AppStateContext = createContext<AppStateContextValue>({
  selectedDay: new Date(),
  setSelectedDay: () => {},
});

interface Props {
  children: ReactNode;
}

export function AppStateContextProvider({ children }: Props) {
  const [selectedDay, setSelectedDay] = useState(new Date());

  return (
    <AppStateContext.Provider value={{ selectedDay, setSelectedDay }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppStateContext() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error(
      "useAppStateContext must be used within an AppStateContextProvider"
    );
  }
  return context;
}
