import { Platform } from "react-native";
import mobileAds, { MaxAdContentRating } from "react-native-google-mobile-ads";

let initialized = false;

/**
 * Initialize the Google Mobile Ads SDK. Call only after ATT on iOS.
 */
export async function initializeAds(): Promise<void> {
  if (initialized || Platform.OS === "web") {
    return;
  }

  await mobileAds().setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.G,
    tagForChildDirectedTreatment: false,
    tagForUnderAgeOfConsent: false,
  });

  await mobileAds().initialize();
  initialized = true;
}
