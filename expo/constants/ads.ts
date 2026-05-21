import { Platform } from "react-native";

/** Production AdMob app IDs (configured in app.config.js native plugins). */
export const ADMOB_APP_IDS = {
  ios: "ca-app-pub-3002325591150738~8603205607",
  android: "ca-app-pub-3002325591150738~9800737201",
} as const;

/** Production banner ad unit IDs. */
export const ADMOB_BANNER_UNITS = {
  ios: "ca-app-pub-3002325591150738/2556672005",
  android: "ca-app-pub-3002325591150738/3754203607",
} as const;

/** Google sample banner units for local development. */
export const ADMOB_TEST_BANNER_UNITS = {
  ios: "ca-app-pub-3940256099942544/2934735716",
  android: "ca-app-pub-3940256099942544/6300978111",
} as const;

/**
 * Use production ad units in release/Xcode archive builds; test units in dev.
 * Set EXPO_PUBLIC_USE_PRODUCTION_ADS=true in EAS/Xcode release to force production IDs.
 */
export function shouldUseProductionAds(): boolean {
  if (process.env.EXPO_PUBLIC_USE_PRODUCTION_ADS === "true") {
    return true;
  }
  return !__DEV__;
}

export function getBannerAdUnitId(): string {
  const useProduction = shouldUseProductionAds();
  if (Platform.OS === "ios") {
    return useProduction ? ADMOB_BANNER_UNITS.ios : ADMOB_TEST_BANNER_UNITS.ios;
  }
  if (Platform.OS === "android") {
    return useProduction
      ? ADMOB_BANNER_UNITS.android
      : ADMOB_TEST_BANNER_UNITS.android;
  }
  return ADMOB_TEST_BANNER_UNITS.ios;
}
