import React from "react";
import {
  Apple,
  BedDouble,
  BookOpen,
  Droplets,
  Dumbbell,
  GraduationCap,
  HandHelping,
  Heart,
  Moon,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react-native";
import type { HabitIcon } from "@/types/models";

export const HABIT_ICON_OPTIONS: { id: HabitIcon; label: string }[] = [
  { id: "heart", label: "Gratitude" },
  { id: "pray", label: "Prayer" },
  { id: "book", label: "Scripture" },
  { id: "fitness", label: "Fitness" },
  { id: "studying", label: "Studying" },
  { id: "bed", label: "Making My Bed" },
  { id: "sleep", label: "Sleep" },
  { id: "water", label: "Drinking Water" },
  { id: "praise", label: "Giving Praise" },
  { id: "eating", label: "Healthy Eating" },
  { id: "fasting", label: "Fasting" },
];

type GlyphProps = {
  icon: HabitIcon;
  color: string;
  size?: number;
  strokeWidth?: number;
};

export function HabitIconGlyph({
  icon,
  color,
  size = 18,
  strokeWidth = 1.8,
}: GlyphProps) {
  const props = { color, size, strokeWidth } as const;

  switch (icon) {
    case "heart":
      return <Heart {...props} />;
    case "pray":
      return <HandHelping {...props} />;
    case "book":
      return <BookOpen {...props} />;
    case "fitness":
      return <Dumbbell {...props} />;
    case "studying":
      return <GraduationCap {...props} />;
    case "bed":
      return <BedDouble {...props} />;
    case "sleep":
      return <Moon {...props} />;
    case "water":
      return <Droplets {...props} />;
    case "praise":
      return <Sparkles {...props} />;
    case "eating":
      return <Apple {...props} />;
    case "fasting":
      return <UtensilsCrossed {...props} />;
    default:
      return <Heart {...props} />;
  }
}
