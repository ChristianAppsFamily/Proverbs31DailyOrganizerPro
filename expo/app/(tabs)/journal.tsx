import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BookOpen, Plus } from "lucide-react-native";
import { ScreenShell } from "@/components/ScreenShell";
import { colors, fonts, radius } from "@/constants/theme";

type Entry = {
  id: string;
  date: string;
  title: string;
  preview: string;
};

const ENTRIES: Entry[] = [
  {
    id: "e1",
    date: "MAY 19, 2026",
    title: "Grateful for small mercies",
    preview:
      "Today I found peace in the quiet morning hours before everyone woke. The Lord's presence was so near...",
  },
  {
    id: "e2",
    date: "MAY 18, 2026",
    title: "Reflections on patience",
    preview:
      "The children tested me today, but I remembered Proverbs 31 — she speaks with wisdom and faithful instruction...",
  },
];

const JOURNAL_VERSE = {
  text:
    "Charm is deceptive, and beauty is fleeting; but a woman who fears the Lord is to be praised.",
  reference: "Proverbs 31 : 30",
} as const;

export default function JournalScreen() {
  const entries = ENTRIES;
  const hasEntries = entries.length > 0;

  return (
    <ScreenShell verse={JOURNAL_VERSE}>
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Text style={styles.title}>Journal</Text>
          <Text style={styles.subtitle}>
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </Text>
        </View>
        <Pressable style={styles.addBtn} testID="add-entry-icon">
          <Plus color={colors.primary} size={16} strokeWidth={1.8} />
        </Pressable>
      </View>

      {hasEntries ? (
        <>
          <View style={styles.cardList}>
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </View>

          <Pressable style={styles.cta} testID="new-entry">
            <Plus color={colors.white} size={16} strokeWidth={2} />
            <Text style={styles.ctaLabel}>New entry</Text>
          </Pressable>
        </>
      ) : (
        <EmptyState />
      )}
    </ScreenShell>
  );
}

function EntryCard({ entry }: { entry: Entry }) {
  return (
    <View style={styles.card}>
      <Text style={styles.entryDate}>{entry.date}</Text>
      <Text style={styles.entryTitle}>{entry.title}</Text>
      <Text style={styles.entryPreview} numberOfLines={2}>
        {entry.preview}
      </Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty} testID="journal-empty">
      <BookOpen color={colors.border} size={42} strokeWidth={1.5} />
      <Text style={styles.emptyTitle}>No journal entries</Text>
      <Text style={styles.emptyHint}>Tap + to write your first entry</Text>
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
    gap: 6,
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
});

void radius;
