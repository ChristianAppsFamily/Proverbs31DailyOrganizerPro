/**
 * Proverbs 31 — global design tokens.
 * These exact values must be used everywhere; no substitutions.
 */

export const colors = {
  headerBg: "#3E2878",
  primary: "#8B6FC0",
  accent: "#F5F0FF",
  appBg: "#FAF8FE",
  card: "#FFFFFF",
  surface: "#F0ECF8",
  border: "#E2D8F4",
  text: "#1E1340",
  textMuted: "#7A6E96",
  textHint: "#AEA4C4",
  priorityHigh: "#C47B8A",
  priorityMedium: "#8B6FC0",
  priorityLow: "#7AA89E",
  white: "#FFFFFF",
} as const;

export const fonts = {
  display: "CormorantGaramond_300Light",
  displayItalic: "CormorantGaramond_300Light_Italic",
  displayRegular: "CormorantGaramond_400Regular",
  displayItalicRegular: "CormorantGaramond_400Regular_Italic",
  body: "DMSans_400Regular",
  bodyMedium: "DMSans_500Medium",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: "#3E2878",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;
