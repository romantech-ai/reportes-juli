import {
  ArrowLeft,
  Download,
  MapPin,
  Route,
  Droplets,
  Factory,
  User,
  Target,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExecutiveSection } from './ExecutiveSection';
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
          Exportar PDF
        </Button>
      </div>

      {/* 1. Portada */}
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-display">
              {report.portada.zona || 'Zona sin especificar'}
            </CardTitle>
            <Badge variant="default" className="text-sm">
              {report.portada.semana}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Factory className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-xs text-muted uppercase">Fábricas</p>
                <p className="font-semibold">
                  {report.portada.fabricas.length > 0
                    ? report.portada.fabricas.join(', ')
                    : '-'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <User className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-xs text-muted uppercase">Responsable</p>
                <p className="font-semibold">{report.portada.responsable}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border col-span-1 md:col-span-2">
              <Target className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <p className="text-xs text-muted uppercase">Objetivo</p>
                <EditableField
                  value={report.portada.objetivo}
                  onSave={(value) =>
                    onUpdate({ portada: { ...report.portada, objetivo: value } })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Foto General de la Zona */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Foto General de la Zona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Droplets className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs text-muted uppercase">Litros/Mes</p>
                <p className="font-semibold">
                  {report.foto_zona.litros_mes > 0
                    ? report.foto_zona.litros_mes.toLocaleString('es-ES') + ' L'
                    : '-'}
                </p>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-muted uppercase mb-1">Fábricas Destino</p>
              <EditableField
                value={report.foto_zona.fabricas_destino}
                onSave={(value) =>
                  onUpdate({
                    foto_zona: { ...report.foto_zona, fabricas_destino: value },
                  })
                }
              />
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-muted uppercase mb-1">Peso Estratégico</p>
              <EditableField
                value={report.foto_zona.peso_estrategico}
                onSave={(value) =>
                  onUpdate({
                    foto_zona: { ...report.foto_zona, peso_estrategico: value },
                  })
                }
                multiline
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Rutas y Logística */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Route className="h-5 w-5 text-slate-600" />
            Rutas y Logística
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-slate-700">
                {report.rutas.num_rutas || '-'}
              </p>
              <p className="text-xs text-muted uppercase">Rutas</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-slate-700">
                {report.rutas.litros_medios_ruta > 0
                  ? report.rutas.litros_medios_ruta.toLocaleString('es-ES')
                  : '-'}
              </p>
              <p className="text-xs text-muted uppercase">L/Ruta</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-slate-700">
                {report.rutas.distancia_media_km > 0
                  ? report.rutas.distancia_media_km
                  : '-'}
              </p>
              <p className="text-xs text-muted uppercase">Km Media</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-muted uppercase mb-1">Eficiencia</p>
              <EditableField
                value={report.rutas.eficiencia}
                onSave={(value) =>
                  onUpdate({ rutas: { ...report.rutas, eficiencia: value } })
                }
              />
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-muted uppercase mb-1">Solapes</p>
            <EditableField
              value={report.rutas.solapes}
              onSave={(value) =>
                onUpdate({ rutas: { ...report.rutas, solapes: value } })
              }
              multiline
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Volúmenes y Contratos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Volúmenes y Contratos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-amber-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-amber-700">
                {report.volumenes.volumen_contratado > 0
                  ? (report.volumenes.volumen_contratado / 1000).toFixed(0) + 'k'
                  : '-'}
              </p>
              <p className="text-xs text-muted uppercase">L Contratados</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-amber-700">
                {report.volumenes.volumen_real > 0
                  ? (report.volumenes.volumen_real / 1000).toFixed(0) + 'k'
                  : '-'}
              </p>
              <p className="text-xs text-muted uppercase">L Reales</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-amber-700">
                {report.volumenes.pct_contratos_largos > 0
                  ? report.volumenes.pct_contratos_largos + '%'
                  : '-'}
              </p>
              <p className="text-xs text-muted uppercase">Contratos Largos</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-xs text-muted uppercase mb-1">Concentración</p>
              <EditableField
                value={report.volumenes.concentracion_ganaderos}
                onSave={(value) =>
                  onUpdate({
                    volumenes: {
                      ...report.volumenes,
                      concentracion_ganaderos: value,
                    },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Calidad y Estacionalidad */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Calidad y Estacionalidad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-cyan-50 rounded-lg">
              <p className="text-xs text-muted uppercase mb-1">Calidad Media</p>
              <EditableField
                value={report.calidad.calidad_media}
                onSave={(value) =>
                  onUpdate({
                    calidad: { ...report.calidad, calidad_media: value },
                  })
                }
              />
            </div>
            <div className="p-3 bg-cyan-50 rounded-lg">
              <p className="text-xs text-muted uppercase mb-1">Incidencias</p>
              <EditableField
                value={report.calidad.incidencias}
                onSave={(value) =>
                  onUpdate({
                    calidad: { ...report.calidad, incidencias: value },
                  })
                }
                multiline
              />
            </div>
            <div className="p-3 bg-cyan-50 rounded-lg">
              <p className="text-xs text-muted uppercase mb-1">
                Impacto Estacional
              </p>
              <EditableField
                value={report.calidad.impacto_estacional}
                onSave={(value) =>
                  onUpdate({
                    calidad: { ...report.calidad, impacto_estacional: value },
                  })
                }
                multiline
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Riesgos */}
      <ExecutiveSection
        type="riesgos"
        title="Riesgos Detectados"
        content={report.riesgos}
        className="bg-orange-50 border-orange-200"
      />

      {/* 7. Oportunidades */}
      <ExecutiveSection
        type="oportunidades"
        title="Oportunidades y Propuestas"
        content={report.oportunidades}
        className="bg-green-50 border-green-200"
      />

      {/* 8. Cierre Ejecutivo */}
      {report.cierre_ejecutivo && (
        <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardHeader>
            <CardTitle className="text-base">Cierre Ejecutivo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-stone-800 leading-relaxed font-medium">
              {report.cierre_ejecutivo}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Transcripción Original */}
      {report.transcripcion_original && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transcripción Original</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted bg-gray-50 p-4 rounded-lg italic">
              "{report.transcripcion_original}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
