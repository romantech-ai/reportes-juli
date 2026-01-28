import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Route, Droplets, ChevronDown, ArrowUpRight, Trash2, Calendar, GraduationCap } from 'lucide-react';
import { cn, formatShortDate } from '@/lib/utils';
import { DiagnosticSection } from './DiagnosticSection';
import type { Report } from '@/types/report';

interface ReportCardProps {
  report: Report;
  onDelete?: (id: string) => void;
  expanded?: boolean;
}

export function ReportCard({ report, onDelete, expanded: initialExpanded = false }: ReportCardProps) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const navigate = useNavigate();
  const problemCount = report.diagnostico.problemas_detectados.length;
  const solutionCount = report.diagnostico.soluciones_propuestas.length;

  return (
    <article className="group relative bg-white rounded-2xl card-shadow border border-stone-200 overflow-hidden transition-all hover:shadow-lg">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600" />

      <header className="p-4 md:p-5 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <div className="flex items-center gap-1.5 text-stone-500">
                <Calendar className="h-3.5 w-3.5" />
                <time className="text-xs font-medium">{formatShortDate(report.fecha)}</time>
              </div>
              {report.region && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-md">
                  {report.region}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-stone-500 flex-wrap">
              {report.ciudad_provincia && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />{report.ciudad_provincia}
                </span>
              )}
              {report.rutas.numero_rutas_visitadas > 0 && (
                <span className="flex items-center gap-1.5">
                  <Route className="h-3.5 w-3.5" />{report.rutas.numero_rutas_visitadas} rutas
                </span>
              )}
              {report.volumenes.total_litros > 0 && (
                <span className="flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5" />{report.volumenes.total_litros.toLocaleString('es-ES')} L
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5">
              {problemCount > 0 && (
                <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />{problemCount}
                </span>
              )}
              {solutionCount > 0 && (
                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600" />{solutionCount}
                </span>
              )}
            </div>
            <button className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg transition-all',
              expanded ? 'bg-amber-100 rotate-180' : 'bg-stone-100 group-hover:bg-amber-100'
            )}>
              <ChevronDown className="h-4 w-4 text-stone-600" />
            </button>
          </div>
        </div>
      </header>

      {expanded && (
        <div className="border-t border-stone-200 animate-fade-up">
          <div className="sm:hidden flex items-center gap-2 px-4 py-3 bg-stone-50">
            {problemCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />{problemCount} problemas
              </span>
            )}
            {solutionCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600" />{solutionCount} soluciones
              </span>
            )}
          </div>

          <div className="p-4 md:p-5 space-y-3 stagger-children">
            <DiagnosticSection type="situacion" title="Situación Actual" content={report.diagnostico.situacion_actual} />
            <DiagnosticSection type="problemas" title="Problemas Detectados" content={report.diagnostico.problemas_detectados} />
            <DiagnosticSection type="soluciones" title="Soluciones Propuestas" content={report.diagnostico.soluciones_propuestas} />
            <DiagnosticSection type="oportunidades" title="Oportunidades" content={report.diagnostico.oportunidades} />

            {report.aprendizajes_clave.length > 0 && (
              <div className="bg-stone-100 rounded-xl p-4 border border-stone-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100">
                    <GraduationCap className="h-4 w-4 text-amber-700" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-stone-900 text-sm">Aprendizajes Clave</h4>
                    <p className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Insights</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {report.aprendizajes_clave.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-stone-700">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-600 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <footer className="flex items-center justify-between px-4 md:px-5 py-3 bg-stone-50 border-t border-stone-200">
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/reporte/${report.id}`); }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
            >
              Ver detalle<ArrowUpRight className="h-4 w-4" />
            </button>
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); if (confirm('¿Eliminar?')) onDelete(report.id); }}
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
