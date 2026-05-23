/** Default reminder: tomorrow at 9:00 AM local time. */
export function defaultReminderDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return d;
}

export function formatReminderLabel(iso: string | null): string {
  if (!iso) return "Not set";
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function toReminderIso(date: Date): string {
  return date.toISOString();
}
