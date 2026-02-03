import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, MobileNav, Sidebar } from '@/components/layout';
import { MigrationModal } from '@/components/sync';
import {
  HomePage,
  ReportsPage,
  ReportDetailPage,
  WeeklySummaryPage,
} from '@/pages';
import { useReportStore } from '@/stores/reportStore';
import { isSupabaseConfigured } from '@/lib/supabase';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMigration, setShowMigration] = useState(false);
  const {
    getLocalOnlyReportsCount,
    loadFromRemote,
    setupRealtimeSync,
    cleanupRealtimeSync,
  } = useReportStore();

  // Setup sync on mount
  useEffect(() => {
    if (isSupabaseConfigured()) {
      // Load remote data
      loadFromRemote();

      // Setup realtime sync
      setupRealtimeSync();

      // Check for local-only reports to migrate
      const localCount = getLocalOnlyReportsCount();
      if (localCount > 0) {
        setShowMigration(true);
      }

      return () => {
        cleanupRealtimeSync();
      };
    }
  }, [loadFromRemote, setupRealtimeSync, cleanupRealtimeSync, getLocalOnlyReportsCount]);

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

      {/* Migration Modal */}
      <MigrationModal
        open={showMigration}
        onOpenChange={setShowMigration}
      />
    </BrowserRouter>
  );
}

export default App;
