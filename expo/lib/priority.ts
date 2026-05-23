import type { AppColors } from "@/constants/themes";
import type { TaskPriority } from "@/types/models";

/** Task priority dots — consistent across all themes. */
export const TASK_PRIORITY_COLORS = {
  high: "#FF3B30",
  medium: "#FFCC00",
  low: "#34C759",
} as const;

const RANK: Record<TaskPriority, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
};

export function priorityColor(
  priority: TaskPriority,
  _palette?: AppColors,
): string {
  if (priority === "high") return TASK_PRIORITY_COLORS.high;
  if (priority === "medium") return TASK_PRIORITY_COLORS.medium;
  if (priority === "low") return TASK_PRIORITY_COLORS.low;
  return "#AEA4C4";
}

/** Highest priority among a list (for notification badge color). */
export function highestPriority(priorities: TaskPriority[]): TaskPriority {
  return priorities.reduce<TaskPriority>(
    (best, p) => (RANK[p] > RANK[best] ? p : best),
    "none",
  );
}

export function mapAddItemPriority(
  p: "None" | "Low" | "Medium" | "High",
): TaskPriority {
  return p.toLowerCase() as TaskPriority;
}
