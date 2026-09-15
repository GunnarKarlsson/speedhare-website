import { createContext, useContext } from "react";

export type ThemeMode = "dark" | "light";

export interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

export function useThemeMode(): ThemeModeContextValue {
  const value = useContext(ThemeModeContext);
  if (!value) {
    throw new Error("useThemeMode must be used inside ThemeModeProvider");
  }
  return value;
}
