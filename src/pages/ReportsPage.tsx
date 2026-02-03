import { useState, useMemo } from 'react';
import { Search, Download, Filter } from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { ReportCard } from '@/components/report';
import { ExportModal } from '@/components/export';
import { Button } from '@/components/ui/button';
import { useReportStore } from '@/stores/reportStore';

export function ReportsPage() {
  const { reports, deleteReport, cloneReport } = useReportStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZona, setSelectedZona] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Get unique zonas
  const zonas = useMemo(() => {
    const uniqueZonas = [...new Set(reports.map((r) => r.portada.zona).filter(Boolean))];
    return uniqueZonas.sort();
  }, [reports]);

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          report.portada.zona.toLowerCase().includes(query) ||
          report.portada.objetivo.toLowerCase().includes(query) ||
          report.cierre_ejecutivo.toLowerCase().includes(query) ||
          report.riesgos.some((r: string) => r.toLowerCase().includes(query)) ||
          report.oportunidades.some((o: string) => o.toLowerCase().includes(query)) ||
          report.portada.fabricas.some((f: string) => f.toLowerCase().includes(query));

        if (!matchesSearch) return false;
      }

      // Zona filter
      if (selectedZona && report.portada.zona !== selectedZona) {
        return false;
      }

      return true;
    });
  }, [reports, searchQuery, selectedZona]);

  // Group reports by semana
  const reportsBySemana = useMemo(() => {
    const grouped: Record<string, typeof reports> = {};
    filteredReports.forEach((report) => {
      const semana = report.portada.semana;
      if (!grouped[semana]) {
        grouped[semana] = [];
      }
      grouped[semana].push(report);
    });
    return grouped;
  }, [filteredReports]);

  const sortedSemanas = Object.keys(reportsBySemana).sort().reverse();

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
              placeholder="Buscar por zona, riesgos, oportunidades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {zonas.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-muted flex-shrink-0" />
              <button
                onClick={() => setSelectedZona(null)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedZona === null
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              {zonas.map((zona) => (
                <button
                  key={zona}
                  onClick={() => setSelectedZona(zona)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedZona === zona
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {zona}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reports List */}
        {filteredReports.length > 0 ? (
          <div className="space-y-6">
            {sortedSemanas.map((semana) => (
              <div key={semana}>
                <h3 className="text-sm font-medium text-muted mb-3">{semana}</h3>
                <div className="space-y-4">
                  {reportsBySemana[semana].map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onDelete={deleteReport}
                      onClone={cloneReport}
                    />
                  ))}
                </div>
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
