export type ThemeId =
  | "royal"
  | "rose"
  | "sage"
  | "midnight"
  | "dawn"
  | "vineyard";

export type AppColors = {
  headerBg: string;
  primary: string;
  accent: string;
  appBg: string;
  card: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  textHint: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
  white: string;
};

export type AppTheme = {
  id: ThemeId;
  name: string;
  description: string;
  proOnly: boolean;
  colors: AppColors;
};

export const DEFAULT_THEME_ID: ThemeId = "vineyard";

const royal: AppColors = {
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
};

const vineyard: AppColors = {
  headerBg: "#4A1830",
  primary: "#9E4A6E",
  accent: "#FBF5F0",
  appBg: "#FAF6F4",
  card: "#FFFFFF",
  surface: "#F0E6E8",
  border: "#E0CCD4",
  text: "#2E1020",
  textMuted: "#7A5060",
  textHint: "#B0909C",
  priorityHigh: "#B83858",
  priorityMedium: "#9E4A6E",
  priorityLow: "#7AA89E",
  white: "#FFFFFF",
};

export const APP_THEMES: AppTheme[] = [
  {
    id: "vineyard",
    name: "Vineyard",
    description: "Rich wine and cream elegance",
    proOnly: false,
    colors: vineyard,
  },
  {
    id: "royal",
    name: "Royal Purple",
    description: "Classic Proverbs 31 look",
    proOnly: false,
    colors: royal,
  },
  {
    id: "rose",
    name: "Rose Garden",
    description: "Soft blush and warmth",
    proOnly: false,
    colors: {
      headerBg: "#6B2D4A",
      primary: "#C47B8A",
      accent: "#FFF5F7",
      appBg: "#FDF8F9",
      card: "#FFFFFF",
      surface: "#F8ECEE",
      border: "#EDD6DC",
      text: "#3D1A2A",
      textMuted: "#8E5A6A",
      textHint: "#C4A0AA",
      priorityHigh: "#B84A62",
      priorityMedium: "#C47B8A",
      priorityLow: "#7AA89E",
      white: "#FFFFFF",
    },
  },
  {
    id: "sage",
    name: "Quiet Sage",
    description: "Calm greens for daily peace",
    proOnly: false,
    colors: {
      headerBg: "#2F4F42",
      primary: "#5F8F7A",
      accent: "#F2F8F4",
      appBg: "#F7FAF8",
      card: "#FFFFFF",
      surface: "#E8F0EB",
      border: "#D4E4DA",
      text: "#1A3028",
      textMuted: "#5A7568",
      textHint: "#9AB0A4",
      priorityHigh: "#C47B8A",
      priorityMedium: "#5F8F7A",
      priorityLow: "#7AA89E",
      white: "#FFFFFF",
    },
  },
  {
    id: "midnight",
    name: "Midnight Faith",
    description: "Deep navy with soft lavender",
    proOnly: false,
    colors: {
      headerBg: "#1A2340",
      primary: "#6B7FD4",
      accent: "#EEF1FF",
      appBg: "#F4F6FC",
      card: "#FFFFFF",
      surface: "#E6EBF8",
      border: "#CDD6EE",
      text: "#121A33",
      textMuted: "#5A6488",
      textHint: "#98A2C0",
      priorityHigh: "#C47B8A",
      priorityMedium: "#6B7FD4",
      priorityLow: "#7AA89E",
      white: "#FFFFFF",
    },
  },
  {
    id: "dawn",
    name: "Morning Dawn",
    description: "Golden peach sunrise tones",
    proOnly: false,
    colors: {
      headerBg: "#7A4E28",
      primary: "#C9925A",
      accent: "#FFF8F0",
      appBg: "#FFFAF5",
      card: "#FFFFFF",
      surface: "#F8EDE0",
      border: "#EDD9C4",
      text: "#3D2818",
      textMuted: "#8A6A4E",
      textHint: "#C4A88E",
      priorityHigh: "#C47B8A",
      priorityMedium: "#C9925A",
      priorityLow: "#7AA89E",
      white: "#FFFFFF",
    },
  },
];

export function getThemeById(id: ThemeId): AppTheme {
  return APP_THEMES.find((t) => t.id === id) ?? APP_THEMES[0];
}
