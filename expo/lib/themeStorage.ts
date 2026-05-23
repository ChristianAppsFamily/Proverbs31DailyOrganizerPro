import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DEFAULT_THEME_ID,
  type ThemeId,
  getThemeById,
} from "@/constants/themes";

const THEME_KEY = "proverbs31-theme-v1";

export async function loadThemeId(): Promise<ThemeId> {
  try {
    const raw = await AsyncStorage.getItem(THEME_KEY);
    if (!raw) return DEFAULT_THEME_ID;
    const theme = getThemeById(raw as ThemeId);
    return theme.id;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

export async function saveThemeId(themeId: ThemeId): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, themeId);
}

export function resolveThemeId(stored: ThemeId): ThemeId {
  return getThemeById(stored).id;
}
