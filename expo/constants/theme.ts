/**
 * Static design tokens. Use `useAppTheme()` for colors that change with themes.
 */
import { DEFAULT_THEME_ID, getThemeById } from "./themes";

/** Default palette — prefer `useAppTheme().colors` in components. */
export const colors = getThemeById(DEFAULT_THEME_ID).colors;

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
