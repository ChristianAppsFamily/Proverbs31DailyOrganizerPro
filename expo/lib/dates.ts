export function todayKey(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function formatDisplayDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatJournalDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

/** Last 7 calendar days ending today (oldest first). */
export function lastSevenDayKeys(): string[] {
  const keys: string[] = [];
  const end = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    keys.push(d.toISOString().slice(0, 10));
  }
  return keys;
}

export function dayLabelForKey(key: string): string {
  const d = new Date(`${key}T12:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "narrow" }).toUpperCase();
}

export function greetingForHour(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
