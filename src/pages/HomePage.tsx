import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, Sparkles, Mic, PenLine } from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { RecordingPanel } from '@/components/recording';
import { ReportCard, ManualReportForm } from '@/components/report';
import { useReportStore } from '@/stores/reportStore';
import { cn } from '@/lib/utils';

type InputMode = 'voice' | 'manual';

export function HomePage() {
  const navigate = useNavigate();
  const { reports, deleteReport, cloneReport } = useReportStore();
  const [inputMode, setInputMode] = useState<InputMode>('voice');
  const latestReport = reports[0];

  return (
    <PageContainer className="pb-24">
      <div className="space-y-8">
        {/* Hero */}
        <section className="relative pt-4 pb-6 animate-fade-up">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-transparent rounded-full blur-2xl" />
          <div className="relative">
            <p className="text-sm font-medium text-amber-700 mb-1 tracking-wide">Buenos días</p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-stone-900 tracking-tight mb-2">Julián</h1>
            <p className="text-stone-500">Jefe Supremo</p>
          </div>
        </section>

        {/* New Report Section */}
        <section className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-stone-900">Nuevo Reporte</h2>
              <p className="text-sm text-stone-500">
                {inputMode === 'voice' ? 'Graba tu resumen de visita de zona' : 'Completa el formulario manualmente'}
              </p>
            </div>
            {inputMode === 'voice' && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">IA</span>
              </div>
            )}
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-1 p-1 bg-stone-100 rounded-xl mb-4">
            <button
              onClick={() => setInputMode('voice')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                inputMode === 'voice'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              )}
            >
              <Mic className="h-4 w-4" />
              Grabar voz
            </button>
            <button
              onClick={() => setInputMode('manual')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                inputMode === 'manual'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              )}
            >
              <PenLine className="h-4 w-4" />
              Escribir manual
            </button>
          </div>

          {/* Content based on mode */}
          {inputMode === 'voice' ? (
            <RecordingPanel onReportCreated={(id) => navigate(`/reporte/${id}`)} />
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-4 md:p-6 card-shadow">
              <ManualReportForm
                onSuccess={(id) => navigate(`/reporte/${id}`)}
                onCancel={() => setInputMode('voice')}
              />
            </div>
          )}
        </section>

        {/* Latest Report */}
        {latestReport && (
          <section className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-stone-900">Último Reporte</h2>
                <p className="text-sm text-stone-500">Tu registro más reciente</p>
              </div>
              <button
                onClick={() => navigate('/reportes')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
              >
                Ver todos<ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <ReportCard
              report={latestReport}
              onDelete={deleteReport}
              onClone={cloneReport}
            />
          </section>
        )}

        {/* Empty State */}
        {reports.length === 0 && (
          <section className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative bg-stone-50 rounded-3xl p-8 md:p-12 text-center border border-stone-200 overflow-hidden">
              <div className="absolute inset-0 opacity-[0.02]">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="1" fill="#92400e" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
              </div>
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-50 border border-stone-200 flex items-center justify-center card-shadow">
                  <FileText className="h-9 w-9 text-amber-700" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl font-semibold text-stone-800 mb-2">Sin reportes aún</h3>
                <p className="text-stone-500 max-w-sm mx-auto mb-6">
                  Graba tu primer reporte de visita de zona y la IA lo estructurará automáticamente en formato ejecutivo.
                </p>
                <div className="flex justify-center">
                  <svg width="40" height="60" viewBox="0 0 40 60" className="text-amber-600/40">
                    <path d="M20 0 L20 45 M10 35 L20 48 L30 35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-bounce" />
                  </svg>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Quick Stats */}
        {reports.length > 1 && (
          <section className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 border border-stone-200 card-shadow text-center">
                <p className="font-display text-2xl font-semibold text-amber-700">{reports.length}</p>
                <p className="text-xs text-stone-500 mt-1">Reportes</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-stone-200 card-shadow text-center">
                <p className="font-display text-2xl font-semibold text-green-700">
                  {reports.reduce((sum, r) => sum + r.rutas.num_rutas, 0)}
                </p>
                <p className="text-xs text-stone-500 mt-1">Rutas</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-stone-200 card-shadow text-center">
                <p className="font-display text-2xl font-semibold text-slate-700">
                  {Math.round(reports.reduce((sum, r) => sum + r.foto_zona.litros_mes, 0) / 1000)}k
                </p>
                <p className="text-xs text-stone-500 mt-1">Litros</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </PageContainer>
  );
}
