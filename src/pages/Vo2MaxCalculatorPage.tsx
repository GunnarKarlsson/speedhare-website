import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { SeoHead } from "../components/SeoHead";
import { useSiteCatalog } from "../hooks/useSiteCatalog";
import { HomeFooter } from "../home/HomeFooter";
import { HomeNav } from "../home/HomeNav";
import { createHomeTheme } from "../home/homeTheme";
import { useThemeMode } from "../home/themeMode";

type CalculatorMethod = "cooper" | "race";
type Gender = "male" | "female";
type FitnessCategory = "Poor" | "Fair" | "Average" | "Good" | "Excellent" | "Superior";

type CooperUnit = {
  value: string;
  label: string;
  meters: number;
};

type RaceDistance = {
  value: string;
  label: string;
  meters: number | null;
};

type NormRow = {
  label: string;
  minAge: number;
  maxAge: number | null;
  poorUpper: number;
  fairUpper: number;
  averageUpper: number;
  goodUpper: number;
  excellentUpper: number;
};

type RatingResult = {
  category: FitnessCategory;
  categoryBlurb: string;
  row: NormRow;
};

type CalculationResult = {
  vo2max: number;
  heading: string;
  summary: string;
  formula: string;
  rating: RatingResult | null;
  ratingNote: string;
};

const COOPER_UNITS: CooperUnit[] = [
  { value: "m", label: "Meters", meters: 1 },
  { value: "km", label: "Kilometers", meters: 1000 },
  { value: "mi", label: "Miles", meters: 1609.344 },
];

const RACE_DISTANCES: RaceDistance[] = [
  { value: "1500", label: "1500 m", meters: 1500 },
  { value: "mile", label: "1 mile", meters: 1609.344 },
  { value: "3k", label: "3K", meters: 3000 },
  { value: "5k", label: "5K", meters: 5000 },
  { value: "10k", label: "10K", meters: 10000 },
  { value: "half", label: "Half marathon", meters: 21097.5 },
  { value: "marathon", label: "Marathon", meters: 42195 },
  { value: "custom", label: "Custom distance", meters: null },
];

const FITNESS_NORMS: Record<Gender, NormRow[]> = {
  male: [
    {
      label: "18-29",
      minAge: 18,
      maxAge: 29,
      poorUpper: 35,
      fairUpper: 41,
      averageUpper: 46,
      goodUpper: 51,
      excellentUpper: 60,
    },
    {
      label: "30-39",
      minAge: 30,
      maxAge: 39,
      poorUpper: 33,
      fairUpper: 39,
      averageUpper: 42,
      goodUpper: 48,
      excellentUpper: 56,
    },
    {
      label: "40-49",
      minAge: 40,
      maxAge: 49,
      poorUpper: 31,
      fairUpper: 34,
      averageUpper: 38,
      goodUpper: 42,
      excellentUpper: 51,
    },
    {
      label: "50-59",
      minAge: 50,
      maxAge: 59,
      poorUpper: 28,
      fairUpper: 31,
      averageUpper: 35,
      goodUpper: 38,
      excellentUpper: 45,
    },
    {
      label: "60-69",
      minAge: 60,
      maxAge: 69,
      poorUpper: 25,
      fairUpper: 28,
      averageUpper: 31,
      goodUpper: 35,
      excellentUpper: 41,
    },
    {
      label: "70+",
      minAge: 70,
      maxAge: null,
      poorUpper: 22,
      fairUpper: 25,
      averageUpper: 28,
      goodUpper: 32,
      excellentUpper: 37,
    },
  ],
  female: [
    {
      label: "18-29",
      minAge: 18,
      maxAge: 29,
      poorUpper: 28,
      fairUpper: 32,
      averageUpper: 37,
      goodUpper: 41,
      excellentUpper: 56,
    },
    {
      label: "30-39",
      minAge: 30,
      maxAge: 39,
      poorUpper: 26,
      fairUpper: 30,
      averageUpper: 34,
      goodUpper: 37,
      excellentUpper: 52,
    },
    {
      label: "40-49",
      minAge: 40,
      maxAge: 49,
      poorUpper: 24,
      fairUpper: 27,
      averageUpper: 30,
      goodUpper: 33,
      excellentUpper: 45,
    },
    {
      label: "50-59",
      minAge: 50,
      maxAge: 59,
      poorUpper: 22,
      fairUpper: 24,
      averageUpper: 27,
      goodUpper: 30,
      excellentUpper: 40,
    },
    {
      label: "60-69",
      minAge: 60,
      maxAge: 69,
      poorUpper: 20,
      fairUpper: 22,
      averageUpper: 25,
      goodUpper: 28,
      excellentUpper: 37,
    },
    {
      label: "70+",
      minAge: 70,
      maxAge: null,
      poorUpper: 17,
      fairUpper: 19,
      averageUpper: 22,
      goodUpper: 25,
      excellentUpper: 32,
    },
  ],
};

