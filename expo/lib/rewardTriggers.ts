import {
  HABIT_CHECKIN_MILESTONE_STEP,
  pickRewardMessage,
  type RewardTriggerKind,
} from "@/constants/rewards";
import { lastSevenDayKeys, todayKey } from "@/lib/dates";
import {
  getLastHabitCheckInMilestone,
  getRewardSettings,
  hasCelebratedAllTasksToday,
  hasCelebratedHabitWeek,
  markCelebratedAllTasksToday,
  markCelebratedHabitWeek,
  markHabitCheckInMilestone,
} from "@/lib/rewardSettings";
import type { Habit, Task } from "@/types/models";

export type RewardCelebrationPayload = {
  kind: RewardTriggerKind;
  title: string;
  message: string;
};

type RewardEmitter = (payload: RewardCelebrationPayload) => void;

let emitCelebration: RewardEmitter | null = null;

export function setRewardCelebrationEmitter(emitter: RewardEmitter | null): void {
  emitCelebration = emitter;
}

export function areAllTasksComplete(tasks: Task[]): boolean {
  return tasks.length > 0 && tasks.every((t) => t.done);
}

export function isHabitWeekComplete(habit: Habit): boolean {
  const weekKeys = lastSevenDayKeys();
  return weekKeys.every((key) => habit.completedDates.includes(key));
}

export function getTotalHabitCheckIns(habit: Habit): number {
  return habit.completedDates.length;
}

/** Returns 30, 60, 90, … when total hits a milestone; otherwise null. */
export function getHabitCheckInMilestone(totalCheckIns: number): number | null {
  if (
    totalCheckIns < HABIT_CHECKIN_MILESTONE_STEP ||
    totalCheckIns % HABIT_CHECKIN_MILESTONE_STEP !== 0
  ) {
    return null;
  }
  return totalCheckIns;
}

export async function evaluateTaskCompletionReward(
  tasks: Task[],
  wasAllDoneBefore: boolean,
): Promise<void> {
  const settings = await getRewardSettings();
  if (!settings.enabled || !settings.onAllTasksDone) return;

  const allDone = areAllTasksComplete(tasks);
  if (!allDone || wasAllDoneBefore) return;

  const today = todayKey();
  if (await hasCelebratedAllTasksToday(today)) return;

  await markCelebratedAllTasksToday(today);
  emitCelebration?.({
    kind: "allTasksDone",
    title: "Today is complete!",
    message: pickRewardMessage("allTasksDone"),
  });
}

export async function evaluateHabitCheckInMilestoneReward(
  habit: Habit,
): Promise<void> {
  const settings = await getRewardSettings();
  if (!settings.enabled || !settings.onHabitCheckInMilestones) return;

  const total = getTotalHabitCheckIns(habit);
  const milestone = getHabitCheckInMilestone(total);
  if (!milestone) return;

  const lastCelebrated = await getLastHabitCheckInMilestone(habit.id);
  if (lastCelebrated >= milestone) return;

  await markHabitCheckInMilestone(habit.id, milestone);
  emitCelebration?.({
    kind: "habitCheckInMilestone",
    title: `${milestone} check-ins!`,
    message: `${pickRewardMessage("habitCheckInMilestone")} ${habit.name}!`,
  });
}

export async function evaluateHabitWeekReward(
  habit: Habit,
  wasWeekCompleteBefore: boolean,
): Promise<void> {
  const settings = await getRewardSettings();
  if (!settings.enabled || !settings.onHabitWeekComplete) return;

  if (!isHabitWeekComplete(habit) || wasWeekCompleteBefore) return;

  const weekEndKey = lastSevenDayKeys().at(-1) ?? todayKey();
  if (await hasCelebratedHabitWeek(habit.id, weekEndKey)) return;

  await markCelebratedHabitWeek(habit.id, weekEndKey);
  emitCelebration?.({
    kind: "habitWeekComplete",
    title: "A perfect week!",
    message: pickRewardMessage("habitWeekComplete"),
  });
}

export async function triggerPreviewCelebration(): Promise<void> {
  const settings = await getRewardSettings();
  if (!settings.enabled) return;

  emitCelebration?.({
    kind: "preview",
    title: "Celebration preview!",
    message: pickRewardMessage("preview"),
  });
}
