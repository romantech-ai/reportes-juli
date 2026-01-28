import { TrendingUp, Route, Droplets, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Report } from '@/types/report';

interface WeeklySummaryCardProps {
  reports: Report[];
  weekNumber: number;
}

export function WeeklySummaryCard({ reports, weekNumber }: WeeklySummaryCardProps) {
  const totalLitros = reports.reduce(
    (sum, r) => sum + r.volumenes.total_litros,
    0
  );
  const totalRutas = reports.reduce(
    (sum, r) => sum + r.rutas.numero_rutas_visitadas,
    0
  );
  const allProblems = reports.flatMap((r) => r.diagnostico.problemas_detectados);
  const allSolutions = reports.flatMap((r) => r.diagnostico.soluciones_propuestas);
  const uniqueRegions = [...new Set(reports.map((r) => r.region).filter(Boolean))];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Semana {weekNumber}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <Droplets className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold text-foreground">
              {(totalLitros / 1000).toFixed(1)}k
            </p>
            <p className="text-xs text-muted">Litros totales</p>
          </div>
          <div className="text-center p-3 bg-success/5 rounded-lg">
            <Route className="h-5 w-5 mx-auto text-success mb-1" />
            <p className="text-2xl font-bold text-foreground">{totalRutas}</p>
            <p className="text-xs text-muted">Rutas visitadas</p>
          </div>
          <div className="text-center p-3 bg-danger/5 rounded-lg">
            <AlertCircle className="h-5 w-5 mx-auto text-danger mb-1" />
            <p className="text-2xl font-bold text-foreground">
              {allProblems.length}
            </p>
            <p className="text-xs text-muted">Problemas detectados</p>
          </div>
          <div className="text-center p-3 bg-success/5 rounded-lg">
            <CheckCircle2 className="h-5 w-5 mx-auto text-success mb-1" />
            <p className="text-2xl font-bold text-foreground">
              {allSolutions.length}
            </p>
            <p className="text-xs text-muted">Soluciones propuestas</p>
          </div>
        </div>

        {uniqueRegions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">
              Regiones visitadas
            </p>
            <div className="flex flex-wrap gap-2">
              {uniqueRegions.map((region) => (
                <span
                  key={region}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 text-center text-sm text-muted">
          {reports.length} reportes esta semana
        </div>
      </CardContent>
    </Card>
  );
}
