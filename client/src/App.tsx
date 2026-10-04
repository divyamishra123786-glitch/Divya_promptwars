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
          <Route path="new" element={<NewAnalysisPage />} />
          <Route path="analysis/:id" element={<AnalysisResultsPage />} />
          <Route path="decisions" element={<MyDecisionsPage />} />
          <Route path="compare" element={<CompareAnalysesPage />} />
          <Route path="perspectives" element={<PerspectiveLabPage />} />
          <Route path="simulator" element={<SimulatorPage />} />
          <Route path="challenge" element={<ChallengePage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
