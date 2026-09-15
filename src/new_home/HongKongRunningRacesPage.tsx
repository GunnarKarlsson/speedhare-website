import { Box, CircularProgress, Link, Typography } from "@mui/material";
import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { SeoHead } from "../components/SeoHead";
import { useSiteCatalog } from "../hooks/useSiteCatalog";
import { racePath } from "../racePaths";
import { NewHomeFooter } from "./NewHomeFooter";
import { NewHomeNav } from "./NewHomeNav";
import { createNewHomeTheme } from "./newHomeTheme";
import { useThemeMode } from "./themeMode";

interface ArchiveLink {
  label: string;
  slug: string;
}

interface FeaturedRace {
  name: string;
  distanceLabel: string;
  typicalTiming: string;
  area: string;
  description: readonly string[];
  bestFor: string;
  editionLinks: readonly ArchiveLink[];
}

interface GuideSection {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  browsePath: string;
  browseLabel: string;
  races: readonly FeaturedRace[];
}

interface PlannerRow {
  label: string;
  distance: string;
  timing: string;
  why: string;
  slug: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const CANONICAL_PATH = "/hong-kong-10k-5k-half-marathon-race";

const PAGE_TITLE = "Hong Kong 10K, 5K & Half Marathon Races 2026 | speedhare";

const PAGE_DESCRIPTION =
  "Complete guide to annual Hong Kong running races with 5K, 10K, and half marathon events, plus past Speedhare results and analytics links.";

const GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: "hong-kong-5k-races",
    eyebrow: "5K",
    title: "5K Races in Hong Kong",
    intro:
      "Hong Kong 5K races are ideal for newer runners, tune-up efforts, and runners who want a shorter event with strong local participation. Speedhare currently tracks selective 5K archives and will keep expanding this section as more recurring events are added.",
    browsePath: "/all-races?distance=5k",
    browseLabel: "Browse all 5K result archives",
    races: [
      {
        name: "CR Longdation Cross Bay Run Carnival 5K",
        distanceLabel: "5K",
        typicalTiming: "March",
        area: "Victoria Harbour corridor",
        description: [
          "This is one of the cleaner Hong Kong 5K options for runners who want a straightforward road effort with a big-event feel. It works well for beginners chasing a first timed finish and for faster runners looking for a controlled speed session.",
          "The Speedhare archive gives you a direct way to compare your result against the field and use the page as a benchmark before stepping up to a 10K later in the season.",
        ],
        bestFor:
          "First 5K finishes, short speed checks, and runners building toward longer road races.",
        editionLinks: [
          {
            label: "View 2026 results and analytics",
            slug: "cr-longdation-cross-bay-run-carnival-2026-5k-race-hong-kong",
          },
        ],
      },
    ],
  },
  {
    id: "hong-kong-10k-races",
    eyebrow: "10K",
    title: "10K Races in Hong Kong",
    intro:
      "For runners searching for Hong Kong 10K races, this is where most of the strongest recurring road events sit. The mix ranges from championship-style city races to friendlier local fixtures, making 10K one of the easiest distances to race often in Hong Kong.",
    browsePath: "/all-races?distance=10k",
    browseLabel: "Browse all 10K result archives",
    races: [
      {
        name: "Sun Hung Kai Properties Hong Kong 10K Championships",
        distanceLabel: "10K",
        typicalTiming: "October",
        area: "City road course",
        description: [
          "One of the clearest anchor events for runners searching terms like Hong Kong 10K or HK 10K race. The championship framing and consistently deep fields make it useful for both serious pacing targets and year-on-year comparisons.",
          "Speedhare already has multiple editions of this race family, so it is one of the best archives for comparing how the event evolves across seasons.",
        ],
        bestFor:
          "Competitive runners, club athletes, and anyone who wants a strong benchmark 10K field.",
        editionLinks: [
          {
            label: "2025 results",
            slug: "sun-hung-kai-properties-hong-kong-10k-championships-2025-race",
          },
          {
            label: "2024 results",
            slug: "sun-hung-kai-properties-hong-kong-10k-championships-2024-race",
          },
          {
            label: "2023 results",
            slug: "sun-hung-kai-properties-hong-kong-10k-championships-2023-race",
          },
          {
            label: "2022 archive",
            slug: "sun-hung-kai-properties-hong-kong-10k-championships-2022-2023-race",
          },
          {
            label: "2021 archive",
            slug: "sun-hung-kai-properties-hong-kong-10k-championships-2021-race",
          },
        ],
      },
      {
        name: "Tai Po 10K",
        distanceLabel: "10K",
        typicalTiming: "November",
        area: "Tai Po",
        description: [
          "Tai Po 10K gives runners another useful late-year Hong Kong 10K option outside the biggest city-centre race brands. It is a practical choice for runners who want a goal race after the autumn training block.",
          "Because Speedhare stores the full result page, you can check pacing context and placement against the wider field instead of relying on a flat PDF result list.",
        ],
        bestFor:
          "Local runners targeting a solid late-season 10K and anyone wanting another benchmark after the October races.",
        editionLinks: [
          {
            label: "View 2025 results and analytics",
            slug: "tai-po-10k-2025-race-hong-kong",
          },
        ],
      },
      {
        name: "Kai Tak Run 10K",
        distanceLabel: "10K",
        typicalTiming: "March",
        area: "Kai Tak",
        description: [
          "Kai Tak continues to emerge as a recognizable road-racing area, and this 10K gives runners an early-season target before the hotter months. It fits well for athletes returning from winter training or sharpening for spring events.",
          "The archive page on Speedhare makes it easy to see how deep the field was and whether your finish time placed you where you expected.",
        ],
        bestFor: "Early-season 10K targets and runners who like newer urban race venues.",
        editionLinks: [
          {
            label: "View 2026 results and analytics",
            slug: "kai-tak-run-2026-10k-race-hong-kong",
          },
        ],
      },
      {
        name: "Mizuno Hong Kong Running Festival 10K",
        distanceLabel: "10K",
        typicalTiming: "December",
        area: "Hong Kong",
        description: [
          "The Mizuno Running Festival adds a late-December 10K option when many runners want one more hard effort before year end. It is a helpful race for testing holiday fitness and closing the year with a measurable result.",
          "With the Speedhare report, runners can compare percentile cutoffs and typical finishing bands instead of only checking their single finish time.",
        ],
        bestFor:
          "Year-end fitness checks and runners who want a fast 10K target near the holidays.",
        editionLinks: [
          {
            label: "View 2023 results and analytics",
            slug: "mizuno-hong-kong-running-festival-2023-race",
          },
        ],
      },
      {
        name: "CR Longdation Cross Bay Run Carnival 10K",
        distanceLabel: "10K",
        typicalTiming: "March",
        area: "Harbour crossing route",
        description: [
          "The Longdation 10K is useful for runners looking for a big-community road race with enough scale to make ranking and pacing comparisons meaningful. It sits early in the calendar and can act as either a primary goal race or a rust-buster.",
          "Because it shares a brand family with the 5K event, it is also a natural step up for runners progressing from shorter road distances.",
        ],
        bestFor: "Runners moving up from 5K and anyone wanting a large early-season 10K.",
        editionLinks: [
          {
            label: "View 2026 results and analytics",
            slug: "cr-longdation-cross-bay-run-carnival-2026-10k-race-hong-kong",
          },
        ],
      },
      {
        name: "Panasonic Pacers Charity Easter Run 10K",
        distanceLabel: "10K",
        typicalTiming: "April",
        area: "Hong Kong",
        description: [
          "This Easter-timed 10K gives runners another seasonal option when building rhythm through spring. It is especially useful for people who prefer a community race atmosphere instead of a pure championship focus.",
          "The Speedhare archive provides a stable reference point for anyone comparing race-day execution from one spring block to the next.",
        ],
        bestFor:
          "Spring racing, club runners, and athletes who want another data point before summer.",
        editionLinks: [
          {
            label: "View 2024 results and analytics",
            slug: "panasonic-pacers-charity-easter-run-2024-10k-race-hong-kong",
          },
        ],
      },
      {
        name: "Hong Kong Island 10K City Race",
        distanceLabel: "10K",
        typicalTiming: "January",
        area: "Hong Kong Island",
        description: [
          "This city race is a useful reference for runners who want a distinctly urban Hong Kong 10K experience. It also gives historical context to how local 10K racing looked before newer venues and event brands appeared.",
          "Older archives like this are especially helpful when you want to compare race density and finishing standards across different eras of Hong Kong road racing.",
        ],
        bestFor:
          "Runners who enjoy urban courses and anyone exploring older Hong Kong 10K archives.",
        editionLinks: [
          {
            label: "View 2019 results and analytics",
            slug: "hong-kong-island-10k-city-race-2019",
          },
        ],
      },
      {
        name: "Mizuno Shek Mun 10K Race",
        distanceLabel: "10K",
        typicalTiming: "Autumn",
        area: "Shek Mun",
        description: [
          "The Shek Mun 10K archive is valuable because it adds historical depth to the Hong Kong 10K landscape on Speedhare. For runners researching long-running local events, it helps show how different race families have contributed to the current scene.",
          "Even as an older result set, it remains useful for context, comparison, and discovering race formats that shaped later Hong Kong 10K calendars.",
        ],
        bestFor:
          "Archive research and runners who want a wider view of longstanding local 10K events.",
        editionLinks: [
          {
            label: "View 2018 results and analytics",
            slug: "12th-mizuno-shek-mun-10k-race-hong-kong",
          },
        ],
      },
    ],
  },
  {
    id: "hong-kong-half-marathon-races",
    eyebrow: "HALF MARATHON",
    title: "Half Marathon Races in Hong Kong",
    intro:
      "If you are searching for a Hong Kong half marathon, these are the recurring race families already covered on Speedhare. They include stronger championship fields, local late-year target races, and archives that help runners compare training cycles across multiple seasons.",
    browsePath: "/all-races?distance=half",
    browseLabel: "Browse all half marathon result archives",
    races: [
      {
        name: "ASICS Hong Kong Half Marathon Championships",
        distanceLabel: "Half Marathon",
        typicalTiming: "December",
        area: "Hong Kong",
        description: [
          "This is one of the most important references for runners looking up Hong Kong half marathon races. It combines a recognisable brand with a serious race feel, making it a useful target for stronger club runners and experienced amateurs.",
          "Speedhare has multiple ASICS half marathon archives, which makes this race family especially strong for comparing performance over time.",
        ],
        bestFor:
          "Competitive half marathon runners and athletes tracking year-on-year improvements.",
        editionLinks: [
          {
            label: "2025 championships",
            slug: "asics-hong-kong-half-marathon-championships-2025-race",
          },
          {
            label: "2022 challenge race",
            slug: "asics-hong-kong-half-marathon-challenge-2022-race",
          },
          {
            label: "2022 non-challenge race",
            slug: "asics-hong-kong-half-marathon-non-challenge-2022-race",
          },
        ],
      },
      {
        name: "Tai Po Half Marathon",
        distanceLabel: "Half Marathon",
        typicalTiming: "November",
        area: "Tai Po",
        description: [
          "Tai Po Half Marathon gives runners a practical late-autumn half marathon target in Hong Kong. It works well for athletes who want a standalone goal race without waiting for a major winter marathon weekend.",
          "The Speedhare race page is useful for checking percentile cutoffs and seeing how your finish time compares with a broad range of local runners.",
        ],
        bestFor:
          "Late-season half marathon goals and runners building toward a full marathon later on.",
        editionLinks: [
          {
            label: "View 2025 results and analytics",
            slug: "tai-po-half-marathon-2025-race-hong-kong",
          },
        ],
      },
      {
        name: "Mizuno Hong Kong Half Marathon Championships",
        distanceLabel: "Half Marathon",
        typicalTiming: "January to spring",
        area: "Hong Kong",
        description: [
          "The Mizuno half marathon archives help round out the historical side of Hong Kong half marathon racing on Speedhare. They are useful for runners who want more than the newest result pages and prefer to compare race fields across different years.",
          "Because multiple Mizuno editions are already archived, this is one of the better race families for historical comparisons.",
        ],
        bestFor:
          "Historical comparisons and runners who want deeper Hong Kong half marathon archive coverage.",
        editionLinks: [
          {
            label: "2023 results",
            slug: "mizuno-hong-kong-half-marathon-championships-2023-race",
          },
          {
            label: "2020 results",
            slug: "the-27th-mizuno-hong-kong-half-marathon-championships-race",
          },
        ],
      },
    ],
  },
];

