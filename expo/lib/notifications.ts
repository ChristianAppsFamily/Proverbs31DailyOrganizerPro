import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type NotificationPermission = "granted" | "denied" | "undetermined";

export async function getNotificationPermission(): Promise<NotificationPermission> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return "granted";
  if (status === "denied") return "denied";
  return "undetermined";
}

/**
 * Prompt the user for notification permission (iOS/Android).
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === "granted") {
    return "granted";
  }

  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  if (status !== "granted") {
    return status === "denied" ? "denied" : "undetermined";
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Task Reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return "granted";
}

export async function scheduleTaskReminderSample(): Promise<void> {
  const permission = await getNotificationPermission();
  if (permission !== "granted") {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Proverbs 31",
      body: "You have tasks coming up today.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60 * 60 * 24,
      repeats: true,
    },
  });
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
