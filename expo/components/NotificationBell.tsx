import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Bell, X } from "lucide-react-native";
import { fonts, radius, spacing } from "@/constants/theme";
import type { AppColors } from "@/constants/themes";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { formatReminderLabel } from "@/lib/reminderDefaults";
import { highestPriority, priorityColor } from "@/lib/priority";
import { useAppStore } from "@/stores/appStore";

export function NotificationBell() {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const tasks = useAppStore((s) => s.tasks);
  const toggleTaskDone = useAppStore((s) => s.toggleTaskDone);
  const [open, setOpen] = useState(false);

  const reminders = tasks.filter((t) => t.remindOnDay && !t.done);
  const count = reminders.length;
  const badgePriority = highestPriority(reminders.map((t) => t.priority));
  const badgeColor = priorityColor(badgePriority, colors);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={12}
        style={styles.bellWrap}
        accessibilityRole="button"
        accessibilityLabel={`Notifications, ${count} reminders`}
      >
        <Bell color="rgba(255,255,255,0.7)" size={20} strokeWidth={1.5} />
        {count > 0 ? (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{count > 9 ? "9+" : count}</Text>
          </View>
        ) : null}
      </Pressable>

      <Modal
        visible={open}
        animationType="fade"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Reminders</Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                <X color={colors.textMuted} size={18} />
              </Pressable>
            </View>

            {reminders.length === 0 ? (
              <Text style={styles.empty}>No active reminders. Turn on “Remind me on a day” when adding a task.</Text>
            ) : (
              reminders.map((task) => (
                <Pressable
                  key={task.id}
                  style={styles.reminderRow}
                  onPress={() => toggleTaskDone(task.id)}
                >
                  <View
                    style={[
                      styles.priorityDot,
                      { backgroundColor: priorityColor(task.priority, colors) },
                    ]}
                  />
                  <View style={styles.reminderText}>
                    <Text style={styles.reminderTitle} numberOfLines={2}>
                      {task.title}
                    </Text>
                    <Text style={styles.reminderMeta}>
                      {task.reminderAt
                        ? formatReminderLabel(task.reminderAt)
                        : task.category}
                    </Text>
                  </View>
                </Pressable>
              ))
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
  bellWrap: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.headerBg,
  },
  badgeText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    color: colors.white,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(30, 19, 64, 0.45)",
    justifyContent: "flex-start",
    paddingTop: 100,
    paddingHorizontal: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
    maxHeight: 360,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sheetTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  reminderText: {
    flex: 1,
    gap: 2,
  },
  reminderTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12.5,
    color: colors.text,
  },
  reminderMeta: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textHint,
  },
  });
