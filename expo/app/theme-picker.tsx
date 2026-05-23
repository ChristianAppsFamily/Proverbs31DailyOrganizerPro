import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { APP_THEMES, type ThemeId } from "@/constants/themes";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { fonts } from "@/constants/theme";
import type { AppColors } from "@/constants/themes";

export default function ThemePickerScreen() {
  const router = useRouter();
  const { themeId, setThemeId, colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  const close = () => router.back();

  const selectTheme = (id: ThemeId) => {
    setThemeId(id);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topBar}>
        <Pressable onPress={close} hitSlop={12}>
          <Text style={styles.cancel}>Close</Text>
        </Pressable>
        <Text style={styles.title}>Custom Themes</Text>
        <View style={styles.topSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.hint}>
          Choose a color theme for your app. Vineyard is the default look.
        </Text>

        <View style={styles.grid}>
          {APP_THEMES.map((theme) => {
            const active = themeId === theme.id;
            return (
              <Pressable
                key={theme.id}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => selectTheme(theme.id)}
              >
                <View style={styles.swatches}>
                  <View
                    style={[styles.swatch, { backgroundColor: theme.colors.headerBg }]}
                  />
                  <View
                    style={[styles.swatch, { backgroundColor: theme.colors.primary }]}
                  />
                  <View
                    style={[styles.swatch, { backgroundColor: theme.colors.appBg }]}
                  />
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardName}>{theme.name}</Text>
                  <Text style={styles.cardDesc}>{theme.description}</Text>
                </View>
                <View style={styles.cardRight}>
                  {active ? (
                    <View style={styles.checkBadge}>
                      <Check color={colors.white} size={14} strokeWidth={2.5} />
                    </View>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
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
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    cancel: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
    title: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text },
    topSpacer: { width: 40 },
    body: { padding: 16, gap: 12, paddingBottom: 32 },
    hint: {
      fontFamily: fonts.body,
      fontSize: 12,
      color: colors.textMuted,
      lineHeight: 18,
    },
    grid: { gap: 10 },
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    cardActive: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    swatches: { flexDirection: "row", gap: 4 },
    swatch: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardFooter: { flex: 1, gap: 2 },
    cardName: {
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      color: colors.text,
    },
    cardDesc: {
      fontFamily: fonts.body,
      fontSize: 11,
      color: colors.textMuted,
    },
    cardRight: {
      minWidth: 44,
      alignItems: "flex-end",
      justifyContent: "center",
    },
    checkBadge: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
  });
