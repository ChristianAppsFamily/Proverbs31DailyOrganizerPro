import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type AppReadyContextValue = {
  /** Startup work finished; safe to show main UI. */
  bootstrapReady: boolean;
  setBootstrapReady: (ready: boolean) => void;
};

const AppReadyContext = createContext<AppReadyContextValue | null>(null);

export function AppReadyProvider({ children }: { children: React.ReactNode }) {
  const [bootstrapReady, setBootstrapReady] = useState(false);

  const setBootstrapReadyStable = useCallback((ready: boolean) => {
    setBootstrapReady(ready);
  }, []);

  const value = useMemo(
    () => ({
      bootstrapReady,
      setBootstrapReady: setBootstrapReadyStable,
    }),
    [bootstrapReady, setBootstrapReadyStable],
  );

  return (
    <AppReadyContext.Provider value={value}>{children}</AppReadyContext.Provider>
  );
}

export function useAppReady(): AppReadyContextValue {
  const ctx = useContext(AppReadyContext);
  if (!ctx) {
    throw new Error("useAppReady must be used within AppReadyProvider");
  }
  return ctx;
}
