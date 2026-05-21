import React, { useEffect } from "react";
import { Platform } from "react-native";
import { useAppReady } from "@/contexts/AppReadyContext";
import { requestAttIfNeeded } from "@/lib/att";
import { initializeAds } from "@/lib/ads";
import { getNotificationPermission, requestNotificationPermission } from "@/lib/notifications";
import { initPurchases } from "@/lib/purchases";

type Props = {
  fontsLoaded: boolean;
  onSplashHidden: () => void;
};

/**
 * Runs ATT immediately after splash, then initializes AdMob before any banner loads.
 */
export function AppBootstrap({ fontsLoaded, onSplashHidden }: Props) {
  const { setAdsReady } = useAppReady();

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    let cancelled = false;

    (async () => {
      onSplashHidden();

      if (Platform.OS === "ios") {
        await requestAttIfNeeded();
      }

      if (cancelled) {
        return;
      }

      await initializeAds();
      void initPurchases();

      const notificationPermission = await getNotificationPermission();
      if (notificationPermission === "undetermined") {
        await requestNotificationPermission();
      }

      if (!cancelled) {
        setAdsReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fontsLoaded, onSplashHidden, setAdsReady]);

  return null;
}
