import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ReminderSchedulePanel } from "@/components/ReminderSchedulePanel";
import { fonts, radius } from "@/constants/theme";
import type { AppColors } from "@/constants/themes";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { mapAddItemPriority } from "@/lib/priority";
import {
  applyTaskReminder,
  cancelTaskReminder,
  requestNotificationPermission,
} from "@/lib/notifications";
import { toReminderIso, defaultReminderDate } from "@/lib/reminderDefaults";
import { maybePromptAfterTaskAdded } from "@/lib/rateAppPrompt";
import { useAppStore } from "@/stores/appStore";
import type { Task, TaskPriority } from "@/types/models";

type Priority = "None" | "Low" | "Medium" | "High";
type Category = "Household" | "Work" | "Ministry" | "Self-Care";

const PRIORITIES: Priority[] = ["None", "Low", "Medium", "High"];
const CATEGORIES: Category[] = ["Household", "Work", "Ministry", "Self-Care"];

function priorityToUI(p: TaskPriority): Priority {
  if (p === "none") return "None";
  return (p.charAt(0).toUpperCase() + p.slice(1)) as Priority;
}

async function buildTaskWithReminder(
  base: Omit<Task, "id" | "createdAt"> & { id?: string; notificationId?: string },
): Promise<Partial<Task>> {
  if (!base.remindOnDay) {
    if (base.notificationId) {
      await cancelTaskReminder(base.notificationId);
    }
    return {
      remindOnDay: false,
      reminderAt: null,
      notificationId: undefined,
    };
  }

  const permission = await requestNotificationPermission();
  if (permission !== "granted") {
    throw new Error("NOTIFICATION_DENIED");
  }

  const taskForSchedule = {
    ...base,
    id: base.id ?? "pending",
    createdAt: new Date().toISOString(),
    done: base.done ?? false,
    reminderAt: base.reminderAt ?? toReminderIso(defaultReminderDate()),
  } as Task;

  const scheduled = await applyTaskReminder(taskForSchedule);
  return {
    remindOnDay: true,
    reminderAt: scheduled.reminderAt,
    notificationId: scheduled.notificationId,
  };
}

