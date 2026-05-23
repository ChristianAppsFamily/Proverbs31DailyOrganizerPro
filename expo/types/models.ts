export type TaskPriority = "none" | "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  category: string;
  priority: TaskPriority;
  notes: string;
  remindOnDay: boolean;
  /** ISO datetime when the user wants to be reminded. */
  reminderAt: string | null;
  done: boolean;
  createdAt: string;
  notificationId?: string;
};

export type HabitIcon =
  | "heart"
  | "pray"
  | "book"
  | "fitness"
  | "studying"
  | "bed"
  | "sleep"
  | "water"
  | "praise"
  | "eating"
  | "fasting";

export type Habit = {
  id: string;
  name: string;
  icon: HabitIcon;
  completedDates: string[];
  createdAt: string;
};

export type JournalEntry = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};
