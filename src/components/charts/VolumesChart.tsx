import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Report } from '@/types/report';

interface VolumesChartProps {
  reports: Report[];
}

export function VolumesChart({ reports }: VolumesChartProps) {
  const data = reports
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((report) => ({
      zona: report.portada.zona || 'Sin zona',
      litros: report.foto_zona.litros_mes,
      rutas: report.rutas.num_rutas,
    }));

  if (data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Volúmenes por Zona</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="zona"
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#64748b"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
                formatter={(value) => [
                  `${Number(value).toLocaleString('es-ES')} L`,
                  'Volumen',
                ]}
              />
              <Bar
                dataKey="litros"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