const PLANNER_ROWS: readonly PlannerRow[] = [
  {
    label: "Best short race for newer runners",
    distance: "5K",
    timing: "March",
    why: "A simple way to get a first official road-race result and compare yourself against the field.",
    slug: "cr-longdation-cross-bay-run-carnival-2026-5k-race-hong-kong",
  },
  {
    label: "Deepest recurring 10K archive on Speedhare",
    distance: "10K",
    timing: "October",
    why: "Multiple championship editions are already archived, which makes year-on-year comparisons much easier.",
    slug: "sun-hung-kai-properties-hong-kong-10k-championships-2025-race",
  },
  {
    label: "Late-season 10K target",
    distance: "10K",
    timing: "November",
    why: "Useful if you want another benchmark after the October 10K race period.",
    slug: "tai-po-10k-2025-race-hong-kong",
  },
  {
    label: "Early-season urban 10K",
    distance: "10K",
    timing: "March",
    why: "A good checkpoint after winter training and before the hottest part of the year.",
    slug: "kai-tak-run-2026-10k-race-hong-kong",
  },
  {
    label: "Best current half marathon benchmark",
    distance: "Half Marathon",
    timing: "December",
    why: "Recognisable brand, solid field depth, and multiple archived editions for comparison.",
    slug: "asics-hong-kong-half-marathon-championships-2025-race",
  },
  {
    label: "Late-year half marathon option",
    distance: "Half Marathon",
    timing: "November",
    why: "A practical standalone target if you want a half marathon before the winter peak.",
    slug: "tai-po-half-marathon-2025-race-hong-kong",
  },
];

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "What are the main Hong Kong running races on Speedhare?",
    answer:
      "This page currently highlights recurring 5K, 10K, and half marathon race families already archived on Speedhare, including SHKP Hong Kong 10K Championships, Tai Po races, ASICS Hong Kong Half Marathon Championships, and other local events.",
  },
  {
    question: "Where can I find Hong Kong 10K race results?",
    answer:
      "Use the 10K section on this page or browse the full 10K archive on Speedhare. Each featured race card links directly to past result pages with rankings and analytics.",
  },
  {
    question: "Does Speedhare include official organiser links for Hong Kong races?",
    answer:
      "Not on this page yet. This guide currently focuses on internal Speedhare race result pages so runners can stay on-site and compare archived results quickly.",
  },
  {
    question: "How often is this Hong Kong race guide updated?",
    answer:
      "The guide is designed as an evergreen page and can be updated whenever new race archives are added, while keeping the same SEO-friendly URL.",
  },
];

