import React, { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { spacing } from "@/constants/theme";
import type { AppColors } from "@/constants/themes";
import type { Verse } from "@/constants/verses";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { AppHeader } from "./AppHeader";

type Props = {
  children?: ReactNode;
  scroll?: boolean;
  verse?: Verse;
};

export function ScreenShell({ children, scroll = true, verse }: Props) {
  const styles = useThemedStyles(createStyles);

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
    </View>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
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
