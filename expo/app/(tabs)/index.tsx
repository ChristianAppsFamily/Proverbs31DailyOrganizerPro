import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Check, Plus, Trash2 } from "lucide-react-native";
import { ScreenShell } from "@/components/ScreenShell";
import { formatDisplayDate, greetingForHour } from "@/lib/dates";
import { formatReminderLabel } from "@/lib/reminderDefaults";
import { priorityColor, TASK_PRIORITY_COLORS } from "@/lib/priority";
import { useAppStore } from "@/stores/appStore";
import type { Task } from "@/types/models";
import { fonts, radius } from "@/constants/theme";
import type { AppColors } from "@/constants/themes";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useHomeLaunchPermissions } from "@/hooks/useHomeLaunchPermissions";
import { useThemedStyles } from "@/hooks/useThemedStyles";

const CATEGORIES = ["All", "Household", "Work", "Ministry", "Self-Care"] as const;

export default function TasksScreen() {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  useHomeLaunchPermissions();
  const router = useRouter();
  const tasks = useAppStore((s) => s.tasks);
  const toggleTaskDone = useAppStore((s) => s.toggleTaskDone);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const openSwipeRef = useRef<Swipeable | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return tasks;
    return tasks.filter((t) => t.category === activeCategory);
  }, [tasks, activeCategory]);

  const remaining = useMemo(() => filtered.filter((t) => !t.done), [filtered]);
  const completed = useMemo(() => filtered.filter((t) => t.done), [filtered]);

  const totalCount = tasks.length;
  const doneCount = tasks.filter((t) => t.done).length;
  const progress = totalCount === 0 ? 0 : doneCount / totalCount;

  return (
    <ScreenShell>
      <View style={styles.dateRow}>
        <Text style={styles.dateText}>{formatDisplayDate(new Date().toISOString())}</Text>
        <Text style={styles.greeting}>{greetingForHour()}</Text>
      </View>

      {totalCount > 0 ? (
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>
            {doneCount} of {totalCount} done
          </Text>
        </View>
      ) : null}

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

      {totalCount === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No tasks yet</Text>
          <Text style={styles.emptyHint}>Tap Add task to create your first one.</Text>
        </View>
      ) : (
        <>
          {remaining.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>REMAINING</Text>
              <View style={styles.cardList}>
                {remaining.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onToggle={() => toggleTaskDone(t.id)}
                    onPress={() => router.push(`/add-item?id=${t.id}`)}
                    onDelete={() => deleteTask(t.id)}
                    openSwipeRef={openSwipeRef}
                  />
                ))}
              </View>
            </View>
          ) : null}

          {remaining.length > 0 && completed.length > 0 ? (
            <View style={styles.divider} />
          ) : null}

          {completed.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>COMPLETED</Text>
              <View style={styles.cardList}>
                {completed.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onToggle={() => toggleTaskDone(t.id)}
                    onPress={() => router.push(`/add-item?id=${t.id}`)}
                    onDelete={() => deleteTask(t.id)}
                    openSwipeRef={openSwipeRef}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </>
      )}

      <View style={styles.legend}>
        <LegendDot color={TASK_PRIORITY_COLORS.high} label="High" />
        <LegendDot color={TASK_PRIORITY_COLORS.medium} label="Medium" />
        <LegendDot color={TASK_PRIORITY_COLORS.low} label="Low" />
      </View>

      <Pressable
        style={styles.addButton}
        testID="add-task"
        onPress={() => router.push("/add-item")}
      >
        <Plus color={colors.white} size={16} strokeWidth={2} />
        <Text style={styles.addButtonText}>Add task</Text>
      </Pressable>
    </ScreenShell>
  );
}

function TaskCard({
  task,
  onToggle,
  onPress,
  onDelete,
  openSwipeRef,
}: {
  task: Task;
  onToggle: () => void;
  onPress: () => void;
  onDelete: () => void;
  openSwipeRef: React.MutableRefObject<Swipeable | null>;
}) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const swipeRef = useRef<Swipeable>(null);

  const confirmDelete = () => {
    Alert.alert("Delete task?", `"${task.title}" will be removed.`, [
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
    <Pressable style={styles.deleteAction} onPress={confirmDelete} testID={`delete-task-${task.id}`}>
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
      <Pressable
        style={[styles.card, task.done && styles.cardDone]}
        onPress={onPress}
      >
        <Pressable
          style={[styles.checkbox, task.done && styles.checkboxDone]}
          onPress={onToggle}
          hitSlop={8}
          testID={`toggle-task-${task.id}`}
        >
          {task.done ? (
            <Check color={colors.white} size={12} strokeWidth={2.5} />
          ) : null}
        </Pressable>

        <View style={styles.cardBody}>
          <Text
            style={[styles.taskTitle, task.done && styles.taskTitleDone]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
          <Text style={styles.metaCategory}>{task.category}</Text>
          {task.remindOnDay && task.reminderAt ? (
            <Text style={styles.metaReminder} numberOfLines={1}>
              Reminder: {formatReminderLabel(task.reminderAt)}
            </Text>
          ) : null}
          {task.notes ? (
            <Text style={styles.metaNotes} numberOfLines={1}>
              {task.notes}
            </Text>
          ) : null}
        </View>

        <View
          style={[
            styles.priorityDot,
            { backgroundColor: priorityColor(task.priority, colors) },
          ]}
        />
      </Pressable>
    </Swipeable>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
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
  empty: {
    alignItems: "center",
    paddingVertical: 32,
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
  deleteAction: {
    backgroundColor: colors.priorityHigh,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 11,
    marginLeft: 8,
    gap: 4,
  },
  deleteActionText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    color: colors.white,
    letterSpacing: 0.2,
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
  metaCategory: {
    fontFamily: fonts.body,
    fontSize: 9,
    color: colors.textHint,
    letterSpacing: 0.3,
  },
  metaReminder: {
    fontFamily: fonts.body,
    fontSize: 9,
    color: colors.primary,
  },
  metaNotes: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textMuted,
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
