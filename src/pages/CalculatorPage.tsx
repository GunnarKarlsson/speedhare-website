import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { SeoHead } from "../components/SeoHead";
import { useSiteCatalog } from "../hooks/useSiteCatalog";
import { NewHomeFooter } from "../new_home/NewHomeFooter";
import { NewHomeNav } from "../new_home/NewHomeNav";
import { createNewHomeTheme } from "../new_home/newHomeTheme";
import { useThemeMode } from "../new_home/themeMode";
import {
  formatDuration,
  formatDurationLong,
  formatNumber,
  formatPace,
  parsePositiveNumber,
  parseTimeToSeconds,
} from "../calculatorParse";

type CalculationMode = "time" | "speed" | "distance";

type DistanceUnit = {
  value: string;
  label: string;
  meters: number;
};

type SpeedUnit = {
  value: string;
  label: string;
  metersPerSecond: number;
};

const DISTANCE_UNITS: DistanceUnit[] = [
  { value: "in", label: "in", meters: 0.0254 },
  { value: "ft", label: "ft", meters: 0.3048 },
  { value: "yd", label: "yd", meters: 0.9144 },
  { value: "mi", label: "mi", meters: 1609.344 },
  { value: "cm", label: "cm", meters: 0.01 },
  { value: "m", label: "m", meters: 1 },
  { value: "km", label: "km", meters: 1000 },
  { value: "nmi", label: "nmi", meters: 1852 },
];

const SPEED_UNITS: SpeedUnit[] = [
  { value: "in-s", label: "in/s", metersPerSecond: 0.0254 },
  { value: "in-min", label: "in/min", metersPerSecond: 0.0254 / 60 },
  { value: "in-hr", label: "in/hr", metersPerSecond: 0.0254 / 3600 },
  { value: "ft-s", label: "ft/s", metersPerSecond: 0.3048 },
  { value: "ft-min", label: "ft/min", metersPerSecond: 0.3048 / 60 },
  { value: "ft-hr", label: "ft/hr", metersPerSecond: 0.3048 / 3600 },
  { value: "yd-s", label: "yd/s", metersPerSecond: 0.9144 },
  { value: "yd-min", label: "yd/min", metersPerSecond: 0.9144 / 60 },
  { value: "yd-hr", label: "yd/hr", metersPerSecond: 0.9144 / 3600 },
  { value: "cm-s", label: "cm/s", metersPerSecond: 0.01 },
  { value: "cm-min", label: "cm/min", metersPerSecond: 0.01 / 60 },
  { value: "m-s", label: "m/s", metersPerSecond: 1 },
  { value: "m-min", label: "m/min", metersPerSecond: 1 / 60 },
  { value: "m-hr", label: "m/hr", metersPerSecond: 1 / 3600 },
  { value: "mi-s", label: "mi/s", metersPerSecond: 1609.344 },
  { value: "mi-min", label: "mi/min", metersPerSecond: 1609.344 / 60 },
  { value: "mi-h", label: "mi/h (mph)", metersPerSecond: 1609.344 / 3600 },
  { value: "km-s", label: "km/s", metersPerSecond: 1000 },
  { value: "km-min", label: "km/min", metersPerSecond: 1000 / 60 },
  { value: "km-h", label: "km/h (kph)", metersPerSecond: 1000 / 3600 },
  { value: "knots", label: "knots", metersPerSecond: 1852 / 3600 },
];

const MODE_OPTIONS: Array<{ value: CalculationMode; label: string }> = [
  { value: "speed", label: "Solve for Speed" },
  { value: "distance", label: "Solve for Distance" },
  { value: "time", label: "Solve for Time" },
];

const FORMULAS: Record<CalculationMode, string> = {
  speed: "speed = distance / time",
  distance: "distance = speed x time",
  time: "time = distance / speed",
};

const DESKTOP_UNIT_SELECTOR_WIDTH = 180;

