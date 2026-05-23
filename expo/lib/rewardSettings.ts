import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DEFAULT_REWARD_STYLE,
  type RewardStyleId,
} from "@/constants/rewards";

const REWARD_SETTINGS_KEY = "proverbs31-reward-settings-v1";
const REWARD_LEDGER_KEY = "proverbs31-reward-ledger-v1";

export type RewardSettings = {
  enabled: boolean;
  onAllTasksDone: boolean;
  onHabitWeekComplete: boolean;
  /** Celebrate every 30 total habit check-ins (not necessarily in a row). */
  onHabitCheckInMilestones: boolean;
  style: RewardStyleId;
};

type RewardLedger = {
  allTasksDoneDate?: string;
  habitWeekComplete?: Record<string, string>;
  /** Last celebrated total check-in milestone per habit (30, 60, 90, …). */
  habitCheckInMilestone?: Record<string, number>;
};

const DEFAULT_SETTINGS: RewardSettings = {
  enabled: true,
  onAllTasksDone: true,
  onHabitWeekComplete: true,
  onHabitCheckInMilestones: true,
  style: DEFAULT_REWARD_STYLE,
};

async function readRewardSettings(): Promise<Partial<RewardSettings>> {
  try {
    const raw = await AsyncStorage.getItem(REWARD_SETTINGS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<RewardSettings>;
  } catch {
    return {};
  }
}

export async function getRewardSettings(): Promise<RewardSettings> {
  const stored = await readRewardSettings();
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    style: isRewardStyle(stored.style) ? stored.style : DEFAULT_SETTINGS.style,
  };
}

export async function setRewardSettings(
  patch: Partial<RewardSettings>,
): Promise<void> {
  const current = await getRewardSettings();
  await AsyncStorage.setItem(
    REWARD_SETTINGS_KEY,
    JSON.stringify({ ...current, ...patch }),
  );
}

function isRewardStyle(value: unknown): value is RewardStyleId {
  return (
    value === "confetti" ||
    value === "sparkles" ||
    value === "glow" ||
    value === "victory" ||
    value === "full"
  );
}

async function readLedger(): Promise<RewardLedger> {
  try {
    const raw = await AsyncStorage.getItem(REWARD_LEDGER_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as RewardLedger;
  } catch {
    return {};
  }
}

async function writeLedger(ledger: RewardLedger): Promise<void> {
  await AsyncStorage.setItem(REWARD_LEDGER_KEY, JSON.stringify(ledger));
}

export async function hasCelebratedAllTasksToday(
  dateKey: string,
): Promise<boolean> {
  const ledger = await readLedger();
  return ledger.allTasksDoneDate === dateKey;
}

export async function markCelebratedAllTasksToday(
  dateKey: string,
): Promise<void> {
  const ledger = await readLedger();
  await writeLedger({ ...ledger, allTasksDoneDate: dateKey });
}

export async function hasCelebratedHabitWeek(
  habitId: string,
  weekEndKey: string,
): Promise<boolean> {
  const ledger = await readLedger();
  return ledger.habitWeekComplete?.[habitId] === weekEndKey;
}

export async function markCelebratedHabitWeek(
  habitId: string,
  weekEndKey: string,
): Promise<void> {
  const ledger = await readLedger();
  await writeLedger({
    ...ledger,
    habitWeekComplete: {
      ...ledger.habitWeekComplete,
      [habitId]: weekEndKey,
    },
  });
}

export async function getLastHabitCheckInMilestone(
  habitId: string,
): Promise<number> {
  const ledger = await readLedger();
  return ledger.habitCheckInMilestone?.[habitId] ?? 0;
}

export async function markHabitCheckInMilestone(
  habitId: string,
  milestone: number,
): Promise<void> {
  const ledger = await readLedger();
  await writeLedger({
    ...ledger,
    habitCheckInMilestone: {
      ...ledger.habitCheckInMilestone,
      [habitId]: milestone,
    },
  });
}
