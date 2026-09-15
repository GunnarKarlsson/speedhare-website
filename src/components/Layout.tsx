import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

export function Layout() {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const submitSearch = () => {
    const trimmed = q.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: "#4a4a4a", color: "#fff" }}>
        <Toolbar
          sx={{
            minHeight: 64,
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
            columnGap: 1,
            py: 0,
          }}
        >
          <Box sx={{ minWidth: 0, display: "flex", alignItems: "center", height: 40 }}>
            <MuiLink
              component={RouterLink}
              to="/"
              underline="none"
              color="inherit"
              sx={{
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                lineHeight: 1,
                height: 40,
                verticalAlign: "middle",
              }}
            >
              <Box
                component="img"
                src="/images/speedhare_logo_150.png"
                alt="speedhare logo"
                sx={{ width: 36, height: 36, display: "block", flexShrink: 0 }}
              />
              <Box component="span" sx={{ display: "block", lineHeight: 1 }}>
                speedhare
              </Box>
            </MuiLink>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", px: 1, width: "100%" }}>
            <TextField
              size="small"
              placeholder={isCompact ? "" : "Search race or runner name"}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              sx={{
                width: "100%",
                maxWidth: 420,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#fff",
                  color: "#222",
                  borderRadius: "999px",
                  "& fieldset": { borderColor: "rgba(0, 0, 0, 0.25)" },
                  "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.45)" },
                  "&.Mui-focused fieldset": { borderColor: "#111" },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(0, 0, 0, 0.45)",
                  opacity: 1,
                },
                "& .MuiSvgIcon-root": { color: "rgba(0, 0, 0, 0.55)" },
              }}
              slotProps={{
                input: {
                  sx: { borderRadius: "999px" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" aria-label="search" onClick={submitSearch}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <Box sx={{ width: 40 }} />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ py: 2, textAlign: "center", color: "text.secondary" }}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap", mb: 0.5 }}>
          <MuiLink
            component={RouterLink}
            to="/about"
            underline="hover"
            color="inherit"
            variant="caption"
          >
            About
          </MuiLink>
          <MuiLink
            component={RouterLink}
            to="/terms"
            underline="hover"
            color="inherit"
            variant="caption"
          >
            T&C
          </MuiLink>
          <MuiLink
            component={RouterLink}
            to="/data-policy"
            underline="hover"
            color="inherit"
            variant="caption"
          >
            Data Policy
          </MuiLink>
        </Box>
        <Typography variant="caption">Site developed by Bahn Labs</Typography>
      </Box>
    </Box>
  );
}
