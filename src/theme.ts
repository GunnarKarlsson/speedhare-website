import { createTheme } from "@mui/material/styles";
import { createHomeTheme } from "./home/homeTheme";
import type { ThemeMode } from "./home/themeMode";

export function createAppTheme(mode: ThemeMode) {
  const nh = createHomeTheme(mode);
  return createTheme({
    palette: {
      mode,
      primary: { main: nh.blue },
      background: {
        default: nh.bg,
        paper: nh.card,
      },
      text: {
        primary: nh.white,
        secondary: nh.muted,
      },
      divider: nh.border,
    },
    typography: {
      fontFamily: nh.sans,
    },
  });
}
