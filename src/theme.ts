import { createTheme } from "@mui/material/styles";
import { createNewHomeTheme } from "./new_home/newHomeTheme";
import type { ThemeMode } from "./new_home/themeMode";

export function createAppTheme(mode: ThemeMode) {
  const nh = createNewHomeTheme(mode);
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
