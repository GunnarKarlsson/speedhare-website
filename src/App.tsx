import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AllRacesPage } from "./new_home/AllRacesPage";
import { HongKongRunningRacesPage } from "./new_home/HongKongRunningRacesPage";
import { NewHomePage } from "./new_home/NewHomePage";
import { CalculatorPage } from "./pages/CalculatorPage";
import { AboutPage, DataPolicyPage, TermsConditionsPage } from "./pages/InfoPages";
import { RaceDetailPage } from "./pages/RaceDetailPage";
import { RunnerPage } from "./pages/RunnerPage";
import { SearchPage } from "./pages/SearchPage";
import { StatsPage } from "./pages/StatsPage";
import { Vo2MaxCalculatorPage } from "./pages/Vo2MaxCalculatorPage";

function ScrollToTopOnRouteChange() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTopOnRouteChange />
      <Routes>
        <Route path="/" element={<NewHomePage />} />
        <Route path="new_home" element={<Navigate to="/" replace />} />
        <Route path="all-races" element={<AllRacesPage />} />
        <Route path="hong-kong-10k-5k-half-marathon-race" element={<HongKongRunningRacesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="terms" element={<TermsConditionsPage />} />
        <Route path="data-policy" element={<DataPolicyPage />} />
        <Route path="races/:idOrSlug" element={<RaceDetailPage />} />
        <Route path="races/:raceId/runners/:resultId" element={<RunnerPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route
          path="stats"
          element={<Navigate to="/hong-kong-road-race-stats-5k-10k-half-marathon" replace />}
        />
        <Route path="hong-kong-road-race-stats-5k-10k-half-marathon" element={<StatsPage />} />
        <Route
          path="calculator"
          element={<Navigate to="/speed-distance-time-calculator" replace />}
        />
        <Route path="speed-distance-time-calculator" element={<CalculatorPage />} />
        <Route path="vo2max-calculator" element={<Vo2MaxCalculatorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
