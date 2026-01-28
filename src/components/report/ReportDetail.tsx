import {
  ArrowLeft,
  Download,
  MapPin,
  Route,
  Droplets,
  Factory,
  User,
  Target,
  StickyNote,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditableField } from './EditableField';
import { EditableList } from './EditableList';
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs text-muted uppercase mb-1">Zona</p>
              <EditableField
                value={report.portada.zona}
                onSave={(value) =>
                  onUpdate({ portada: { ...report.portada, zona: value } })
                }
              />
            </div>
            <Badge variant="default" className="text-sm flex-shrink-0">
              {report.portada.semana}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Factory className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted uppercase">Fábricas</p>
                <EditableField
                  value={report.portada.fabricas.join(', ')}
                  onSave={(value) =>
                    onUpdate({
                      portada: {
                        ...report.portada,
                        fabricas: value.split(',').map((f) => f.trim()).filter(Boolean),
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <User className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted uppercase">Responsable</p>
                <EditableField
                  value={report.portada.responsable}
                  onSave={(value) =>
                    onUpdate({ portada: { ...report.portada, responsable: value } })
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border col-span-1 md:col-span-2">
              <Target className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted uppercase">Objetivo</p>
                <EditableField
                  value={report.portada.objetivo}
                  onSave={(value) =>
                    onUpdate({ portada: { ...report.portada, objetivo: value } })
                  }
                  multiline
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
              <Droplets className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted uppercase">Litros/Mes</p>
                <EditableField
                  value={report.foto_zona.litros_mes > 0 ? report.foto_zona.litros_mes.toLocaleString('es-ES') : ''}
                  onSave={(value) =>
                    onUpdate({
                      foto_zona: { ...report.foto_zona, litros_mes: parseInt(value.replace(/\D/g, '')) || 0 },
                    })
                  }
                />
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
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-muted uppercase mb-1">Rutas</p>
              <EditableField
                value={report.rutas.num_rutas > 0 ? report.rutas.num_rutas.toString() : ''}
                onSave={(value) =>
                  onUpdate({ rutas: { ...report.rutas, num_rutas: parseInt(value) || 0 } })
                }
              />
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-muted uppercase mb-1">L/Ruta</p>
              <EditableField
                value={report.rutas.litros_medios_ruta > 0 ? report.rutas.litros_medios_ruta.toLocaleString('es-ES') : ''}
                onSave={(value) =>
                  onUpdate({ rutas: { ...report.rutas, litros_medios_ruta: parseInt(value.replace(/\D/g, '')) || 0 } })
                }
              />
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-muted uppercase mb-1">Km Media</p>
              <EditableField
                value={report.rutas.distancia_media_km > 0 ? report.rutas.distancia_media_km.toString() : ''}
                onSave={(value) =>
                  onUpdate({ rutas: { ...report.rutas, distancia_media_km: parseInt(value) || 0 } })
                }
              />
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
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-xs text-muted uppercase mb-1">L Contratados</p>
              <EditableField
                value={report.volumenes.volumen_contratado > 0 ? report.volumenes.volumen_contratado.toLocaleString('es-ES') : ''}
                onSave={(value) =>
                  onUpdate({ volumenes: { ...report.volumenes, volumen_contratado: parseInt(value.replace(/\D/g, '')) || 0 } })
                }
              />
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-xs text-muted uppercase mb-1">L Reales</p>
              <EditableField
                value={report.volumenes.volumen_real > 0 ? report.volumenes.volumen_real.toLocaleString('es-ES') : ''}
                onSave={(value) =>
                  onUpdate({ volumenes: { ...report.volumenes, volumen_real: parseInt(value.replace(/\D/g, '')) || 0 } })
                }
              />
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-xs text-muted uppercase mb-1">% Contratos Largos</p>
              <EditableField
                value={report.volumenes.pct_contratos_largos > 0 ? report.volumenes.pct_contratos_largos.toString() : ''}
                onSave={(value) =>
                  onUpdate({ volumenes: { ...report.volumenes, pct_contratos_largos: parseInt(value) || 0 } })
                }
              />
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
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50 rounded-t-lg">
          <CardTitle className="text-base text-orange-700">
            Riesgos Detectados ({report.riesgos.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <EditableList
            items={report.riesgos}
            onSave={(items) => onUpdate({ riesgos: items })}
            placeholder="Añadir riesgo..."
            bulletColor="bg-orange-500"
          />
        </CardContent>
      </Card>

      {/* 7. Oportunidades */}
      <Card className="border-green-200">
        <CardHeader className="bg-green-50 rounded-t-lg">
          <CardTitle className="text-base text-green-700">
            Oportunidades y Propuestas ({report.oportunidades.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <EditableList
            items={report.oportunidades}
            onSave={(items) => onUpdate({ oportunidades: items })}
            placeholder="Añadir oportunidad..."
            bulletColor="bg-green-500"
          />
        </CardContent>
      </Card>

      {/* 8. Cierre Ejecutivo */}
      <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="text-base">Cierre Ejecutivo</CardTitle>
        </CardHeader>
        <CardContent>
          <EditableField
            value={report.cierre_ejecutivo}
            onSave={(value) => onUpdate({ cierre_ejecutivo: value })}
            multiline
          />
        </CardContent>
      </Card>

      {/* 9. Notas Adicionales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-amber-600" />
            Notas Adicionales
          </CardTitle>
          <p className="text-xs text-muted">Añade información que hayas olvidado mencionar en el audio</p>
        </CardHeader>
        <CardContent>
          <EditableField
            value={report.notas_adicionales || ''}
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
            <p className="text-sm text-muted bg-gray-50 p-4 rounded-lg italic">
              "{report.transcripcion_original}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