function smallCapsLinkSx(color: string) {
  return {
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textDecoration: "none",
    color,
    "&:hover": { textDecoration: "underline" },
  } as const;
}

export function HongKongRunningRacesPage() {
  const { mode } = useThemeMode();
  const nh = createNewHomeTheme(mode);
  const { site, hasRaceCatalog } = useSiteCatalog();

  const raceFamilyCount = useMemo(
    () => GUIDE_SECTIONS.reduce((sum, section) => sum + section.races.length, 0),
    [],
  );
  const archiveLinkCount = useMemo(
    () =>
      GUIDE_SECTIONS.reduce(
        (sum, section) =>
          sum +
          section.races.reduce((sectionSum, race) => sectionSum + race.editionLinks.length, 0),
        0,
      ),
    [],
  );

  const schemaData = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://speedhare.io";
    const pageUrl = `${baseUrl}${CANONICAL_PATH}`;
    const listItems = GUIDE_SECTIONS.flatMap((section) => section.races).map((race, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: race.name,
      url: `${baseUrl}${racePath(race.editionLinks[0].slug)}`,
    }));

    return [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        url: pageUrl,
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Hong Kong running races on Speedhare",
        itemListElement: listItems,
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ];
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: nh.bg,
        color: nh.white,
        fontFamily: nh.sans,
        "& .MuiTypography-root": { fontFamily: "inherit" },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SeoHead
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        canonicalPath={CANONICAL_PATH}
        keywords={[
          "Hong Kong 10K",
          "Hong Kong 5K",
          "Hong Kong half marathon",
          "HK running races",
          "Hong Kong running races 2026",
          "HK 10K race",
        ]}
        jsonLd={schemaData}
      />
      <NewHomeNav activeDistance="all" navContext="all-races" />

      <Box
        sx={{
          flex: 1,
          maxWidth: 1080,
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center", mb: 2 }}>
          <Typography
            sx={{
              fontFamily: nh.mono,
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              color: nh.blue,
            }}
          >
            HONG KONG RACE GUIDE
          </Typography>
          <Box
            sx={{
              px: 1.1,
              py: 0.45,
              borderRadius: 999,
              border: `1px solid ${nh.blueBadgeBorder}`,
              bgcolor: nh.blueBadgeBg,
            }}
          >
            <Typography
              sx={{
                fontFamily: nh.mono,
                fontSize: "0.68rem",
                letterSpacing: "0.08em",
                color: nh.blue,
              }}
            >
              UPDATED FOR 2026
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Link component={RouterLink} to="/" sx={smallCapsLinkSx(nh.muted)}>
            HOME
          </Link>
          <Typography sx={{ fontFamily: nh.mono, fontSize: "0.72rem", color: nh.faint }}>
            /
          </Typography>
          <Link component={RouterLink} to="/all-races" sx={smallCapsLinkSx(nh.muted)}>
            ALL RACES
          </Link>
          <Typography sx={{ fontFamily: nh.mono, fontSize: "0.72rem", color: nh.faint }}>
            /
          </Typography>
          <Typography sx={{ fontFamily: nh.mono, fontSize: "0.72rem", color: nh.white }}>
            HONG KONG RUNNING RACES
          </Typography>
        </Box>

        <Typography
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2.1rem", sm: "3rem" },
            lineHeight: 1.08,
            maxWidth: 780,
            mb: 2,
          }}
        >
          Hong Kong Running Races: 5K, 10K and Half Marathon Events
        </Typography>

        <Typography sx={{ color: nh.muted, lineHeight: 1.85, maxWidth: 820, mb: 1.5 }}>
          Looking for the best Hong Kong 10K, 5K, and half marathon races? This guide brings
          together the recurring road-race families already archived on Speedhare so runners can
          compare events, understand the typical time of year they happen, and jump straight into
          past results and analytics.
        </Typography>
        <Typography sx={{ color: nh.muted, lineHeight: 1.85, maxWidth: 820, mb: 3 }}>
          It is designed as an evergreen Hong Kong race hub with an SEO-friendly URL, clear
          distance-based sections, and internal result links only. Official organiser links can be
          added later, but for now the focus stays on Speedhare&apos;s own race archives and
          performance data.
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25, mb: 4 }}>
          {GUIDE_SECTIONS.map((section) => (
            <Link
              key={section.id}
              href={`#${section.id}`}
              sx={{
                px: 1.5,
                py: 0.9,
                borderRadius: 999,
                border: `1px solid ${nh.border}`,
                bgcolor: nh.card,
                color: nh.white,
                textDecoration: "none",
                fontFamily: nh.mono,
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                "&:hover": { borderColor: nh.blue, color: nh.blue },
              }}
            >
              {section.title}
            </Link>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
            mb: 4,
          }}
        >
          {[
            { label: "DISTANCES", value: "5K / 10K / HALF" },
            { label: "RACE FAMILIES", value: String(raceFamilyCount) },
            { label: "ARCHIVE LINKS", value: String(archiveLinkCount) },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{
                bgcolor: nh.card,
                border: `1px solid ${nh.border}`,
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography
                sx={{
                  fontFamily: nh.mono,
                  fontSize: "0.68rem",
                  color: nh.blue,
                  letterSpacing: "0.12em",
                  mb: 0.75,
                }}
              >
                {item.label}
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.05rem", sm: "1.2rem" } }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography
            component="h2"
            sx={{ fontWeight: 800, fontSize: { xs: "1.35rem", sm: "1.7rem" }, mb: 2 }}
          >
            Quick Planner
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            {PLANNER_ROWS.map((row) => (
              <Box
                key={row.label}
                sx={{
                  bgcolor: nh.card,
                  border: `1px solid ${nh.border}`,
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: nh.mono,
                    fontSize: "0.68rem",
                    color: nh.blue,
                    letterSpacing: "0.1em",
                    mb: 0.75,
                  }}
                >
                  {row.distance} {"//"} {row.timing}
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "1.02rem", mb: 1 }}>
                  {row.label}
                </Typography>
                <Typography sx={{ color: nh.muted, lineHeight: 1.75, mb: 1.5 }}>
                  {row.why}
                </Typography>
                <Link component={RouterLink} to={racePath(row.slug)} sx={smallCapsLinkSx(nh.blue)}>
                  VIEW RELATED ARCHIVE
                </Link>
              </Box>
            ))}
          </Box>
        </Box>

        {GUIDE_SECTIONS.map((section) => (
          <Box key={section.id} id={section.id} sx={{ scrollMarginTop: 96, mb: 5 }}>
            <Typography
              sx={{
                fontFamily: nh.mono,
                fontSize: "0.72rem",
                color: nh.blue,
                letterSpacing: "0.14em",
                mb: 0.75,
              }}
            >
              {section.eyebrow}
            </Typography>
            <Typography
              component="h2"
              sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", sm: "1.95rem" }, mb: 1.25 }}
            >
              {section.title}
            </Typography>
            <Typography sx={{ color: nh.muted, lineHeight: 1.85, maxWidth: 860, mb: 2 }}>
              {section.intro}
            </Typography>
            <Link
              component={RouterLink}
              to={section.browsePath}
              sx={{ ...smallCapsLinkSx(nh.blue), display: "inline-block", mb: 2.5 }}
            >
              {section.browseLabel}
            </Link>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
                gap: 2,
              }}
            >
              {section.races.map((race) => (
                <Box
                  key={race.name}
                  sx={{
                    bgcolor: nh.card,
                    border: `1px solid ${nh.border}`,
                    borderRadius: 2,
                    p: { xs: 2, sm: 2.5 },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: nh.mono,
                      fontSize: "0.68rem",
                      color: nh.blue,
                      letterSpacing: "0.08em",
                      mb: 1,
                    }}
                  >
                    {race.distanceLabel.toUpperCase()} {"//"} {race.typicalTiming.toUpperCase()}{" "}
                    {"//"} {race.area.toUpperCase()}
                  </Typography>
                  <Typography
                    component="h3"
                    sx={{ fontWeight: 800, fontSize: { xs: "1.15rem", sm: "1.35rem" }, mb: 1.25 }}
                  >
                    {race.name}
                  </Typography>
                  {race.description.map((paragraph) => (
                    <Typography key={paragraph} sx={{ color: nh.muted, lineHeight: 1.8, mb: 1.2 }}>
                      {paragraph}
                    </Typography>
                  ))}

                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: `1px solid ${nh.border}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: nh.mono,
                        fontSize: "0.68rem",
                        color: nh.faint,
                        letterSpacing: "0.1em",
                        mb: 0.6,
                      }}
                    >
                      BEST FOR
                    </Typography>
                    <Typography sx={{ color: nh.white, lineHeight: 1.7 }}>
                      {race.bestFor}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1.5,
                    }}
                  >
                    {race.editionLinks.map((link) => (
                      <Link
                        key={link.slug}
                        component={RouterLink}
                        to={racePath(link.slug)}
                        sx={smallCapsLinkSx(nh.blue)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}

        <Box sx={{ mb: 2 }}>
          <Typography
            component="h2"
            sx={{ fontWeight: 800, fontSize: { xs: "1.4rem", sm: "1.8rem" }, mb: 2 }}
          >
            Frequently Asked Questions About Hong Kong Races
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
            {FAQ_ITEMS.map((item) => (
              <Box
                key={item.question}
                sx={{
                  bgcolor: nh.card,
                  border: `1px solid ${nh.border}`,
                  borderRadius: 2,
                  p: { xs: 2, sm: 2.5 },
                }}
              >
                <Typography component="h3" sx={{ fontWeight: 700, fontSize: "1.02rem", mb: 1 }}>
                  {item.question}
                </Typography>
                <Typography sx={{ color: nh.muted, lineHeight: 1.8 }}>{item.answer}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
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
