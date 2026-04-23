import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AutomationStudioPage } from './pages/AutomationStudio';
import { DashboardPage } from './pages/Dashboard';
import { ExportPage } from './pages/Export';
import { ProfilesPage } from './pages/Profiles';
import { ResearchPage } from './pages/Research';
import { SettingsPage } from './pages/Settings';
import { StudioPage } from './pages/Studio';

export const App = () => (
  <>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="profiles" element={<ProfilesPage />} />
        <Route path="automation" element={<AutomationStudioPage />} />
        <Route path="research" element={<ResearchPage />} />
        <Route path="studio" element={<StudioPage />} />
        <Route path="export" element={<ExportPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <Toaster position="bottom-right" />
  </>
);
