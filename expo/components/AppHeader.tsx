import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts, radius, spacing } from "@/constants/theme";
import type { AppColors } from "@/constants/themes";
import { getDailyVerse, type Verse } from "@/constants/verses";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { LogoMark } from "./LogoMark";
import { NotificationBell } from "./NotificationBell";

type Props = {
  verse?: Verse;
};

export function AppHeader({ verse: verseOverride }: Props = {}) {
  const insets = useSafeAreaInsets();
  const verse = verseOverride ?? getDailyVerse();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.decorWrap} pointerEvents="none">
        <View style={[styles.circle, styles.circleOuter]} />
        <View style={[styles.circle, styles.circleInner]} />
      </View>

      <View style={styles.brandRow}>
        <View style={styles.brandLeft}>
          <LogoMark size={28} />
          <Text style={styles.wordmark}>PROVERBS 31</Text>
        </View>
        <NotificationBell />
      </View>

      <View style={styles.verseCard}>
        <Text style={styles.verseText} numberOfLines={3}>
          &quot;{verse.text}&quot;
        </Text>
        <Text style={styles.verseRef}>{verse.reference}</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.headerBg,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
      overflow: "hidden",
    },
    decorWrap: {
      position: "absolute",
      top: -40,
      right: -40,
      width: 180,
      height: 180,
    },
    circle: {
      position: "absolute",
      borderRadius: 999,
      borderColor: "rgba(255,255,255,0.08)",
      borderWidth: 1,
    },
    circleOuter: {
      top: 0,
      right: 0,
      width: 180,
      height: 180,
    },
    circleInner: {
      top: 35,
      right: 35,
      width: 110,
      height: 110,
      borderColor: "rgba(255,255,255,0.12)",
    },
    brandRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    brandLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    wordmark: {
      color: "rgba(255,255,255,0.6)",
      fontSize: 9,
      letterSpacing: 2.4,
      fontFamily: fonts.bodyMedium,
    },
    verseCard: {
      backgroundColor: "rgba(255,255,255,0.06)",
      borderColor: "rgba(255,255,255,0.18)",
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      gap: spacing.sm,
    },
    verseText: {
      color: colors.accent,
      fontFamily: fonts.displayItalicRegular,
      fontSize: 16,
      lineHeight: 22,
      fontStyle: "italic",
    },
    verseRef: {
      color: "rgba(255,255,255,0.5)",
      fontSize: 9,
      letterSpacing: 2,
      fontFamily: fonts.bodyMedium,
    },
  });
