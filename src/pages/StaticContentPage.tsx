import { Box, CircularProgress, Typography } from "@mui/material";
import { useMemo } from "react";
import { SeoHead } from "../components/SeoHead";
import { useSiteCatalog } from "../hooks/useSiteCatalog";
import { NewHomeFooter } from "../new_home/NewHomeFooter";
import { NewHomeNav } from "../new_home/NewHomeNav";
import { createNewHomeTheme } from "../new_home/newHomeTheme";
import { useThemeMode } from "../new_home/themeMode";

interface StaticContentPageProps {
  title: string;
  canonicalPath: string;
  intro?: string;
  sections: ReadonlyArray<{ heading: string; body: ReadonlyArray<string> }>;
}

export function StaticContentPage({
  title,
  canonicalPath,
  intro,
  sections,
}: StaticContentPageProps) {
  const { mode } = useThemeMode();
  const nh = createNewHomeTheme(mode);
  const { site, hasRaceCatalog } = useSiteCatalog();

  const pageDescription = useMemo(() => {
    if (intro) return intro;
    return sections[0]?.body[0] ?? "Information page";
  }, [intro, sections]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: nh.bg,
        color: nh.white,
        fontFamily: nh.sans,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SeoHead
        title={`${title} | speedhare`}
        description={pageDescription}
        canonicalPath={canonicalPath}
      />
      <NewHomeNav activeDistance="all" navContext="all-races" />

      <Box sx={{ flex: 1, maxWidth: 840, width: "100%", mx: "auto", px: { xs: 2, sm: 3 }, py: 4 }}>
        <Typography
          sx={{
            fontFamily: nh.mono,
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            color: nh.blue,
            mb: 0.5,
          }}
        >
          SPEEDHARE
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: nh.sans,
            fontWeight: 800,
            fontSize: { xs: "1.9rem", sm: "2.4rem" },
            mb: 2,
          }}
        >
          {title}
        </Typography>
        {intro ? (
          <Typography sx={{ color: nh.muted, lineHeight: 1.8, mb: 3 }}>{intro}</Typography>
        ) : null}

        {sections.map((section) => (
          <Box key={section.heading} sx={{ mb: 3 }}>
            <Typography
              component="h2"
              sx={{ fontFamily: nh.sans, fontWeight: 700, fontSize: "1.15rem", mb: 1 }}
            >
              {section.heading}
            </Typography>
            {section.body.map((paragraph) => (
              <Typography key={paragraph} sx={{ color: nh.muted, lineHeight: 1.8, mb: 1.2 }}>
                {paragraph}
              </Typography>
            ))}
          </Box>
        ))}
      </Box>

      {site ? (
        <NewHomeFooter site={site} hasRaceData={hasRaceCatalog} />
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={20} sx={{ color: nh.blue }} />
        </Box>
      )}
    </Box>
  );
}
