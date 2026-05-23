import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { fonts, radius } from "@/constants/theme";
import type { AppColors } from "@/constants/themes";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { HABIT_ICON_OPTIONS, HabitIconGlyph } from "@/lib/habitIcons";
import { maybePromptAfterHabitAdded } from "@/lib/rateAppPrompt";
import { useAppStore } from "@/stores/appStore";
import type { HabitIcon } from "@/types/models";

export default function AddHabitScreen() {
  const router = useRouter();
  const { id: editId } = useLocalSearchParams<{ id?: string }>();
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const habits = useAppStore((s) => s.habits);
  const addHabit = useAppStore((s) => s.addHabit);
  const updateHabit = useAppStore((s) => s.updateHabit);
  const deleteHabit = useAppStore((s) => s.deleteHabit);

  const existing = editId ? habits.find((h) => h.id === editId) : undefined;
  const isEditing = Boolean(editId && existing);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState<HabitIcon>("heart");
  const [loadedId, setLoadedId] = useState<string | null>(null);

  useEffect(() => {
    if (!existing || loadedId === existing.id) return;
    setName(existing.name);
    setIcon(existing.icon);
    setLoadedId(existing.id);
  }, [existing, loadedId]);

  const close = () => router.back();

  const confirmDelete = () => {
    if (!editId) return;
    Alert.alert("Delete habit?", `"${existing?.name ?? "This habit"}" will be removed.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteHabit(editId);
          close();
        },
      },
    ]);
  };

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Name required", "Enter a name for your habit.");
      return;
    }

    if (isEditing && editId) {
      updateHabit(editId, { name: trimmed, icon });
      close();
      return;
    }

    addHabit(trimmed, icon);
    const state = useAppStore.getState();
    void maybePromptAfterHabitAdded(state.tasks.length, state.habits.length);
    close();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topBar}>
        <Pressable onPress={close} hitSlop={12}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>{isEditing ? "Edit Habit" : "New Habit"}</Text>
        <Pressable onPress={save} hitSlop={12} testID="save-habit">
          <Text style={styles.done}>Done</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>HABIT NAME</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Morning prayer"
          placeholderTextColor={colors.textHint}
          style={styles.input}
          autoFocus={!isEditing}
        />

        <Text style={styles.label}>ICON</Text>
        <View style={styles.iconRow}>
          {HABIT_ICON_OPTIONS.map((item) => {
            const active = icon === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setIcon(item.id)}
                style={[styles.iconPill, active && styles.iconPillActive]}
              >
                <HabitIconGlyph
                  icon={item.id}
                  color={active ? colors.white : colors.primary}
                  size={18}
                />
                <Text style={[styles.iconLabel, active && styles.iconLabelActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {isEditing ? (
          <Pressable style={styles.deleteButton} onPress={confirmDelete} testID="delete-habit">
            <Text style={styles.deleteButtonText}>Delete Habit</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.appBg },
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
    body: { padding: 16, gap: 16, paddingBottom: 40 },
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
    iconRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    iconPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
    },
    iconPillActive: {
      backgroundColor: colors.headerBg,
      borderColor: colors.headerBg,
    },
    iconLabel: {
      fontFamily: fonts.bodyMedium,
      fontSize: 11,
      color: colors.textMuted,
    },
    iconLabelActive: { color: colors.white },
    deleteButton: {
      marginTop: 8,
      paddingVertical: 14,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.priorityHigh,
      alignItems: "center",
    },
    deleteButtonText: {
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      color: colors.priorityHigh,
    },
  });
