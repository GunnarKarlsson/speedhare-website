import { useMemo, useState, type ReactNode } from "react";
import { ThemeModeContext, type ThemeMode, type ThemeModeContextValue } from "./themeMode";

function getInitialMode(): ThemeMode {
  const saved = localStorage.getItem("preferred-theme");
  return saved === "light" ? "light" : "dark";
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      toggleMode: () => {
        setMode((prev) => {
          const next: ThemeMode = prev === "dark" ? "light" : "dark";
          localStorage.setItem("preferred-theme", next);
          return next;
        });
      },
    }),
    [mode],
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}
