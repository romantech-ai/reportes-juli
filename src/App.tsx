import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, MobileNav, Sidebar } from '@/components/layout';
import {
  HomePage,
  ReportsPage,
  ReportDetailPage,
  WeeklySummaryPage,
} from '@/pages';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Sidebar - hidden on mobile unless open */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/reportes" element={<ReportsPage />} />
            <Route path="/reporte/:id" element={<ReportDetailPage />} />
            <Route path="/resumen" element={<WeeklySummaryPage />} />
          </Routes>

          {/* Mobile bottom navigation */}
          <MobileNav />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
