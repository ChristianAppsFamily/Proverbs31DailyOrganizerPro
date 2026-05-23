import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { Task } from "@/types/models";
import { defaultReminderDate } from "@/lib/reminderDefaults";
import { isSabbathPauseActive } from "@/lib/sabbathPause";

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

function resolveTriggerDate(task: Task): Date {
  if (task.reminderAt) {
    const scheduled = new Date(task.reminderAt);
    if (scheduled.getTime() > Date.now()) {
      return scheduled;
    }
  }
  return defaultReminderDate();
}

export async function scheduleTaskReminder(task: Task): Promise<string | undefined> {
  if (await isSabbathPauseActive()) {
    return undefined;
  }

  const permission = await getNotificationPermission();
  if (permission !== "granted" || !task.remindOnDay || task.done) {
    return undefined;
  }

  const triggerDate = resolveTriggerDate(task);

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Task reminder",
      body: task.title,
      data: { taskId: task.id, priority: task.priority },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
}

export async function cancelTaskReminder(notificationId?: string): Promise<void> {
  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}

export async function applyTaskReminder(task: Task): Promise<Task> {
  if (task.notificationId) {
    await cancelTaskReminder(task.notificationId);
  }

  if (!task.remindOnDay || task.done) {
    return { ...task, notificationId: undefined };
  }

  const notificationId = await scheduleTaskReminder(task);
  return { ...task, notificationId };
}

export async function syncTaskReminders(tasks: Task[]): Promise<Task[]> {
  if (await isSabbathPauseActive()) {
    await cancelAllScheduledNotifications();
    return tasks.map((t) => ({ ...t, notificationId: undefined }));
  }

  const permission = await getNotificationPermission();
  if (permission !== "granted") {
    return tasks;
  }

  const updated: Task[] = [];
  for (const task of tasks) {
    updated.push(await applyTaskReminder(task));
  }
  return updated;
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
