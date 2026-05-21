import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Check, Clock, Plus } from "lucide-react-native";
import { ScreenShell } from "@/components/ScreenShell";
import { colors, fonts, radius } from "@/constants/theme";

type Priority = "high" | "medium" | "low";

type Task = {
  id: string;
  title: string;
  time: string;
  category: string;
  priority: Priority;
  recurring?: string;
  done: boolean;
};

const CATEGORIES = ["All", "Household", "Work", "Ministry", "Self-Care"] as const;

const TASKS: Task[] = [
  {
    id: "r1",
    title: "Prepare dinner — salmon & rice",
    time: "5:30 PM",
    category: "Household",
    priority: "high",
    done: false,
  },
  {
    id: "r2",
    title: "Review quarterly budget report",
    time: "2:00 PM",
    category: "Work",
    priority: "medium",
    done: false,
  },
  {
    id: "r3",
    title: "Bible study prep — Romans 8",
    time: "7:00 PM",
    category: "Ministry",
    priority: "low",
    recurring: "Weekly",
    done: false,
  },
  {
    id: "c1",
    title: "Morning devotional & prayer",
    time: "6:00 AM",
    category: "Self-Care",
    priority: "high",
    recurring: "Daily",
    done: true,
  },
  {
    id: "c2",
    title: "School drop-off",
    time: "7:45 AM",
    category: "Household",
    priority: "low",
    recurring: "Daily",
    done: true,
  },
];

const PRIORITY_COLOR: Record<Priority, string> = {
  high: colors.priorityHigh,
  medium: colors.priorityMedium,
  low: colors.priorityLow,
};

function formatToday(): string {
  const d = new Date();
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function TasksScreen() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const remaining = useMemo(() => TASKS.filter((t) => !t.done), []);
  const completed = useMemo(() => TASKS.filter((t) => t.done), []);

  const progress = 0.62;
  const doneCount = 5;
  const totalCount = 8;

  return (
    <ScreenShell>
      <View style={styles.dateRow}>
        <Text style={styles.dateText}>{formatToday()}</Text>
        <Text style={styles.greeting}>Good morning</Text>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {doneCount} of {totalCount} done
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
        style={styles.pillsScroll}
      >
        {CATEGORIES.map((c) => {
          const active = c === activeCategory;
          return (
            <Pressable
              key={c}
              onPress={() => setActiveCategory(c)}
              style={[styles.pill, active && styles.pillActive]}
              testID={`category-${c}`}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>
                {c}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>REMAINING</Text>
        <View style={styles.cardList}>
          {remaining.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>COMPLETED</Text>
        <View style={styles.cardList}>
          {completed.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </View>
      </View>

      <View style={styles.legend}>
        <LegendDot color={colors.priorityHigh} label="High" />
        <LegendDot color={colors.priorityMedium} label="Medium" />
        <LegendDot color={colors.priorityLow} label="Low" />
      </View>

      <Pressable style={styles.addButton} testID="add-task">
        <Plus color={colors.white} size={16} strokeWidth={2} />
        <Text style={styles.addButtonText}>Add task</Text>
      </Pressable>
    </ScreenShell>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <View style={[styles.card, task.done && styles.cardDone]}>
      <View
        style={[
          styles.checkbox,
          task.done && styles.checkboxDone,
        ]}
      >
        {task.done && <Check color={colors.white} size={12} strokeWidth={2.5} />}
      </View>

      <View style={styles.cardBody}>
        <Text
          style={[styles.taskTitle, task.done && styles.taskTitleDone]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        <View style={styles.metaRow}>
          <Clock color={colors.textHint} size={10} strokeWidth={1.8} />
          <Text style={styles.metaTime}>{task.time}</Text>
          <Text style={styles.metaCategory}>{task.category}</Text>
          {task.recurring ? (
            <View style={styles.recurringBadge}>
              <Text style={styles.recurringText}>{task.recurring}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View
        style={[styles.priorityDot, { backgroundColor: PRIORITY_COLOR[task.priority] }]}
      />
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  dateText: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.text,
  },
  greeting: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: -8,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  progressLabel: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textMuted,
  },
  pillsScroll: {
    marginHorizontal: -16,
    flexGrow: 0,
  },
  pillsRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  pillActive: {
    backgroundColor: colors.headerBg,
    borderColor: colors.headerBg,
  },
  pillText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.2,
  },
  pillTextActive: {
    color: colors.white,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    letterSpacing: 1.6,
    color: colors.textHint,
  },
  cardList: {
    gap: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 11,
    padding: 11,
  },
  cardDone: {
    opacity: 0.55,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#C8B8E8",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  taskTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12.5,
    color: colors.text,
    lineHeight: 17,
  },
  taskTitleDone: {
    color: colors.textHint,
    textDecorationLine: "line-through",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  metaTime: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textHint,
  },
  metaCategory: {
    fontFamily: fonts.body,
    fontSize: 9,
    color: colors.textHint,
    letterSpacing: 0.3,
    marginLeft: 2,
  },
  recurringBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginLeft: 2,
  },
  recurringText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.3,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: -4,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendLabel: {
    fontFamily: fonts.body,
    fontSize: 9,
    color: colors.textHint,
    letterSpacing: 0.3,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
    marginTop: 4,
  },
  addButtonText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.white,
    letterSpacing: 0.2,
  },
});
