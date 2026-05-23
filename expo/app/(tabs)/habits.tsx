import React, { useRef } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Plus, Trash2 } from "lucide-react-native";
import { HabitIconGlyph } from "@/lib/habitIcons";
import { ScreenShell } from "@/components/ScreenShell";
import { dayLabelForKey, lastSevenDayKeys } from "@/lib/dates";
import {
  habitCompletedToday,
  habitStreak,
  useAppStore,
} from "@/stores/appStore";
import type { Habit } from "@/types/models";
import { fonts } from "@/constants/theme";
import type { AppColors } from "@/constants/themes";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";

const HABITS_VERSE = {
  text: "She gets up while it is still night; she provides food for her family.",
  reference: "Proverbs 31 : 15",
} as const;

export default function HabitsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const habits = useAppStore((s) => s.habits);
  const toggleHabitToday = useAppStore((s) => s.toggleHabitToday);
  const deleteHabit = useAppStore((s) => s.deleteHabit);
  const openSwipeRef = useRef<Swipeable | null>(null);
  const completedToday = habits.filter(habitCompletedToday).length;

  return (
    <ScreenShell verse={HABITS_VERSE}>
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Text style={styles.title}>Daily Habits</Text>
          <Text style={styles.subtitle}>
            {habits.length === 0
              ? "Start a habit today"
              : `${completedToday} of ${habits.length} completed today`}
          </Text>
        </View>
        <Pressable
          style={styles.addBtn}
          testID="add-habit"
          onPress={() => router.push("/add-habit")}
        >
          <Plus color={colors.primary} size={16} strokeWidth={1.8} />
        </Pressable>
      </View>

      {habits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No habits yet</Text>
          <Text style={styles.emptyHint}>Tap + to add your first daily habit.</Text>
        </View>
      ) : (
        <View style={styles.cardList}>
          {habits.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              onToggleToday={() => toggleHabitToday(h.id)}
              onPress={() => router.push(`/add-habit?id=${h.id}`)}
              onDelete={() => deleteHabit(h.id)}
              openSwipeRef={openSwipeRef}
            />
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

function HabitCard({
  habit,
  onToggleToday,
  onPress,
  onDelete,
  openSwipeRef,
}: {
  habit: Habit;
  onToggleToday: () => void;
  onPress: () => void;
  onDelete: () => void;
  openSwipeRef: React.MutableRefObject<Swipeable | null>;
}) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const swipeRef = useRef<Swipeable>(null);
  const dayKeys = lastSevenDayKeys();
  const todayKey = dayKeys[dayKeys.length - 1];
  const streak = habitStreak(habit.completedDates);

  const confirmDelete = () => {
    Alert.alert("Delete habit?", `"${habit.name}" will be removed.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          swipeRef.current?.close();
          onDelete();
        },
      },
    ]);
  };

  const renderRightActions = () => (
    <Pressable
      style={styles.deleteAction}
      onPress={confirmDelete}
      testID={`delete-habit-${habit.id}`}
    >
      <Trash2 color={colors.white} size={18} strokeWidth={2} />
      <Text style={styles.deleteActionText}>Delete</Text>
    </Pressable>
  );

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      onSwipeableWillOpen={() => {
        if (openSwipeRef.current && openSwipeRef.current !== swipeRef.current) {
          openSwipeRef.current.close();
        }
        openSwipeRef.current = swipeRef.current;
      }}
      onSwipeableClose={() => {
        if (openSwipeRef.current === swipeRef.current) {
          openSwipeRef.current = null;
        }
      }}
    >
      <View style={styles.card}>
        <Pressable style={styles.cardTop} onPress={onPress}>
          <View style={styles.iconBadge}>
            <HabitIconGlyph icon={habit.icon} color={colors.primary} size={16} />
          </View>
          <View style={styles.cardTopText}>
            <Text style={styles.habitName}>{habit.name}</Text>
            <Text style={styles.streak}>
              {streak > 0 ? `${streak} day streak` : "Tap today’s dot to check in"}
            </Text>
          </View>
        </Pressable>

        <View style={styles.tracker}>
          {dayKeys.map((key) => {
            const isToday = key === todayKey;
            const filled = habit.completedDates.includes(key);
            return (
              <Pressable
                key={`${habit.id}-${key}`}
                style={styles.day}
                onPress={isToday ? onToggleToday : undefined}
                disabled={!isToday}
              >
                <Text style={styles.dayLabel}>{dayLabelForKey(key)}</Text>
                <View
                  style={[
                    styles.dot,
                    filled && styles.dotFilled,
                    !filled && isToday && styles.dotToday,
                    !filled && !isToday && styles.dotEmpty,
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
    </Swipeable>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
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
    empty: {
      alignItems: "center",
      paddingVertical: 48,
      gap: 6,
    },
    emptyTitle: {
      fontFamily: fonts.bodyMedium,
      fontSize: 14,
      color: colors.textMuted,
    },
    emptyHint: {
      fontFamily: fonts.body,
      fontSize: 11,
      color: colors.textHint,
    },
    cardList: {
      gap: 8,
    },
    deleteAction: {
      backgroundColor: colors.priorityHigh,
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      borderRadius: 14,
      marginLeft: 8,
      gap: 4,
    },
    deleteActionText: {
      fontFamily: fonts.bodyMedium,
      fontSize: 10,
      color: colors.white,
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
