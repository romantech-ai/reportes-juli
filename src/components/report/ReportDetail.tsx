import { ArrowLeft, Download, MapPin, Route, Droplets, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DiagnosticSection } from './DiagnosticSection';
import { EditableField } from './EditableField';
import type { Report } from '@/types/report';

interface ReportDetailProps {
  report: Report;
  onUpdate: (updates: Partial<Report>) => void;
  onExport: () => void;
}

export function ReportDetail({ report, onUpdate, onExport }: ReportDetailProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <Button onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {formatDate(report.fecha)}
            </CardTitle>
            <Badge variant="default">{report.region || 'Sin región'}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-muted" />
              <div>
                <p className="text-xs text-muted uppercase">Ubicación</p>
                <EditableField
                  value={report.ciudad_provincia}
                  onSave={(value) => onUpdate({ ciudad_provincia: value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Route className="h-5 w-5 text-muted" />
              <div>
                <p className="text-xs text-muted uppercase">Rutas Visitadas</p>
                <p className="font-semibold">
                  {report.rutas.numero_rutas_visitadas}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Droplets className="h-5 w-5 text-muted" />
              <div>
                <p className="text-xs text-muted uppercase">Volumen Total</p>
                <p className="font-semibold">
                  {report.volumenes.total_litros.toLocaleString('es-ES')} L
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rutas Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalles de Rutas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <EditableField
            label="Distribución"
            value={report.rutas.distribucion}
            onSave={(value) =>
              onUpdate({ rutas: { ...report.rutas, distribucion: value } })
            }
            multiline
          />
          <EditableField
            label="Observaciones"
            value={report.rutas.observaciones}
            onSave={(value) =>
              onUpdate({ rutas: { ...report.rutas, observaciones: value } })
            }
            multiline
          />
        </CardContent>
      </Card>

      {/* Volúmenes Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalles de Volúmenes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <EditableField
            label="Desglose por Cliente"
            value={report.volumenes.desglose_por_cliente}
            onSave={(value) =>
              onUpdate({
                volumenes: { ...report.volumenes, desglose_por_cliente: value },
              })
            }
            multiline
          />
          <EditableField
            label="Tendencias"
            value={report.volumenes.tendencias}
            onSave={(value) =>
              onUpdate({ volumenes: { ...report.volumenes, tendencias: value } })
            }
            multiline
          />
        </CardContent>
      </Card>

      {/* Diagnóstico */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Diagnóstico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DiagnosticSection
            type="situacion"
            title="Situación Actual"
            content={report.diagnostico.situacion_actual}
          />
          <DiagnosticSection
            type="problemas"
            title="Problemas Detectados"
            content={report.diagnostico.problemas_detectados}
          />
          <DiagnosticSection
            type="soluciones"
            title="Soluciones Propuestas"
            content={report.diagnostico.soluciones_propuestas}
          />
          <DiagnosticSection
            type="oportunidades"
            title="Oportunidades"
            content={report.diagnostico.oportunidades}
          />
        </CardContent>
      </Card>

      {/* Aprendizajes */}
      {report.aprendizajes_clave.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aprendizajes Clave</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.aprendizajes_clave.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Notas Adicionales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notas Adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <EditableField
            value={report.notas_adicionales}
            onSave={(value) => onUpdate({ notas_adicionales: value })}
            multiline
          />
        </CardContent>
      </Card>

      {/* Transcripción Original */}
      {report.transcripcion_original && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transcripción Original</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted bg-gray-50 p-4 rounded-lg">
              {report.transcripcion_original}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
