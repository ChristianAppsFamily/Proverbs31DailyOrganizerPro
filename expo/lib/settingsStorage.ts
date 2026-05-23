import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DEFAULT_SABBATH_WEEKDAY,
  type SabbathWeekday,
} from "@/lib/sabbathDays";

const SETTINGS_KEY = "proverbs31-settings-v1";

type StoredSettings = {
  taskRemindersEnabled?: boolean;
  sabbathPauseEnabled?: boolean;
  sabbathRestDay?: SabbathWeekday;
};

async function readSettings(): Promise<StoredSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredSettings;
  } catch {
    return {};
  }
}

async function writeSettings(patch: StoredSettings): Promise<void> {
  const current = await readSettings();
  await AsyncStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({ ...current, ...patch }),
  );
}

export async function getTaskRemindersEnabled(): Promise<boolean> {
  const settings = await readSettings();
  return settings.taskRemindersEnabled !== false;
}

export async function setTaskRemindersEnabled(enabled: boolean): Promise<void> {
  await writeSettings({ taskRemindersEnabled: enabled });
}

export async function getSabbathPauseEnabled(): Promise<boolean> {
  const settings = await readSettings();
  return settings.sabbathPauseEnabled === true;
}

export async function setSabbathPauseEnabled(enabled: boolean): Promise<void> {
  await writeSettings({ sabbathPauseEnabled: enabled });
}

export async function getSabbathRestDay(): Promise<SabbathWeekday> {
  const settings = await readSettings();
  const day = settings.sabbathRestDay;
  if (typeof day === "number" && day >= 0 && day <= 6) {
    return day as SabbathWeekday;
  }
  return DEFAULT_SABBATH_WEEKDAY;
}

export async function setSabbathRestDay(day: SabbathWeekday): Promise<void> {
  await writeSettings({ sabbathRestDay: day });
}
