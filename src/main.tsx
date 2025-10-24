import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import DonatePage from './pages/DonatePage.tsx';
import WorshipPage from './pages/WorshipPage.tsx';
import WeBelievePage from './pages/WeBelievePage.tsx';
import YuvanidhiPage from './pages/YuvanidhiPage.tsx';
import TVMinistryPage from './pages/TVMinistryPage.tsx';
import PrayerHutPage from './pages/PrayerHutPage.tsx';
import SatelliteChurchPage from './pages/SatelliteChurchPage.tsx';
import VivahaVedikaPage from './pages/VivahaVedikaPage.tsx';
import AdminLoginPage from './pages/AdminLoginPage.tsx';
import AdminDashboardPage from './pages/AdminDashboardPage.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/worship" element={<WorshipPage />} />
        <Route path="/we-believe" element={<WeBelievePage />} />
        <Route path="/yuvanidhi" element={<YuvanidhiPage />} />
        <Route path="/tv-ministry" element={<TVMinistryPage />} />
        <Route path="/prayer-hut" element={<PrayerHutPage />} />
        <Route path="/satellite-church" element={<SatelliteChurchPage />} />
        <Route path="/vivaha-vedika" element={<VivahaVedikaPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
