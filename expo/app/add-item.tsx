import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { colors, fonts, radius } from "@/constants/theme";

type Priority = "None" | "Low" | "Medium" | "High";
type Category = "Household" | "Work" | "Ministry" | "Self-Care";

const PRIORITIES: Priority[] = ["None", "Low", "Medium", "High"];
const CATEGORIES: Category[] = ["Household", "Work", "Ministry", "Self-Care"];

export default function AddItemScreen() {
  const router = useRouter();
  const [task, setTask] = useState<string>("");
  const [remindOnDay, setRemindOnDay] = useState<boolean>(false);
  const [priority, setPriority] = useState<Priority>("None");
  const [category, setCategory] = useState<Category>("Household");
  const [notes, setNotes] = useState<string>("");

  const close = () => router.back();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topBar}>
        <Pressable onPress={close} hitSlop={12} testID="cancel-btn">
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>Add Item</Text>
        <Pressable onPress={close} hitSlop={12} testID="done-btn">
          <Text style={styles.done}>Done</Text>
        </Pressable>
      </View>

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
          <View style={styles.rowCard}>
            <Text style={styles.rowText}>Remind me on a day</Text>
            <Switch
              value={remindOnDay}
              onValueChange={setRemindOnDay}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.border}
            />
          </View>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.appBg,
  },
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
  cancel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  title: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.text,
  },
  done: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.primary,
  },
  scroll: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  group: {
    gap: 8,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    letterSpacing: 1.6,
    color: colors.textHint,
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
  rowCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  rowText: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.text,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  priorityPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  priorityPillActive: {
    backgroundColor: colors.headerBg,
    borderColor: colors.headerBg,
  },
  priorityPillText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.2,
  },
  priorityPillTextActive: {
    color: colors.white,
  },
  categoryPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  categoryPillActive: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
  },
  categoryPillText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.2,
  },
  categoryPillTextActive: {
    color: colors.primary,
  },
  textarea: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 2,
    borderTopColor: colors.border,
    borderRightColor: colors.border,
    borderBottomColor: colors.border,
    borderLeftColor: colors.primary,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 11,
    minHeight: 70,
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.text,
    ...Platform.select({
      web: { outlineStyle: "none" as const },
      default: {},
    }),
  },
});
