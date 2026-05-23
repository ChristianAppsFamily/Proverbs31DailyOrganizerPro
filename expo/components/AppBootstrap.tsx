import React, { useEffect } from "react";
import { useAppReady } from "@/contexts/AppReadyContext";

type Props = {
  fontsLoaded: boolean;
  onBootstrapComplete: () => void;
};

/** Hides splash once fonts are ready. Notification permission runs on the Tasks home screen. */
export function AppBootstrap({ fontsLoaded, onBootstrapComplete }: Props) {
  const { setBootstrapReady } = useAppReady();

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) {
        return;
      }
      setBootstrapReady(true);
      onBootstrapComplete();
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [fontsLoaded, onBootstrapComplete, setBootstrapReady]);

  return null;
}
