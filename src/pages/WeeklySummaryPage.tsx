import { useMemo } from 'react';
import { Download } from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { VolumesChart, WeeklySummaryCard } from '@/components/charts';
import { ExportModal } from '@/components/export';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReportStore } from '@/stores/reportStore';
import { useState } from 'react';

export function WeeklySummaryPage() {
  const { reports } = useReportStore();
  const [showExportModal, setShowExportModal] = useState(false);

  // Group reports by semana
  const weeklyData = useMemo(() => {
    const weeks: Record<string, typeof reports> = {};

    reports.forEach((report) => {
      const semana = report.portada.semana;
      if (!weeks[semana]) {
        weeks[semana] = [];
      }
      weeks[semana].push(report);
    });

    return Object.entries(weeks)
      .map(([semana, weekReports]) => ({
        semana,
        reports: weekReports,
      }))
      .sort((a, b) => b.semana.localeCompare(a.semana));
  }, [reports]);

  // Aggregate stats
  const totalStats = useMemo(() => {
    return {
      totalReports: reports.length,
      totalLitros: reports.reduce((sum, r) => sum + r.foto_zona.litros_mes, 0),
      totalRutas: reports.reduce((sum, r) => sum + r.rutas.num_rutas, 0),
      totalRiesgos: reports.reduce((sum, r) => sum + r.riesgos.length, 0),
      totalOportunidades: reports.reduce(
        (sum, r) => sum + r.oportunidades.length,
        0
      ),
    };
  }, [reports]);

  // Top riesgos (most mentioned)
  const topRiesgos = useMemo(() => {
    const riesgoCounts: Record<string, number> = {};
    reports.forEach((report) => {
      report.riesgos.forEach((riesgo: string) => {
        const key = riesgo.toLowerCase().trim();
        riesgoCounts[key] = (riesgoCounts[key] || 0) + 1;
      });
    });

    return Object.entries(riesgoCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([riesgo, count]) => ({
        riesgo: riesgo.charAt(0).toUpperCase() + riesgo.slice(1),
        count,
      }));
  }, [reports]);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Resumen Semanal</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}
            disabled={reports.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Todo
          </Button>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted">
              Genera reportes para ver el resumen semanal
            </p>
          </div>
        ) : (
          <>
            {/* Total Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Estadísticas Totales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {totalStats.totalReports}
                    </p>
                    <p className="text-xs text-muted">Reportes</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {(totalStats.totalLitros / 1000).toFixed(1)}k
                    </p>
                    <p className="text-xs text-muted">Litros</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-success">
                      {totalStats.totalRutas}
                    </p>
                    <p className="text-xs text-muted">Rutas</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-danger">
                      {totalStats.totalRiesgos}
                    </p>
                    <p className="text-xs text-muted">Riesgos</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-success">
                      {totalStats.totalOportunidades}
                    </p>
                    <p className="text-xs text-muted">Oportunidades</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Volumes Chart */}
            <VolumesChart reports={reports} />

            {/* Top Riesgos */}
            {topRiesgos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Riesgos Más Frecuentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topRiesgos.map(({ riesgo, count }, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-foreground flex-1 mr-4">
                          {riesgo}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-danger rounded-full"
                              style={{
                                width: `${(count / (topRiesgos[0]?.count || 1)) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted w-6 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weekly Summaries */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Por Semana
              </h3>
              {weeklyData.map(({ semana, reports: weekReports }) => (
                <WeeklySummaryCard
                  key={semana}
                  semana={semana}
                  reports={weekReports}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        reports={reports}
      />
    </PageContainer>
  );
}