export function CalculatorPage() {
  const { mode: themeMode } = useThemeMode();
  const nh = createNewHomeTheme(themeMode);
  const [mode, setMode] = useState<CalculationMode>("speed");
  const [distanceValue, setDistanceValue] = useState("");
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [speedValue, setSpeedValue] = useState("");
  const [speedUnit, setSpeedUnit] = useState("km-h");
  const [timeValue, setTimeValue] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [details, setDetails] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { site, hasRaceCatalog: hasRaceData, loading: siteLoading } = useSiteCatalog();

  const activeFormula = FORMULAS[mode];

  const answerPreview = useMemo(() => {
    if (mode === "distance") return "(answer units)";
    if (mode === "speed") return "(answer units)";
    return "(hh:mm:ss)";
  }, [mode]);

  const clearForm = () => {
    setDistanceValue("");
    setSpeedValue("");
    setTimeValue("");
    setAnswer(null);
    setDetails(null);
    setError(null);
  };

  const resetAnswerState = () => {
    setAnswer(null);
    setDetails(null);
    setError(null);
  };

  const calculate = () => {
    const selectedDistanceUnit = DISTANCE_UNITS.find((unit) => unit.value === distanceUnit);
    const selectedSpeedUnit = SPEED_UNITS.find((unit) => unit.value === speedUnit);

    if (!selectedDistanceUnit || !selectedSpeedUnit) {
      setError("Please choose valid units.");
      setAnswer(null);
      setDetails(null);
      return;
    }

    if (mode === "time") {
      const distance = parsePositiveNumber(distanceValue);
      const speed = parsePositiveNumber(speedValue);

      if (distance == null || speed == null) {
        setError("Enter a positive distance and speed.");
        setAnswer(null);
        setDetails(null);
        return;
      }

      const distanceMeters = distance * selectedDistanceUnit.meters;
      const speedMetersPerSecond = speed * selectedSpeedUnit.metersPerSecond;
      const seconds = distanceMeters / speedMetersPerSecond;

      setError(null);
      setAnswer(`= ${formatDuration(seconds)}`);
      setDetails(`= ${formatDurationLong(seconds)}`);
      return;
    }

    if (mode === "distance") {
      const speed = parsePositiveNumber(speedValue);
      const seconds = parseTimeToSeconds(timeValue);

      if (speed == null || seconds == null) {
        setError("Enter a positive speed and a valid time.");
        setAnswer(null);
        setDetails(null);
        return;
      }

      const speedMetersPerSecond = speed * selectedSpeedUnit.metersPerSecond;
      const distanceMeters = speedMetersPerSecond * seconds;
      const convertedDistance = distanceMeters / selectedDistanceUnit.meters;

      setError(null);
      setAnswer(`= ${formatNumber(convertedDistance)} ${selectedDistanceUnit.label}`);
      setDetails(`= ${formatNumber(distanceMeters / 1000)} km`);
      return;
    }

    const distance = parsePositiveNumber(distanceValue);
    const seconds = parseTimeToSeconds(timeValue);

    if (distance == null || seconds == null) {
      setError("Enter a positive distance and a valid time.");
      setAnswer(null);
      setDetails(null);
      return;
    }

    const distanceMeters = distance * selectedDistanceUnit.meters;
    const speedMetersPerSecond = distanceMeters / seconds;
    const convertedSpeed = speedMetersPerSecond / selectedSpeedUnit.metersPerSecond;
    const pacePerKmSeconds = 1000 / speedMetersPerSecond;

    setError(null);
    setAnswer(`= ${formatNumber(convertedSpeed)} ${selectedSpeedUnit.label}`);
    setDetails(`pace ${formatPace(pacePerKmSeconds)} /km`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: nh.bg,
        color: nh.white,
        fontFamily: nh.sans,
        display: "flex",
        flexDirection: "column",
        "& .MuiTypography-root": { fontFamily: "inherit" },
      }}
    >
      <SeoHead
        title="Runner calculator | speedhare"
        description="Solve for time, speed, or distance directly in your browser."
        canonicalPath="/speed-distance-time-calculator"
      />
      <NewHomeNav activeDistance="all" />

      <Box sx={{ flex: 1, maxWidth: 800, width: "100%", mx: "auto", px: { xs: 2, sm: 3 }, py: 3 }}>
        {siteLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: nh.blue }} />
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 3 },
              borderRadius: 3,
              bgcolor: nh.card,
              border: `1px solid ${nh.border}`,
              color: nh.white,
            }}
          >
            <Stack spacing={2.25}>
              <Box>
                <Typography
                  component="h1"
                  sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", sm: "2rem" }, mb: 0.75 }}
                >
                  Speed Distance Time Calculator
                </Typography>
                <Typography
                  sx={{
                    color: nh.muted,
                    mb: 0.4,
                    fontSize: { xs: "0.9rem", sm: "0.85rem" },
                    lineHeight: 1.45,
                  }}
                >
                  Choose a mode, enter the known values, and calculate the result.
                </Typography>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    px: 1,
                    py: 0.45,
                    borderRadius: 1,
                    border: `1px solid ${nh.blue}`,
                    bgcolor: "rgba(6, 182, 212, 0.12)",
                    color: nh.white,
                    fontFamily: nh.mono,
                    fontSize: { xs: "0.85rem", sm: "0.8rem" },
                    lineHeight: 1.2,
                  }}
                >
                  {activeFormula}
                </Box>
              </Box>

              <Stack spacing={1.5}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm:
                        mode === "time" ? "1fr" : `minmax(0, 1fr) ${DESKTOP_UNIT_SELECTOR_WIDTH}px`,
                    },
                    gap: 1.25,
                    alignItems: "start",
                  }}
                >
                  <TextField
                    select
                    size="small"
                    label="Mode"
                    value={mode}
                    onChange={(event) => {
                      setMode(event.target.value as CalculationMode);
                      clearForm();
                    }}
                    fullWidth
                    sx={{
                      ...fieldSx(nh),
                      width: "100%",
                      minWidth: 0,
                    }}
                  >
                    {MODE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  {mode === "distance" ? (
                    <TextField
                      select
                      size="small"
                      label="Distance unit"
                      value={distanceUnit}
                      onChange={(event) => {
                        setDistanceUnit(event.target.value);
                        resetAnswerState();
                      }}
                      fullWidth
                      sx={{
                        ...fieldSx(nh),
                        display: { xs: "block", sm: "block" },
                        width: "100%",
                        minWidth: 0,
                      }}
                    >
                      {DISTANCE_UNITS.map((unit) => (
                        <MenuItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : null}

                  {mode === "speed" ? (
                    <TextField
                      select
                      size="small"
                      label="Speed unit"
                      value={speedUnit}
                      onChange={(event) => {
                        setSpeedUnit(event.target.value);
                        resetAnswerState();
                      }}
                      fullWidth
                      sx={{
                        ...fieldSx(nh),
                        display: { xs: "block", sm: "block" },
                        width: "100%",
                        minWidth: 0,
                      }}
                    >
                      {SPEED_UNITS.map((unit) => (
                        <MenuItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : null}
                </Box>
              </Stack>

              <Stack spacing={1.5}>
                <Box
                  sx={{
                    display: {
                      xs: mode === "distance" ? "none" : "grid",
                      sm: mode === "distance" ? "none" : "grid",
                    },
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: `minmax(0, 1fr) ${DESKTOP_UNIT_SELECTOR_WIDTH}px`,
                    },
                    gap: 1.25,
                    width: "100%",
                    alignItems: "start",
                  }}
                >
                  <TextField
                    size="small"
                    label="Distance"
                    value={distanceValue}
                    onChange={(event) => {
                      setDistanceValue(event.target.value);
                      resetAnswerState();
                    }}
                    placeholder={mode === "distance" ? answerPreview : "Enter distance"}
                    disabled={mode === "distance"}
                    fullWidth
                    sx={{ ...fieldSx(nh), width: "100%", minWidth: 0 }}
                  />
                  <TextField
                    select
                    size="small"
                    label="Distance unit"
                    value={distanceUnit}
                    onChange={(event) => {
                      setDistanceUnit(event.target.value);
                      resetAnswerState();
                    }}
                    fullWidth
                    sx={{
                      ...fieldSx(nh),
                      width: "100%",
                      minWidth: 0,
                      display: { xs: "block", sm: mode === "distance" ? "none" : "block" },
                    }}
                  >
                    {DISTANCE_UNITS.map((unit) => (
                      <MenuItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box
                  sx={{
                    display: {
                      xs: mode === "speed" ? "none" : "grid",
                      sm: mode === "speed" ? "none" : "grid",
                    },
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: `minmax(0, 1fr) ${DESKTOP_UNIT_SELECTOR_WIDTH}px`,
                    },
                    gap: 1.25,
                    width: "100%",
                    alignItems: "start",
                  }}
                >
                  <TextField
                    size="small"
                    label="Speed"
                    value={speedValue}
                    onChange={(event) => {
                      setSpeedValue(event.target.value);
                      resetAnswerState();
                    }}
                    placeholder={mode === "speed" ? answerPreview : "Enter speed"}
                    disabled={mode === "speed"}
                    fullWidth
                    sx={{ ...fieldSx(nh), width: "100%", minWidth: 0 }}
                  />
                  <TextField
                    select
                    size="small"
                    label="Speed unit"
                    value={speedUnit}
                    onChange={(event) => {
                      setSpeedUnit(event.target.value);
                      resetAnswerState();
                    }}
                    fullWidth
                    sx={{
                      ...fieldSx(nh),
                      width: "100%",
                      minWidth: 0,
                      display: { xs: "block", sm: mode === "speed" ? "none" : "block" },
                    }}
                  >
                    {SPEED_UNITS.map((unit) => (
                      <MenuItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <TextField
                  size="small"
                  label="Time"
                  value={timeValue}
                  onChange={(event) => {
                    setTimeValue(event.target.value);
                    resetAnswerState();
                  }}
                  placeholder={mode === "time" ? answerPreview : "hh:mm:ss, mm:ss, or seconds"}
                  disabled={mode === "time"}
                  fullWidth
                  sx={{
                    ...fieldSx(nh),
                    display: {
                      xs: mode === "time" ? "none" : "block",
                      sm: mode === "time" ? "none" : "block",
                    },
                  }}
                />
              </Stack>

              <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                <Button
                  variant="contained"
                  size="small"
                  onClick={calculate}
                  sx={containedButtonSx(nh)}
                >
                  Calculate
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={clearForm}
                  sx={outlinedButtonSx(nh)}
                >
                  Clear
                </Button>
              </Stack>

              {error ? <Alert severity="error">{error}</Alert> : null}

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  minHeight: 120,
                  bgcolor: "rgba(255,255,255,0.02)",
                  borderColor: nh.border,
                  color: nh.white,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Answer
                </Typography>
                {answer ? (
                  <Stack spacing={1.5}>
                    <Typography variant="h5">{answer}</Typography>
                    {details ? <Typography sx={{ color: nh.muted }}>{details}</Typography> : null}
                  </Stack>
                ) : (
                  <Typography sx={{ color: nh.muted }}>
                    Enter the known values above, then press Calculate.
                  </Typography>
                )}
              </Paper>

              <Typography variant="body2" sx={{ color: nh.muted }}>
                Time input accepts `hh:mm:ss`, `mm:ss`, or raw seconds.
              </Typography>
            </Stack>
          </Paper>
        )}
      </Box>

      {site ? (
        <NewHomeFooter site={site} hasRaceData={hasRaceData} />
      ) : (
        <Box sx={{ py: 3, borderTop: `1px solid ${nh.border}` }} />
      )}
    </Box>
  );
}

function fieldSx(nh: ReturnType<typeof createNewHomeTheme>) {
  return {
    "& .MuiOutlinedInput-root": {
      color: nh.white,
      bgcolor: "rgba(255,255,255,0.03)",
      "& fieldset": { borderColor: nh.border },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.35)" },
      "&.Mui-focused fieldset": { borderColor: nh.blue },
      "&.Mui-disabled": {
        WebkitTextFillColor: nh.muted,
      },
    },
    "& .MuiInputLabel-root": { color: nh.muted },
    "& .MuiInputLabel-root.Mui-focused": { color: nh.blue },
    "& .MuiSvgIcon-root": { color: nh.white },
  };
}

function outlinedButtonSx(nh: ReturnType<typeof createNewHomeTheme>) {
  return {
    borderColor: nh.border,
    color: nh.white,
    "&:hover": {
      borderColor: nh.blue,
      bgcolor: "rgba(57, 189, 255, 0.08)",
    },
  };
}

function containedButtonSx(nh: ReturnType<typeof createNewHomeTheme>) {
  return {
    bgcolor: nh.blue,
    color: "#03131b",
    fontWeight: 700,
    "&:hover": {
      bgcolor: "#5ccfff",
    },
  };
}
