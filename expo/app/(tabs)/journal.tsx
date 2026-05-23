import React, { useRef } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { BookOpen, Plus, Trash2 } from "lucide-react-native";
import { ScreenShell } from "@/components/ScreenShell";
import { formatJournalDate } from "@/lib/dates";
import { useAppStore } from "@/stores/appStore";
import type { JournalEntry } from "@/types/models";
import { fonts } from "@/constants/theme";
import type { AppColors } from "@/constants/themes";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";

const JOURNAL_VERSE = {
  text:
    "Charm is deceptive, and beauty is fleeting; but a woman who fears the Lord is to be praised.",
  reference: "Proverbs 31 : 30",
} as const;

export default function JournalScreen() {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const entries = useAppStore((s) => s.journalEntries);
  const deleteJournalEntry = useAppStore((s) => s.deleteJournalEntry);
  const openSwipeRef = useRef<Swipeable | null>(null);
  const openNew = () => router.push("/add-journal");

  return (
    <ScreenShell verse={JOURNAL_VERSE}>
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Text style={styles.title}>Journal</Text>
          <Text style={styles.subtitle}>
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </Text>
        </View>
        <Pressable style={styles.addBtn} testID="add-entry-icon" onPress={openNew}>
          <Plus color={colors.primary} size={16} strokeWidth={1.8} />
        </Pressable>
      </View>

      {entries.length > 0 ? (
        <>
          <View style={styles.cardList}>
            {entries.map((entry) => (
              <JournalEntryRow
                key={entry.id}
                entry={entry}
                onPress={() => router.push(`/add-journal?id=${entry.id}`)}
                onDelete={() => deleteJournalEntry(entry.id)}
                openSwipeRef={openSwipeRef}
              />
            ))}
          </View>

          <Pressable style={styles.cta} testID="new-entry" onPress={openNew}>
            <Plus color={colors.white} size={16} strokeWidth={2} />
            <Text style={styles.ctaLabel}>New entry</Text>
          </Pressable>
        </>
      ) : (
        <EmptyState onAdd={openNew} />
      )}
    </ScreenShell>
  );
}

function JournalEntryRow({
  entry,
  onPress,
  onDelete,
  openSwipeRef,
}: {
  entry: JournalEntry;
  onPress: () => void;
  onDelete: () => void;
  openSwipeRef: React.MutableRefObject<Swipeable | null>;
}) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const swipeRef = useRef<Swipeable>(null);
  const preview =
    entry.body.length > 120 ? `${entry.body.slice(0, 120)}…` : entry.body;

  const confirmDelete = () => {
    Alert.alert("Delete entry?", `"${entry.title}" will be removed.`, [
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

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={() => (
        <Pressable
          style={styles.deleteAction}
          onPress={confirmDelete}
          testID={`delete-journal-${entry.id}`}
        >
          <Trash2 color={colors.white} size={18} strokeWidth={2} />
          <Text style={styles.deleteActionText}>Delete</Text>
        </Pressable>
      )}
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
      <Pressable style={styles.card} onPress={onPress}>
        <Text style={styles.entryDate}>{formatJournalDate(entry.createdAt)}</Text>
        <Text style={styles.entryTitle}>{entry.title}</Text>
        {preview ? (
          <Text style={styles.entryPreview} numberOfLines={3}>
            {preview}
          </Text>
        ) : null}
      </Pressable>
    </Swipeable>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.empty} testID="journal-empty">
      <BookOpen color={colors.border} size={42} strokeWidth={1.5} />
      <Text style={styles.emptyTitle}>No journal entries</Text>
      <Text style={styles.emptyHint}>Tap + to write your first entry</Text>
      <Pressable style={styles.emptyBtn} onPress={onAdd}>
        <Plus color={colors.white} size={14} />
        <Text style={styles.emptyBtnText}>New entry</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleLeft: { gap: 2 },
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
  cardList: { gap: 6 },
  deleteAction: {
    backgroundColor: colors.priorityHigh,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 12,
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
    borderRadius: 12,
    padding: 13,
    gap: 6,
  },
  entryDate: {
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1.2,
  },
  entryTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.text,
  },
  entryPreview: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16.5,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
  },
  ctaLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.white,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 6,
  },
  emptyHint: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textHint,
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
  },
  emptyBtnText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.white,
  },
  });
