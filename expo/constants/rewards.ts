export type RewardStyleId = "confetti" | "sparkles" | "glow" | "victory" | "full";

export type RewardTriggerKind =
  | "allTasksDone"
  | "habitWeekComplete"
  | "habitCheckInMilestone"
  | "preview";

/** Total habit check-ins between celebrations (30, 60, 90, and so on). */
export const HABIT_CHECKIN_MILESTONE_STEP = 30;

export type RewardStyleOption = {
  id: RewardStyleId;
  name: string;
  description: string;
};

export const REWARD_STYLE_OPTIONS: RewardStyleOption[] = [
  {
    id: "confetti",
    name: "Confetti Rain",
    description: "Colorful pieces fall from the top",
  },
  {
    id: "sparkles",
    name: "Sparkle Burst",
    description: "Golden sparkles radiate from the center",
  },
  {
    id: "glow",
    name: "Warm Glow",
    description: "A soft light wash over the screen",
  },
  {
    id: "victory",
    name: "Victory Banner",
    description: "An encouraging message slides up",
  },
  {
    id: "full",
    name: "Full Celebration",
    description: "Confetti, glow, banner, and a gentle haptic",
  },
];

export const DEFAULT_REWARD_STYLE: RewardStyleId = "confetti";

export const REWARD_MESSAGES: Record<RewardTriggerKind, string[]> = {
  allTasksDone: [
    "You cleared today's list. Well done!",
    "Every task is checked off. Rest in this peace!",
    "She cares for her household. You showed up for yours today!",
    "Today is finished. Celebrate this faithful work!",
  ],
  habitWeekComplete: [
    "Seven days of showing up. That is beautiful faithfulness!",
    "You filled the whole week. Keep walking in grace!",
    "One week, every day checked in. Your steadiness inspires!",
    "Small steps across seven days. The Lord sees your heart!",
  ],
  habitCheckInMilestone: [
    "Your consistency is building something lasting. Keep going!",
    "Faithful check-ins add up. You are doing the work!",
    "Each visit to this habit plants another seed. Beautiful growth!",
    "She sets about her work with strength. You are doing the same!",
  ],
  preview: [
    "This is how your celebration will look!",
    "When you win, the app will cheer you on like this!",
  ],
};

export function pickRewardMessage(kind: RewardTriggerKind): string {
  const pool = REWARD_MESSAGES[kind];
  return pool[Math.floor(Math.random() * pool.length)] ?? pool[0];
}

/** Confetti palette in warm faith-forward tones. */
export const CONFETTI_COLORS = [
  "#FF3B30",
  "#FFCC00",
  "#34C759",
  "#9E4A6E",
  "#C47B8A",
  "#8B6FC0",
  "#F5B8E8",
  "#FFD60A",
];
