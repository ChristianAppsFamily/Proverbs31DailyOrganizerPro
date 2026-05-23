import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_THEME_ID,
  type AppColors,
  type ThemeId,
  getThemeById,
} from "@/constants/themes";
import { fonts, radius, spacing } from "@/constants/theme";
import { loadThemeId, resolveThemeId, saveThemeId } from "@/lib/themeStorage";

type ThemeContextValue = {
  themeId: ThemeId;
  colors: AppColors;
  setThemeId: (id: ThemeId) => boolean;
  themeReady: boolean;
  fonts: typeof fonts;
  spacing: typeof spacing;
  radius: typeof radius;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(DEFAULT_THEME_ID);
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await loadThemeId();
      if (cancelled) return;
      setThemeIdState(resolveThemeId(stored));
      setThemeReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setThemeId = useCallback((id: ThemeId): boolean => {
    setThemeIdState(id);
    void saveThemeId(id);
    return true;
  }, []);

  const colors = useMemo(() => getThemeById(themeId).colors, [themeId]);

  const value = useMemo(
    () => ({
      themeId,
      colors,
      setThemeId,
      themeReady,
      fonts,
      spacing,
      radius,
    }),
    [themeId, colors, setThemeId, themeReady],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }
  return ctx;
}
