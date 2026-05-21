import React, { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { colors, spacing } from "@/constants/theme";
import type { Verse } from "@/constants/verses";
import { AppHeader } from "./AppHeader";
import { AdBanner } from "./AdBanner";

type Props = {
  children?: ReactNode;
  /** When true, content renders inside a ScrollView. Default: true. */
  scroll?: boolean;
  /** Optional verse to display instead of the daily rotating verse. */
  verse?: Verse;
};

/** Standard screen shell: app background + sticky global header + content. */
export function ScreenShell({ children, scroll = true, verse }: Props) {
  return (
    <View style={styles.root}>
      <AppHeader verse={verse} />
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.scroll, styles.content]}>{children}</View>
      )}
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.appBg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
});
