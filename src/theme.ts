import { createTheme } from "@mui/material/styles";
import { SITE_BACKGROUND } from "./colors";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1565c0" },
    background: {
      default: SITE_BACKGROUND,
    },
  },
  typography: {
    fontFamily: '"IoskeleyMono", monospace',
  },
});
