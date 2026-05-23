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
import { fonts } from "@/constants/theme";
import type { AppColors } from "@/constants/themes";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useAppStore } from "@/stores/appStore";

export default function AddJournalScreen() {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { id: editId } = useLocalSearchParams<{ id?: string }>();
  const journalEntries = useAppStore((s) => s.journalEntries);
  const addJournalEntry = useAppStore((s) => s.addJournalEntry);
  const updateJournalEntry = useAppStore((s) => s.updateJournalEntry);
  const deleteJournalEntry = useAppStore((s) => s.deleteJournalEntry);

  const existing = editId
    ? journalEntries.find((e) => e.id === editId)
    : undefined;
  const isEditing = Boolean(editId && existing);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loadedId, setLoadedId] = useState<string | null>(null);

  useEffect(() => {
    if (!existing || loadedId === existing.id) return;
    setTitle(existing.title);
    setBody(existing.body);
    setLoadedId(existing.id);
  }, [existing, loadedId]);

  const close = () => router.back();

  const confirmDelete = () => {
    if (!editId) return;
    Alert.alert("Delete entry?", "This journal entry will be removed permanently.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteJournalEntry(editId);
          close();
        },
      },
    ]);
  };

  const save = () => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle && !trimmedBody) {
      Alert.alert("Entry required", "Add a title or write something in your journal.");
      return;
    }

    if (isEditing && editId) {
      updateJournalEntry(editId, {
        title: trimmedTitle || "Untitled entry",
        body: trimmedBody,
      });
      close();
      return;
    }

    addJournalEntry(trimmedTitle || "Untitled entry", trimmedBody);
    close();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topBar}>
        <Pressable onPress={close} hitSlop={12}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>{isEditing ? "Edit Entry" : "New Entry"}</Text>
        <Pressable onPress={save} hitSlop={12}>
          <Text style={styles.done}>Done</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>TITLE</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="What is this entry about?"
            placeholderTextColor={colors.textHint}
            style={styles.input}
          />

          <Text style={styles.label}>ENTRY</Text>
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Write your thoughts..."
            placeholderTextColor={colors.textHint}
            style={styles.textarea}
            multiline
            textAlignVertical="top"
          />

          {isEditing ? (
            <Pressable style={styles.deleteButton} onPress={confirmDelete}>
              <Text style={styles.deleteButtonText}>Delete Entry</Text>
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
  scroll: { padding: 16, gap: 12, paddingBottom: 120 },
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
  textarea: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.headerBg,
    borderRadius: 10,
    padding: 14,
    minHeight: 200,
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
