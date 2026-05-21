import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BookOpen, Heart, HandHelping, Plus } from "lucide-react-native";
import { ScreenShell } from "@/components/ScreenShell";
import { colors, fonts, radius } from "@/constants/theme";

type Habit = {
  id: string;
  name: string;
  streak: number;
  icon: "heart" | "pray" | "book";
  /** 7 entries for W T F S S M T (today is index 6). */
  days: boolean[];
};

const DAY_LABELS = ["W", "T", "F", "S", "S", "M", "T"] as const;
const TODAY_INDEX = 6;

const HABITS: Habit[] = [
  {
    id: "h1",
    name: "Gratitude",
    streak: 3,
    icon: "heart",
    days: [true, true, true, false, false, false, false],
  },
  {
    id: "h2",
    name: "Prayer",
    streak: 7,
    icon: "pray",
    days: [true, true, true, true, true, true, false],
  },
  {
    id: "h3",
    name: "Scripture",
    streak: 2,
    icon: "book",
    days: [false, false, false, false, false, true, false],
  },
];

const HABITS_VERSE = {
  text: "She gets up while it is still night; she provides food for her family.",
  reference: "Proverbs 31 : 15",
} as const;

export default function HabitsScreen() {
  const completedToday = HABITS.filter((h) => h.days[TODAY_INDEX]).length;

  return (
    <ScreenShell verse={HABITS_VERSE}>
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Text style={styles.title}>Daily Habits</Text>
          <Text style={styles.subtitle}>
            {completedToday} of {HABITS.length} completed today
          </Text>
        </View>
        <Pressable style={styles.addBtn} testID="add-habit">
          <Plus color={colors.primary} size={16} strokeWidth={1.8} />
        </Pressable>
      </View>

      <View style={styles.cardList}>
        {HABITS.map((h) => (
          <HabitCard key={h.id} habit={h} />
        ))}
      </View>
    </ScreenShell>
  );
}

function HabitIcon({ icon }: { icon: Habit["icon"] }) {
  const props = { color: colors.primary, size: 16, strokeWidth: 1.8 } as const;
  if (icon === "heart") return <Heart {...props} />;
  if (icon === "pray") return <HandHelping {...props} />;
  return <BookOpen {...props} />;
}

function HabitCard({ habit }: { habit: Habit }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.iconBadge}>
          <HabitIcon icon={habit.icon} />
        </View>
        <View style={styles.cardTopText}>
          <Text style={styles.habitName}>{habit.name}</Text>
          <Text style={styles.streak}>{habit.streak} day streak</Text>
        </View>
      </View>

      <View style={styles.tracker}>
        {DAY_LABELS.map((label, i) => {
          const isToday = i === TODAY_INDEX;
          const filled = habit.days[i];
          return (
            <View key={`${habit.id}-${i}`} style={styles.day}>
              <Text style={styles.dayLabel}>{label}</Text>
              <View
                style={[
                  styles.dot,
                  filled && styles.dotFilled,
                  !filled && isToday && styles.dotToday,
                  !filled && !isToday && styles.dotEmpty,
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleLeft: {
    gap: 2,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.text,
    lineHeight: 26,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textMuted,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cardList: {
    gap: 8,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 14,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTopText: {
    flex: 1,
    gap: 1,
  },
  habitName: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.text,
  },
  streak: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textMuted,
  },
  tracker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  day: {
    alignItems: "center",
    gap: 6,
  },
  dayLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    color: colors.textHint,
    letterSpacing: 0.4,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  dotFilled: {
    backgroundColor: colors.primary,
  },
  dotToday: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  dotEmpty: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
});

// silence unused radius import if any future tweak
void radius;
