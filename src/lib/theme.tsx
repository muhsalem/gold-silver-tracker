import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { THEMES, type ThemeId, type ThemeOption } from "./theme-constants";

export { THEMES, type ThemeId, type ThemeOption } from "./theme-constants";

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  currentTheme: ThemeOption;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "emerald",
  setTheme: () => {},
  currentTheme: THEMES[0],
});

const STORAGE_KEY = "nisab_visual_theme_v1";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("emerald");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
      if (saved && THEMES.some((t) => t.id === saved)) {
        setThemeState(saved);
        document.documentElement.setAttribute("data-theme", saved);
      } else {
        document.documentElement.setAttribute("data-theme", "emerald");
      }
    } catch {
      document.documentElement.setAttribute("data-theme", "emerald");
    }
  }, []);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    } catch {
      // ignore
    }
  };

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
