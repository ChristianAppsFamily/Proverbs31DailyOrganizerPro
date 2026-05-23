/** 0 = Sunday … 6 = Saturday (matches Date.getDay()). */
export type SabbathWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const SABBATH_WEEKDAY_OPTIONS: { day: SabbathWeekday; label: string }[] = [
  { day: 0, label: "Sun" },
  { day: 1, label: "Mon" },
  { day: 2, label: "Tue" },
  { day: 3, label: "Wed" },
  { day: 4, label: "Thu" },
  { day: 5, label: "Fri" },
  { day: 6, label: "Sat" },
];

export const DEFAULT_SABBATH_WEEKDAY: SabbathWeekday = 0;

export function weekdayLabel(day: SabbathWeekday): string {
  return SABBATH_WEEKDAY_OPTIONS.find((o) => o.day === day)?.label ?? "Sun";
}

export function fullWeekdayName(day: SabbathWeekday): string {
  const names = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return names[day] ?? "Sunday";
}

export function isRestDay(date: Date, restDay: SabbathWeekday): boolean {
  return date.getDay() === restDay;
}