const CATEGORY_ORDER: FitnessCategory[] = [
  "Poor",
  "Fair",
  "Average",
  "Good",
  "Excellent",
  "Superior",
];

function parsePositiveNumber(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

function parseAge(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 18 || parsed > 120) return null;
  return parsed;
}

function parseTimeToSeconds(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(":").map((part) => part.trim());
  if (parts.length > 3 || parts.some((part) => !/^\d+(\.\d+)?$/.test(part))) {
    return null;
  }

  const values = parts.map(Number);
  if (values.some((part) => !Number.isFinite(part) || part < 0)) {
    return null;
  }

  if (values.length === 1) {
    return values[0] > 0 ? values[0] : null;
  }

  if (values.length === 2) {
    const [minutes, seconds] = values;
    if (seconds >= 60) return null;
    const total = minutes * 60 + seconds;
    return total > 0 ? total : null;
  }

  const [hours, minutes, seconds] = values;
  if (minutes >= 60 || seconds >= 60) return null;
  const total = hours * 3600 + minutes * 60 + seconds;
  return total > 0 ? total : null;
}

function formatNumber(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

function formatDuration(totalSeconds: number) {
  const rounded = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  if (hours === 0) {
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getNormRow(age: number, gender: Gender) {
  return (
    FITNESS_NORMS[gender].find(
      (row) => age >= row.minAge && (row.maxAge == null || age <= row.maxAge),
    ) ?? null
  );
}

function getRating(vo2max: number, age: number, gender: Gender): RatingResult | null {
  const row = getNormRow(age, gender);
  if (!row) return null;

  if (vo2max < row.poorUpper) {
    return { category: "Poor", categoryBlurb: "Below the typical range for this age group.", row };
  }
  if (vo2max <= row.fairUpper) {
    return { category: "Fair", categoryBlurb: "A developing aerobic base with room to grow.", row };
  }
  if (vo2max <= row.averageUpper) {
    return {
      category: "Average",
      categoryBlurb: "Right around the middle of the general-population range.",
      row,
    };
  }
  if (vo2max <= row.goodUpper) {
    return { category: "Good", categoryBlurb: "Stronger than average for this age group.", row };
  }
  if (vo2max <= row.excellentUpper) {
    return { category: "Excellent", categoryBlurb: "Well above average aerobic fitness.", row };
  }
  return {
    category: "Superior",
    categoryBlurb: "An exceptional score relative to the general population.",
    row,
  };
}

function getCategoryRange(category: FitnessCategory, row: NormRow) {
  switch (category) {
    case "Poor":
      return `< ${row.poorUpper}`;
    case "Fair":
      return `${row.poorUpper}-${row.fairUpper}`;
    case "Average":
      return `${row.fairUpper + 1}-${row.averageUpper}`;
    case "Good":
      return `${row.averageUpper + 1}-${row.goodUpper}`;
    case "Excellent":
      return `${row.goodUpper + 1}-${row.excellentUpper}`;
    case "Superior":
      return `> ${row.excellentUpper}`;
  }
}

function getCategoryColor(category: FitnessCategory, nh: ReturnType<typeof createHomeTheme>) {
  switch (category) {
    case "Poor":
      return "#ef4444";
    case "Fair":
      return "#f97316";
    case "Average":
      return "#eab308";
    case "Good":
      return "#22c55e";
    case "Excellent":
      return nh.blue;
    case "Superior":
      return "#a855f7";
  }
}

export function Vo2MaxCalculatorPage() {
  const { mode: themeMode } = useThemeMode();
  const nh = createHomeTheme(themeMode);
  const [method, setMethod] = useState<CalculatorMethod>("cooper");
  const [cooperDistance, setCooperDistance] = useState("");
  const [cooperUnit, setCooperUnit] = useState("km");
  const [raceDistance, setRaceDistance] = useState("5k");
  const [customRaceDistance, setCustomRaceDistance] = useState("");
  const [raceTime, setRaceTime] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { site, hasRaceCatalog: hasRaceData, loading: siteLoading } = useSiteCatalog();

  const selectedRaceDistance = useMemo(
    () => RACE_DISTANCES.find((option) => option.value === raceDistance) ?? RACE_DISTANCES[3],
    [raceDistance],
  );

  const resetOutput = () => {
    setResult(null);
    setError(null);
  };

  const clearForm = () => {
    setCooperDistance("");
    setCooperUnit("km");
    setRaceDistance("5k");
    setCustomRaceDistance("");
    setRaceTime("");
    setAge("");
    setGender("");
    setResult(null);
    setError(null);
  };

  const calculate = () => {
    const ageValue = age.trim() ? parseAge(age) : null;
    if (age.trim() && ageValue == null) {
      setError("Age must be a whole number between 18 and 120 to use the comparison tables.");
      setResult(null);
      return;
    }

    let vo2max: number;
    let heading: string;
    let summary: string;
    let formula: string;

    if (method === "cooper") {
      const distanceValue = parsePositiveNumber(cooperDistance);
      const unit = COOPER_UNITS.find((option) => option.value === cooperUnit);

      if (distanceValue == null || !unit) {
        setError("Enter a valid 12-minute distance and choose a unit.");
        setResult(null);
        return;
      }

      const distanceMeters = distanceValue * unit.meters;
      vo2max = (distanceMeters - 504.9) / 44.73;
      heading = "Cooper test estimate";
      summary = `Based on ${formatNumber(distanceMeters / 1000, 2)} km covered in 12 minutes.`;
      formula = "Formula: Cooper Test Formula";
    } else {
      const timeSeconds = parseTimeToSeconds(raceTime);
      if (timeSeconds == null) {
        setError("Enter a valid race time using hh:mm:ss, mm:ss, or seconds.");
        setResult(null);
        return;
      }

      let distanceMeters = selectedRaceDistance.meters;
      if (selectedRaceDistance.value === "custom") {
        const customMeters = parsePositiveNumber(customRaceDistance);
        if (customMeters == null) {
          setError("Enter a valid custom race distance in meters.");
          setResult(null);
          return;
        }
        if (customMeters < 1500 || customMeters > 42195) {
          setError(
            "For the Daniels-style race estimate, use a distance between 1500 m and marathon.",
          );
          setResult(null);
          return;
        }
        distanceMeters = customMeters;
      }

      if (!distanceMeters) {
        setError("Choose a valid race distance.");
        setResult(null);
        return;
      }

      const timeMinutes = timeSeconds / 60;
      const velocityMetersPerMinute = distanceMeters / timeMinutes;
      const oxygenCost =
        -4.6 +
        0.182258 * velocityMetersPerMinute +
        0.000104 * velocityMetersPerMinute * velocityMetersPerMinute;
      const vo2Fraction =
        0.8 +
        0.1894393 * Math.exp(-0.012778 * timeMinutes) +
        0.2989558 * Math.exp(-0.1932605 * timeMinutes);

      vo2max = oxygenCost / vo2Fraction;
      heading = "Race-based Daniels estimate";
      summary = `Based on ${selectedRaceDistance.value === "custom" ? `${formatNumber(distanceMeters, 0)} m` : selectedRaceDistance.label} in ${formatDuration(timeSeconds)}.`;
      formula = "Formula: Daniels & Gilbert oxygen cost plus VO2 utilization equations.";
    }

    if (!Number.isFinite(vo2max) || vo2max <= 0) {
      setError(
        "That combination of inputs produced an invalid estimate. Please double-check the values.",
      );
      setResult(null);
      return;
    }

    const rating = ageValue != null && gender ? getRating(vo2max, ageValue, gender) : null;
    const ratingNote =
      ageValue != null && gender
        ? "Age/gender comparison uses general-population VO2 max norms and does not modify the raw estimate."
        : "Add both age and gender to compare your score with general-population norms.";

    setError(null);
    setResult({
      vo2max,
      heading,
      summary,
      formula,
      rating,
      ratingNote,
    });
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
        title="VO2 max calculator | speedhare"
        description="Estimate VO2 max from a 12-minute Cooper test or a recent race result, with optional age and gender comparison."
        canonicalPath="/vo2max-calculator"
      />
      <HomeNav activeDistance="all" />

      <Box sx={{ flex: 1, maxWidth: 920, width: "100%", mx: "auto", px: { xs: 2, sm: 3 }, py: 3 }}>
        {siteLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: nh.blue }} />
          </Box>
        ) : (
          <Stack spacing={2.5}>
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
                    sx={{ fontWeight: 800, fontSize: { xs: "1.65rem", sm: "2.1rem" }, mb: 0.75 }}
                  >
                    VO2 Max Calculator
                  </Typography>
                  <Typography
                    sx={{
                      color: nh.muted,
                      fontSize: { xs: "0.93rem", sm: "0.9rem" },
                      lineHeight: 1.6,
                    }}
                  >
                    Estimate aerobic fitness from either a 12-minute Cooper test or a recent race
                    result. Add age and gender to compare your score with general-population norms.
                  </Typography>
                </Box>

                <Box sx={{ borderBottom: `1px solid ${nh.border}` }}>
                  <Tabs
                    value={method}
                    onChange={(_, nextValue: CalculatorMethod) => {
                      setMethod(nextValue);
                      resetOutput();
                    }}
                    sx={{
                      "& .MuiTab-root": {
                        color: nh.muted,
                        textTransform: "none",
                        minHeight: 44,
                        fontWeight: 600,
                      },
                      "& .Mui-selected": { color: nh.white },
                      "& .MuiTabs-indicator": { backgroundColor: nh.blue },
                    }}
                  >
                    <Tab value="cooper" label="Cooper 12-minute test" />
                    <Tab value="race" label="Recent race result" />
                  </Tabs>
                </Box>

                {method === "cooper" ? (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) 180px" },
                      gap: 1.25,
                    }}
                  >
                    <TextField
                      size="small"
                      label="Distance covered in 12 minutes"
                      value={cooperDistance}
                      onChange={(event) => {
                        setCooperDistance(event.target.value);
                        resetOutput();
                      }}
                      placeholder="e.g. 2.8"
                      fullWidth
                      sx={fieldSx(nh)}
                    />
                    <TextField
                      select
                      size="small"
                      label="Unit"
                      value={cooperUnit}
                      onChange={(event) => {
                        setCooperUnit(event.target.value);
                        resetOutput();
                      }}
                      fullWidth
                      sx={fieldSx(nh)}
                    >
                      {COOPER_UNITS.map((unit) => (
                        <MenuItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                ) : (
                  <Stack spacing={1.25}>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) minmax(0, 1fr)" },
                        gap: 1.25,
                      }}
                    >
                      <TextField
                        select
                        size="small"
                        label="Race distance"
                        value={raceDistance}
                        onChange={(event) => {
                          setRaceDistance(event.target.value);
                          resetOutput();
                        }}
                        fullWidth
                        sx={fieldSx(nh)}
                      >
                        {RACE_DISTANCES.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        size="small"
                        label="Race time"
                        value={raceTime}
                        onChange={(event) => {
                          setRaceTime(event.target.value);
                          resetOutput();
                        }}
                        placeholder="hh:mm:ss or mm:ss"
                        fullWidth
                        sx={fieldSx(nh)}
                      />
                    </Box>
                    {raceDistance === "custom" ? (
                      <TextField
                        size="small"
                        label="Custom distance (meters)"
                        value={customRaceDistance}
                        onChange={(event) => {
                          setCustomRaceDistance(event.target.value);
                          resetOutput();
                        }}
                        placeholder="1500 to 42195"
                        fullWidth
                        sx={fieldSx(nh)}
                      />
                    ) : null}
                  </Stack>
                )}

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) 180px" },
                    gap: 1.25,
                  }}
                >
                  <TextField
                    size="small"
                    label="Age (optional)"
                    value={age}
                    onChange={(event) => {
                      setAge(event.target.value);
                      resetOutput();
                    }}
                    placeholder="18+"
                    fullWidth
                    sx={fieldSx(nh)}
                  />
                  <TextField
                    select
                    size="small"
                    label="Gender (optional)"
                    value={gender}
                    onChange={(event) => {
                      setGender(event.target.value as Gender | "");
                      resetOutput();
                    }}
                    fullWidth
                    sx={fieldSx(nh)}
                  >
                    <MenuItem value="">Not selected</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </TextField>
                </Box>

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
              </Stack>
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: { xs: 1.5, sm: 2.25 },
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.02)",
                borderColor: nh.border,
                color: nh.white,
              }}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.75 }}>
                    Your estimate
                  </Typography>
                  {result ? (
                    <Stack spacing={0.8}>
                      <Typography sx={{ color: nh.muted, fontSize: "0.9rem" }}>
                        {result.heading}
                      </Typography>
                      <Typography sx={{ fontWeight: 800, fontSize: { xs: "2rem", sm: "2.4rem" } }}>
                        {formatNumber(result.vo2max, 1)} ml/kg/min
                      </Typography>
                      <Typography sx={{ color: nh.white }}>{result.summary}</Typography>
                      <Typography sx={{ color: nh.muted, fontSize: "0.9rem" }}>
                        {result.formula}
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: nh.muted }}>
                      Enter your test or race details above, then press Calculate.
                    </Typography>
                  )}
                </Box>

                {result?.rating ? (
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${nh.border}`,
                      bgcolor: "rgba(255,255,255,0.02)",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                      Age and gender comparison
                    </Typography>
                    <Stack spacing={1.25}>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 1,
                          px: 1.1,
                          py: 0.55,
                          borderRadius: 999,
                          width: "fit-content",
                          bgcolor: `${getCategoryColor(result.rating.category, nh)}1a`,
                          border: `1px solid ${getCategoryColor(result.rating.category, nh)}`,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: getCategoryColor(result.rating.category, nh),
                          }}
                        />
                        <Typography sx={{ fontWeight: 700 }}>{result.rating.category}</Typography>
                      </Box>
                      <Typography sx={{ color: nh.white }}>
                        {result.rating.categoryBlurb} Compared with {gender} norms for ages{" "}
                        {result.rating.row.label}.
                      </Typography>
                      <Typography sx={{ color: nh.muted, fontSize: "0.9rem" }}>
                        {result.ratingNote}
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(6, minmax(0, 1fr))" },
                          gap: 1,
                        }}
                      >
                        {CATEGORY_ORDER.map((category) => {
                          const isActive = category === result.rating?.category;
                          return (
                            <Box
                              key={category}
                              sx={{
                                p: 1,
                                borderRadius: 1.5,
                                border: `1px solid ${isActive ? getCategoryColor(category, nh) : nh.border}`,
                                bgcolor: isActive
                                  ? `${getCategoryColor(category, nh)}14`
                                  : "transparent",
                              }}
                            >
                              <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", mb: 0.35 }}>
                                {category}
                              </Typography>
                              <Typography sx={{ color: nh.muted, fontSize: "0.82rem" }}>
                                {result.rating
                                  ? getCategoryRange(category, result.rating.row)
                                  : null}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Stack>
                  </Box>
                ) : null}
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2.25 },
                borderRadius: 3,
                bgcolor: nh.card,
                border: `1px solid ${nh.border}`,
              }}
            >
              <Stack spacing={1.25}>
                <Typography sx={{ fontWeight: 700 }}>How to use it</Typography>
                <Typography sx={{ color: nh.muted, lineHeight: 1.7 }}>
                  Use the Cooper option if you have a 12-minute field test. Use the race option for
                  a recent result between 1500 m and marathon. The race calculator applies
                  Daniels-style equations that are commonly used for VDOT-style performance
                  estimates.
                </Typography>
                <Typography sx={{ color: nh.muted, lineHeight: 1.7 }}>
                  Age and gender do not change the underlying VO2 max estimate. They only provide a
                  general-population comparison band so the raw number is easier to interpret.
                </Typography>
                <Typography sx={{ color: nh.muted, lineHeight: 1.7 }}>
                  This is an estimate, not a lab measurement. For training planning, you can also
                  use the{" "}
                  <Link
                    component={RouterLink}
                    to="/speed-distance-time-calculator"
                    sx={{ color: nh.blue }}
                  >
                    speed, distance, and time calculator
                  </Link>
                  .
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        )}
      </Box>

      {site ? (
        <HomeFooter site={site} hasRaceData={hasRaceData} />
      ) : (
        <Box sx={{ py: 3, borderTop: `1px solid ${nh.border}` }} />
      )}
    </Box>
  );
}

function fieldSx(nh: ReturnType<typeof createHomeTheme>) {
  return {
    "& .MuiOutlinedInput-root": {
      color: nh.white,
      bgcolor: "rgba(255,255,255,0.03)",
      "& fieldset": { borderColor: nh.border },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.35)" },
      "&.Mui-focused fieldset": { borderColor: nh.blue },
    },
    "& .MuiInputLabel-root": { color: nh.muted },
    "& .MuiInputLabel-root.Mui-focused": { color: nh.blue },
    "& .MuiSvgIcon-root": { color: nh.white },
  };
}

function outlinedButtonSx(nh: ReturnType<typeof createHomeTheme>) {
  return {
    borderColor: nh.border,
    color: nh.white,
    "&:hover": {
      borderColor: nh.blue,
      bgcolor: "rgba(57, 189, 255, 0.08)",
    },
  };
}

function containedButtonSx(nh: ReturnType<typeof createHomeTheme>) {
  return {
    bgcolor: nh.blue,
    color: "#03131b",
    fontWeight: 700,
    "&:hover": {
      bgcolor: "#5ccfff",
    },
  };
}
