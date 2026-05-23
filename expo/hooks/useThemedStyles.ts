import { useMemo } from "react";
import { StyleSheet } from "react-native";
import type { AppColors } from "@/constants/themes";
import { useAppTheme } from "@/contexts/ThemeContext";

export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  create: (colors: AppColors) => T,
): T {
  const { colors } = useAppTheme();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- create is a stable factory per screen
  return useMemo(() => StyleSheet.create(create(colors)), [colors]);
}
