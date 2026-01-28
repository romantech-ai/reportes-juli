import { useMemo } from 'react';
import { Download } from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { VolumesChart, WeeklySummaryCard } from '@/components/charts';
import { ExportModal } from '@/components/export';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReportStore } from '@/stores/reportStore';
import { getWeekNumber } from '@/lib/utils';
import { useState } from 'react';

export function WeeklySummaryPage() {
  const { reports } = useReportStore();
  const [showExportModal, setShowExportModal] = useState(false);

  // Group reports by week
  const weeklyData = useMemo(() => {
    const weeks: Record<number, typeof reports> = {};

    reports.forEach((report) => {
      const week = getWeekNumber(report.fecha);
      if (!weeks[week]) {
        weeks[week] = [];
      }
      weeks[week].push(report);
    });

    return Object.entries(weeks)
      .map(([weekNum, weekReports]) => ({
        weekNumber: parseInt(weekNum),
        reports: weekReports,
      }))
      .sort((a, b) => b.weekNumber - a.weekNumber);
  }, [reports]);

  // Aggregate stats
  const totalStats = useMemo(() => {
    return {
      totalReports: reports.length,
      totalLitros: reports.reduce((sum, r) => sum + r.volumenes.total_litros, 0),
      totalRutas: reports.reduce(
        (sum, r) => sum + r.rutas.numero_rutas_visitadas,
        0
      ),
      totalProblems: reports.reduce(
        (sum, r) => sum + r.diagnostico.problemas_detectados.length,
        0
      ),
      totalSolutions: reports.reduce(
        (sum, r) => sum + r.diagnostico.soluciones_propuestas.length,
        0
      ),
    };
  }, [reports]);

  // Top problems (most mentioned)
  const topProblems = useMemo(() => {
    const problemCounts: Record<string, number> = {};
    reports.forEach((report) => {
      report.diagnostico.problemas_detectados.forEach((problem) => {
        const key = problem.toLowerCase().trim();
        problemCounts[key] = (problemCounts[key] || 0) + 1;
      });
    });

    return Object.entries(problemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([problem, count]) => ({
        problem: problem.charAt(0).toUpperCase() + problem.slice(1),
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
                  Estadísticas Totales (21 días)
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
                      {totalStats.totalProblems}
                    </p>
                    <p className="text-xs text-muted">Problemas</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-success">
                      {totalStats.totalSolutions}
                    </p>
                    <p className="text-xs text-muted">Soluciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Volumes Chart */}
            <VolumesChart reports={reports} />

            {/* Top Problems */}
            {topProblems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Problemas Más Frecuentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topProblems.map(({ problem, count }, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-foreground flex-1 mr-4">
                          {problem}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-danger rounded-full"
                              style={{
                                width: `${(count / (topProblems[0]?.count || 1)) * 100}%`,
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
              {weeklyData.map(({ weekNumber, reports: weekReports }) => (
                <WeeklySummaryCard
                  key={weekNumber}
                  weekNumber={weekNumber}
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
