import { useState, useMemo } from 'react';
import { Search, Download, Filter } from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { ReportCard } from '@/components/report';
import { ExportModal } from '@/components/export';
import { Button } from '@/components/ui/button';
import { useReportStore } from '@/stores/reportStore';

export function ReportsPage() {
  const { reports, deleteReport } = useReportStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Get unique regions
  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(reports.map((r) => r.region).filter(Boolean))];
    return uniqueRegions.sort();
  }, [reports]);

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          report.region.toLowerCase().includes(query) ||
          report.ciudad_provincia.toLowerCase().includes(query) ||
          report.diagnostico.situacion_actual.toLowerCase().includes(query) ||
          report.diagnostico.problemas_detectados.some((p) =>
            p.toLowerCase().includes(query)
          ) ||
          report.diagnostico.soluciones_propuestas.some((s) =>
            s.toLowerCase().includes(query)
          );

        if (!matchesSearch) return false;
      }

      // Region filter
      if (selectedRegion && report.region !== selectedRegion) {
        return false;
      }

      return true;
    });
  }, [reports, searchQuery, selectedRegion]);

  // Group reports by date
  const reportsByDate = useMemo(() => {
    const grouped: Record<string, typeof reports> = {};
    filteredReports.forEach((report) => {
      if (!grouped[report.fecha]) {
        grouped[report.fecha] = [];
      }
      grouped[report.fecha].push(report);
    });
    return grouped;
  }, [filteredReports]);

  const sortedDates = Object.keys(reportsByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            Reportes ({reports.length})
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}
            disabled={reports.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Buscar en reportes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {regions.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-muted flex-shrink-0" />
              <button
                onClick={() => setSelectedRegion(null)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedRegion === null
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedRegion === region
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reports List */}
        {filteredReports.length > 0 ? (
          <div className="space-y-4">
            {sortedDates.map((date) => (
              <div key={date}>
                {reportsByDate[date].map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onDelete={deleteReport}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted">
              {reports.length === 0
                ? 'No hay reportes todavía'
                : 'No se encontraron reportes con esos filtros'}
            </p>
          </div>
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        reports={filteredReports}
      />
    </PageContainer>
  );
}
