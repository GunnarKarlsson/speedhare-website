import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo, useState, type ReactNode } from "react";
import { createAppTheme } from "../theme";
import { ThemeModeContext, type ThemeMode, type ThemeModeContextValue } from "./themeMode";

function getInitialMode(): ThemeMode {
  try {
    const saved = localStorage.getItem("preferred-theme");
    return saved === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      toggleMode: () => {
        setMode((prev) => {
          const next: ThemeMode = prev === "dark" ? "light" : "dark";
          try {
            localStorage.setItem("preferred-theme", next);
          } catch {
            // Ignore private-mode / quota failures.
          }
          return next;
        });
      },
    }),
    [mode],
  );

  const muiTheme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
