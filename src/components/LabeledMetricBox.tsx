import { Box, Typography } from "@mui/material";
import type { NewHomeTheme } from "../new_home/newHomeTheme";

export function LabeledMetricBox({
  label,
  value,
  nh,
  color,
}: {
  label: string;
  value: string;
  nh: NewHomeTheme;
  color?: string;
}) {
  const resolvedColor = color ?? nh.blue;
  return (
    <Box
      sx={{
        px: 1.25,
        py: 1,
        borderRadius: 1.25,
        bgcolor: "rgba(255,255,255,0.06)",
        border: `1px solid ${nh.border}`,
      }}
    >
      <Typography
        sx={{
          fontFamily: nh.mono,
          fontSize: "0.65rem",
          color: resolvedColor,
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontFamily: nh.sans, fontWeight: 700, color: nh.white }}>
        {value}
      </Typography>
    </Box>
  );
}