export default function AddItemScreen() {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { id: editId } = useLocalSearchParams<{ id?: string }>();
  const tasks = useAppStore((s) => s.tasks);
  const addTask = useAppStore((s) => s.addTask);
  const updateTask = useAppStore((s) => s.updateTask);
  const deleteTask = useAppStore((s) => s.deleteTask);

  const existing = editId ? tasks.find((t) => t.id === editId) : undefined;
  const isEditing = Boolean(editId && existing);

  const [task, setTask] = useState("");
  const [remindOnDay, setRemindOnDay] = useState(false);
  const [reminderAt, setReminderAt] = useState<string | null>(null);
  const [priority, setPriority] = useState<Priority>("None");
  const [category, setCategory] = useState<Category>("Household");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadedId, setLoadedId] = useState<string | null>(null);

  useEffect(() => {
    if (!existing || loadedId === existing.id) return;
    setTask(existing.title);
    setRemindOnDay(existing.remindOnDay);
    setReminderAt(existing.reminderAt ?? null);
    setPriority(priorityToUI(existing.priority));
    setCategory(
      CATEGORIES.includes(existing.category as Category)
        ? (existing.category as Category)
        : "Household",
    );
    setNotes(existing.notes);
    setLoadedId(existing.id);
  }, [existing, loadedId]);

  const close = () => router.back();

  const confirmDelete = () => {
    if (!editId) return;
    Alert.alert("Delete task?", "This task will be removed permanently.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteTask(editId);
          close();
        },
      },
    ]);
  };

  const save = async () => {
    const title = task.trim();
    if (!title) {
      Alert.alert("Task required", "Enter what you need to do.");
      return;
    }

    setSaving(true);
    try {
      const core = {
        title,
        category,
        priority: mapAddItemPriority(priority),
        notes: notes.trim(),
        remindOnDay,
        reminderAt: remindOnDay ? reminderAt : null,
        done: existing?.done ?? false,
      };

      let reminderPatch: Partial<Task> = {};
      try {
        reminderPatch = await buildTaskWithReminder({
          ...core,
          id: editId,
          notificationId: existing?.notificationId,
        });
      } catch (e) {
        if (e instanceof Error && e.message === "NOTIFICATION_DENIED") {
          Alert.alert(
            "Notifications",
            "Enable notifications in Settings to schedule task reminders.",
          );
          return;
        }
        throw e;
      }

      if (isEditing && editId) {
        updateTask(editId, { ...core, ...reminderPatch });
        close();
        return;
      }

      addTask({
        ...core,
        reminderAt: reminderPatch.reminderAt ?? null,
        notificationId: reminderPatch.notificationId,
      });

      const { tasks, habits } = useAppStore.getState();
      void maybePromptAfterTaskAdded(tasks.length, habits.length);

      close();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topBar}>
        <Pressable onPress={close} hitSlop={12} testID="cancel-btn">
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>{isEditing ? "Edit Item" : "Add Item"}</Text>
        <Pressable
          onPress={save}
          hitSlop={12}
          testID="done-btn"
          disabled={saving}
        >
          <Text style={[styles.done, saving && styles.doneDisabled]}>Done</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.group}>
            <Text style={styles.label}>TASK</Text>
            <TextInput
              value={task}
              onChangeText={setTask}
              placeholder="What do you need to do?"
              placeholderTextColor={colors.textHint}
              style={styles.input}
              testID="task-input"
            />
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>REMINDER</Text>
            <ReminderSchedulePanel
              enabled={remindOnDay}
              reminderAt={reminderAt}
              onEnabledChange={setRemindOnDay}
              onReminderAtChange={setReminderAt}
            />
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>PRIORITY</Text>
            <View style={styles.pillsRow}>
              {PRIORITIES.map((p) => {
                const active = p === priority;
                return (
                  <Pressable
                    key={p}
                    onPress={() => setPriority(p)}
                    style={[styles.priorityPill, active && styles.priorityPillActive]}
                    testID={`priority-${p}`}
                  >
                    <Text
                      style={[
                        styles.priorityPillText,
                        active && styles.priorityPillTextActive,
                      ]}
                    >
                      {p}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>CATEGORY</Text>
            <View style={styles.pillsWrap}>
              {CATEGORIES.map((c) => {
                const active = c === category;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setCategory(c)}
                    style={[styles.categoryPill, active && styles.categoryPillActive]}
                    testID={`category-${c}`}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        active && styles.categoryPillTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>NOTES</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes here..."
              placeholderTextColor={colors.textHint}
              style={styles.textarea}
              multiline
              textAlignVertical="top"
              testID="notes-input"
            />
          </View>

          {isEditing ? (
            <Pressable
              style={styles.deleteButton}
              onPress={confirmDelete}
              testID="delete-task-btn"
            >
              <Text style={styles.deleteButtonText}>Delete Task</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.appBg },
  flex: { flex: 1 },
  topBar: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancel: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  title: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text },
  done: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.primary },
  doneDisabled: { opacity: 0.5 },
  scroll: { padding: 16, gap: 16, paddingBottom: 120 },
  group: { gap: 8 },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    letterSpacing: 1.6,
    color: colors.headerBg,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 11,
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.text,
  },
  pillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  priorityPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priorityPillActive: {
    backgroundColor: colors.headerBg,
    borderColor: colors.headerBg,
  },
  priorityPillText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.textMuted,
  },
  priorityPillTextActive: { color: colors.white },
  categoryPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPillActive: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
  },
  categoryPillText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.textMuted,
  },
  categoryPillTextActive: { color: colors.primary },
  textarea: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.headerBg,
    borderRadius: 10,
    padding: 14,
    minHeight: 160,
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.text,
    lineHeight: 18,
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.priorityHigh,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  deleteButtonText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12.5,
    color: colors.priorityHigh,
  },
  });
