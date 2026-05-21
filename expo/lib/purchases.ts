import { Alert, Platform } from "react-native";
import * as RNIap from "react-native-iap";
import { PREMIUM_PRODUCT_ID } from "@/constants/urls";

let connectionReady = false;

export async function initPurchases(): Promise<void> {
  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    return;
  }
  try {
    await RNIap.initConnection();
    connectionReady = true;
  } catch {
    connectionReady = false;
  }
}

export async function endPurchases(): Promise<void> {
  if (!connectionReady) return;
  try {
    await RNIap.endConnection();
  } catch {
    // ignore
  }
  connectionReady = false;
}

/**
 * Opens the native store purchase flow for Pro / Premium.
 */
export async function purchasePremium(): Promise<void> {
  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    Alert.alert(
      "Buy Pro Version Now!",
      "In-app purchases are available on the iOS and Android apps.",
    );
    return;
  }

  if (!connectionReady) {
    await initPurchases();
  }

  if (!connectionReady) {
    Alert.alert(
      "Store Unavailable",
      "Could not connect to the App Store. Try again on a physical device with a development build.",
    );
    return;
  }

  try {
    const products = await RNIap.fetchProducts({
      skus: [PREMIUM_PRODUCT_ID],
      type: "in-app",
    });

    if (!products?.length) {
      Alert.alert(
        "Buy Pro Version Now!",
        `Product "${PREMIUM_PRODUCT_ID}" is not configured yet in App Store Connect. Add this product ID, then rebuild the app.`,
      );
      return;
    }

    await RNIap.requestPurchase({
      request: {
        apple: { sku: PREMIUM_PRODUCT_ID },
        google: { skus: [PREMIUM_PRODUCT_ID] },
      },
      type: "in-app",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Purchase could not be completed.";
    if (!message.toLowerCase().includes("cancel")) {
      Alert.alert("Purchase Error", message);
    }
  }
}
