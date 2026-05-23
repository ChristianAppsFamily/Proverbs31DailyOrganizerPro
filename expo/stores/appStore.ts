import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Habit, HabitIcon, JournalEntry, Task, TaskPriority } from "@/types/models";
import { todayKey } from "@/lib/dates";
import { applyTaskReminder, cancelTaskReminder } from "@/lib/notifications";
import {
  maybePromptAfterHabitCheckIn,
  maybePromptAfterTaskCompleted,
} from "@/lib/rateAppPrompt";
import {
  areAllTasksComplete,
  evaluateHabitCheckInMilestoneReward,
  evaluateHabitWeekReward,
  evaluateTaskCompletionReward,
  isHabitWeekComplete,
} from "@/lib/rewardTriggers";

const STORAGE_KEY = "proverbs31-app-data-v1";

function id(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type AppState = {
  tasks: Task[];
  habits: Habit[];
  journalEntries: JournalEntry[];
  hydrated: boolean;
  addTask: (input: Omit<Task, "id" | "done" | "createdAt">) => Task;
  updateTask: (taskId: string, patch: Partial<Omit<Task, "id" | "createdAt">>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskDone: (taskId: string) => void;
  addHabit: (name: string, icon: HabitIcon) => Habit;
  updateHabit: (
    habitId: string,
    patch: Partial<Pick<Habit, "name" | "icon">>,
  ) => void;
  deleteHabit: (habitId: string) => void;
  toggleHabitToday: (habitId: string) => void;
  addJournalEntry: (title: string, body: string) => JournalEntry;
  updateJournalEntry: (
    entryId: string,
    patch: Partial<Pick<JournalEntry, "title" | "body">>,
  ) => void;
  deleteJournalEntry: (entryId: string) => void;
  getReminderTasks: () => Task[];
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: [],
      habits: [],
      journalEntries: [],
      hydrated: false,

      addTask: (input) => {
        const task: Task = {
          ...input,
          reminderAt: input.reminderAt ?? null,
          id: id(),
          done: false,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ tasks: [task, ...s.tasks] }));
        return task;
      },

      updateTask: (taskId, patch) => {
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
        }));
      },

      deleteTask: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (task?.notificationId) {
          void cancelTaskReminder(task.notificationId);
        }
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== taskId) }));
      },

      toggleTaskDone: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;

        const wasAllDoneBefore = areAllTasksComplete(get().tasks);
        const done = !task.done;
        if (done && task.notificationId) {
          void cancelTaskReminder(task.notificationId);
        }

        const next: Task = {
          ...task,
          done,
          notificationId: done ? undefined : task.notificationId,
        };

        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === taskId ? next : t)),
        }));

        if (done) {
          void maybePromptAfterTaskCompleted();
          void evaluateTaskCompletionReward(get().tasks, wasAllDoneBefore);
        }

        if (!done && task.remindOnDay) {
          void applyTaskReminder({ ...next, done: false }).then((withReminder) => {
            set((s) => ({
              tasks: s.tasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      notificationId: withReminder.notificationId,
                      reminderAt: withReminder.reminderAt,
                    }
                  : t,
              ),
            }));
          });
        }
      },

      addHabit: (name, icon) => {
        const habit: Habit = {
          id: id(),
          name: name.trim(),
          icon,
          completedDates: [],
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ habits: [habit, ...s.habits] }));
        return habit;
      },

      updateHabit: (habitId, patch) => {
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== habitId) return h;
            return {
              ...h,
              name: patch.name !== undefined ? patch.name.trim() : h.name,
              icon: patch.icon ?? h.icon,
            };
          }),
        }));
      },

      deleteHabit: (habitId) => {
        set((s) => ({
          habits: s.habits.filter((h) => h.id !== habitId),
        }));
      },

      toggleHabitToday: (habitId) => {
        const today = todayKey();
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit) return;

        const wasComplete = habit.completedDates.includes(today);
        const wasWeekCompleteBefore = isHabitWeekComplete(habit);

        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== habitId) return h;
            const has = h.completedDates.includes(today);
            return {
              ...h,
              completedDates: has
                ? h.completedDates.filter((d) => d !== today)
                : [...h.completedDates, today],
            };
          }),
        }));

        if (!wasComplete) {
          void maybePromptAfterHabitCheckIn();
          const updated = get().habits.find((h) => h.id === habitId);
          if (updated) {
            void evaluateHabitCheckInMilestoneReward(updated);
            void evaluateHabitWeekReward(updated, wasWeekCompleteBefore);
          }
        }
      },

      addJournalEntry: (title, body) => {
        const entry: JournalEntry = {
          id: id(),
          title: title.trim(),
          body: body.trim(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ journalEntries: [entry, ...s.journalEntries] }));
        return entry;
      },

      updateJournalEntry: (entryId, patch) => {
        set((s) => ({
          journalEntries: s.journalEntries.map((e) =>
            e.id === entryId
              ? {
                  ...e,
                  title: patch.title !== undefined ? patch.title.trim() : e.title,
                  body: patch.body !== undefined ? patch.body.trim() : e.body,
                }
              : e,
          ),
        }));
      },

      deleteJournalEntry: (entryId) => {
        set((s) => ({
          journalEntries: s.journalEntries.filter((e) => e.id !== entryId),
        }));
      },

      getReminderTasks: () =>
        get().tasks.filter((t) => t.remindOnDay && !t.done),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
        }
      },
      partialize: (s) => ({
        tasks: s.tasks,
        habits: s.habits,
        journalEntries: s.journalEntries,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<AppState> | undefined;
        return {
          ...current,
          ...p,
          tasks: (p?.tasks ?? []).map((t) => ({
            ...t,
            reminderAt: t.reminderAt ?? null,
          })),
          habits: p?.habits ?? [],
          journalEntries: p?.journalEntries ?? [],
        };
      },
    },
  ),
);

export function habitStreak(completedDates: string[]): number {
  const set = new Set(completedDates);
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function habitCompletedToday(habit: Habit): boolean {
  return habit.completedDates.includes(todayKey());
}

export type { TaskPriority };
