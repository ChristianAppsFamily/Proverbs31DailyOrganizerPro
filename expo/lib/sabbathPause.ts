import { isRestDay, type SabbathWeekday } from "@/lib/sabbathDays";
import {
  getSabbathPauseEnabled,
  getSabbathRestDay,
} from "@/lib/settingsStorage";

export async function isSabbathRestDay(date: Date = new Date()): Promise<boolean> {
  const restDay = await getSabbathRestDay();
  return isRestDay(date, restDay);
}

export async function getActiveSabbathRestDay(): Promise<SabbathWeekday> {
  return getSabbathRestDay();
}

export async function isSabbathPauseActive(
  date: Date = new Date(),
): Promise<boolean> {
  const enabled = await getSabbathPauseEnabled();
  if (!enabled) return false;
  const restDay = await getSabbathRestDay();
  return isRestDay(date, restDay);
}
