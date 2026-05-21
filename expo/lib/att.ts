import { Platform } from "react-native";
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from "expo-tracking-transparency";

export type AttStatus = "unavailable" | "undetermined" | "granted" | "denied";

/**
 * Request App Tracking Transparency on iOS after splash, before ads load.
 */
export async function requestAttIfNeeded(): Promise<AttStatus> {
  if (Platform.OS !== "ios") {
    return "unavailable";
  }

  const current = await getTrackingPermissionsAsync();
  if (current.status === "granted") {
    return "granted";
  }
  if (current.status === "denied") {
    return "denied";
  }

  const result = await requestTrackingPermissionsAsync();
  if (result.status === "granted") {
    return "granted";
  }
  return "denied";
}
