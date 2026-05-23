import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { fonts } from "@/constants/theme";
import { useAppTheme } from "@/contexts/ThemeContext";

type Props = {
  size?: number;
};

/** Circular "P" medallion used in the header and as a brand mark. */
export function LogoMark({ size = 28 }: Props) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: Math.max(1, size / 28),
        },
      ]}
    >
      <Text
        style={[
          styles.letter,
          { fontSize: size * 0.55, lineHeight: size * 0.7, color: colors.accent },
        ]}
      >
        P
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    fontFamily: fonts.displayItalicRegular,
    textAlign: "center",
    includeFontPadding: false,
    marginTop: -2,
  },
});
