import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import LandingPage from './pages/Landing';
import OverviewPage from './pages/Overview';
import NewAnalysisPage from './pages/NewAnalysis';
import AnalysisResultsPage from './pages/AnalysisResults';
import MyDecisionsPage from './pages/MyDecisions';
import CompareAnalysesPage from './pages/CompareAnalyses';
import PerspectiveLabPage from './pages/PerspectiveLab';
import SimulatorPage from './pages/Simulator';
import ChallengePage from './pages/Challenge';
import JournalPage from './pages/Journal';
import SettingsPage from './pages/Settings';
import AboutPage from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Application Shell */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="new-analysis" element={<NewAnalysisPage />} />
          <Route path="analysis/:id" element={<AnalysisResultsPage />} />
          <Route path="decisions" element={<MyDecisionsPage />} />
          <Route path="compare" element={<CompareAnalysesPage />} />
          <Route path="perspective-lab" element={<PerspectiveLabPage />} />
          <Route path="what-if" element={<SimulatorPage />} />
          <Route path="challenge" element={<ChallengePage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="about" element={<AboutPage />} />

          {/* Legacy route aliases for backward compatibility */}
          <Route path="new" element={<Navigate to="/app/new-analysis" replace />} />
          <Route path="perspectives" element={<Navigate to="/app/perspective-lab" replace />} />
          <Route path="simulator" element={<Navigate to="/app/what-if" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
