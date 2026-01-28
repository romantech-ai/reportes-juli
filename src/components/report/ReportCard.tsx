import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Route,
  Droplets,
  ChevronDown,
  ArrowUpRight,
  Trash2,
  Factory,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExecutiveSection } from './ExecutiveSection';
import type { Report } from '@/types/report';

interface ReportCardProps {
  report: Report;
  onDelete?: (id: string) => void;
  expanded?: boolean;
}

export function ReportCard({
  report,
  onDelete,
  expanded: initialExpanded = false,
}: ReportCardProps) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const navigate = useNavigate();
  const riskCount = report.riesgos.length;
  const opportunityCount = report.oportunidades.length;

  return (
    <article className="group relative bg-white rounded-2xl card-shadow border border-stone-200 overflow-hidden transition-all hover:shadow-lg">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600" />

      <header
        className="p-4 md:p-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Zona as main title */}
            <h3 className="text-lg font-display font-semibold text-stone-900 mb-2">
              {report.portada.zona || 'Zona sin especificar'}
            </h3>

            {/* Badges: Semana + Fábricas */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs font-medium rounded-md">
                {report.portada.semana}
              </span>
              {report.portada.fabricas.map((fabrica, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-md"
                >
                  <Factory className="h-3 w-3" />
                  {fabrica}
                </span>
              ))}
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-4 text-sm text-stone-500 flex-wrap">
              {report.foto_zona.litros_mes > 0 && (
                <span className="flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5" />
                  {report.foto_zona.litros_mes.toLocaleString('es-ES')} L/mes
                </span>
              )}
              {report.rutas.num_rutas > 0 && (
                <span className="flex items-center gap-1.5">
                  <Route className="h-3.5 w-3.5" />
                  {report.rutas.num_rutas} rutas
                </span>
              )}
              {report.portada.zona && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {report.portada.zona}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5">
              {riskCount > 0 && (
                <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-lg">
                  <AlertTriangle className="h-3 w-3" />
                  {riskCount}
                </span>
              )}
              {opportunityCount > 0 && (
                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
                  <Lightbulb className="h-3 w-3" />
                  {opportunityCount}
                </span>
              )}
            </div>
            <button
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg transition-all',
                expanded
                  ? 'bg-amber-100 rotate-180'
                  : 'bg-stone-100 group-hover:bg-amber-100'
              )}
            >
              <ChevronDown className="h-4 w-4 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Preview del cierre ejecutivo */}
        {report.cierre_ejecutivo && !expanded && (
          <p className="mt-3 text-sm text-stone-600 line-clamp-2 italic border-l-2 border-amber-300 pl-3">
            {report.cierre_ejecutivo}
          </p>
        )}
      </header>

      {expanded && (
        <div className="border-t border-stone-200 animate-fade-up">
          {/* Mobile badges */}
          <div className="sm:hidden flex items-center gap-2 px-4 py-3 bg-stone-50">
            {riskCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-lg">
                <AlertTriangle className="h-3 w-3" />
                {riskCount} riesgos
              </span>
            )}
            {opportunityCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
                <Lightbulb className="h-3 w-3" />
                {opportunityCount} oportunidades
              </span>
            )}
          </div>

          <div className="p-4 md:p-5 space-y-3 stagger-children">
            {/* Foto de zona */}
            {(report.foto_zona.peso_estrategico ||
              report.foto_zona.fabricas_destino) && (
              <ExecutiveSection type="foto_zona" title="Foto de la Zona">
                <div className="space-y-2 text-sm text-stone-700">
                  {report.foto_zona.litros_mes > 0 && (
                    <p>
                      <span className="font-medium">Volumen mensual:</span>{' '}
                      {report.foto_zona.litros_mes.toLocaleString('es-ES')} L
                    </p>
                  )}
                  {report.foto_zona.fabricas_destino && (
                    <p>
                      <span className="font-medium">Fábricas destino:</span>{' '}
                      {report.foto_zona.fabricas_destino}
                    </p>
                  )}
                  {report.foto_zona.peso_estrategico && (
                    <p>
                      <span className="font-medium">Peso estratégico:</span>{' '}
                      {report.foto_zona.peso_estrategico}
                    </p>
                  )}
                </div>
              </ExecutiveSection>
            )}

            {/* Rutas */}
            {(report.rutas.num_rutas > 0 ||
              report.rutas.eficiencia ||
              report.rutas.solapes) && (
              <ExecutiveSection type="rutas" title="Rutas y Logística">
                <div className="space-y-2 text-sm text-stone-700">
                  <div className="flex gap-4 flex-wrap">
                    {report.rutas.num_rutas > 0 && (
                      <span>
                        <span className="font-medium">Rutas:</span>{' '}
                        {report.rutas.num_rutas}
                      </span>
                    )}
                    {report.rutas.litros_medios_ruta > 0 && (
                      <span>
                        <span className="font-medium">Media:</span>{' '}
                        {report.rutas.litros_medios_ruta.toLocaleString(
                          'es-ES'
                        )}{' '}
                        L/ruta
                      </span>
                    )}
                    {report.rutas.distancia_media_km > 0 && (
                      <span>
                        <span className="font-medium">Distancia:</span>{' '}
                        {report.rutas.distancia_media_km} km
                      </span>
                    )}
                  </div>
                  {report.rutas.solapes && (
                    <p>
                      <span className="font-medium">Solapes:</span>{' '}
                      {report.rutas.solapes}
                    </p>
                  )}
                  {report.rutas.eficiencia && (
                    <p>
                      <span className="font-medium">Eficiencia:</span>{' '}
                      {report.rutas.eficiencia}
                    </p>
                  )}
                </div>
              </ExecutiveSection>
            )}

            {/* Riesgos */}
            <ExecutiveSection
              type="riesgos"
              title="Riesgos Detectados"
              content={report.riesgos}
            />

            {/* Oportunidades */}
            <ExecutiveSection
              type="oportunidades"
              title="Oportunidades"
              content={report.oportunidades}
            />

            {/* Cierre Ejecutivo */}
            {report.cierre_ejecutivo && (
              <ExecutiveSection type="cierre" title="Cierre Ejecutivo">
                <p className="text-sm text-stone-800 leading-relaxed font-medium">
                  {report.cierre_ejecutivo}
                </p>
              </ExecutiveSection>
            )}
          </div>

          <footer className="flex items-center justify-between px-4 md:px-5 py-3 bg-stone-50 border-t border-stone-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/reporte/${report.id}`);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
            >
              Ver detalle
              <ArrowUpRight className="h-4 w-4" />
            </button>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('¿Eliminar este reporte?')) onDelete(report.id);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-stone-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </footer>

          {report.transcripcion_original && (
            <details className="border-t border-stone-200">
              <summary className="px-4 md:px-5 py-3 text-sm text-stone-500 hover:text-stone-700 cursor-pointer">
                Ver transcripción original
              </summary>
              <div className="px-4 md:px-5 pb-4">
                <p className="text-sm text-stone-600 bg-stone-100 p-4 rounded-xl font-display italic">
                  "{report.transcripcion_original}"
                </p>
              </div>
            </details>
          )}
        </div>
      )}
    </article>
  );
}
