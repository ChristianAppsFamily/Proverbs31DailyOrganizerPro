import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type AppReadyContextValue = {
  /** Splash hidden, ATT finished, ads SDK initialized. */
  adsReady: boolean;
  setAdsReady: (ready: boolean) => void;
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
};

const AppReadyContext = createContext<AppReadyContextValue | null>(null);

export function AppReadyProvider({ children }: { children: React.ReactNode }) {
  const [adsReady, setAdsReady] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const setAdsReadyStable = useCallback((ready: boolean) => {
    setAdsReady(ready);
  }, []);

  const setIsPremiumStable = useCallback((premium: boolean) => {
    setIsPremium(premium);
  }, []);

  const value = useMemo(
    () => ({
      adsReady,
      setAdsReady: setAdsReadyStable,
      isPremium,
      setIsPremium: setIsPremiumStable,
    }),
    [adsReady, isPremium, setAdsReadyStable, setIsPremiumStable],
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
