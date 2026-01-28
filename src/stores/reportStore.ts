import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Report, ReportDraft } from '@/types/report';
import { generateId, getWeekRange, getTodayISO } from '@/lib/utils';

interface ReportState {
  reports: Report[];
  addReport: (draft: ReportDraft) => Report;
  updateReport: (id: string, updates: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  getReportById: (id: string) => Report | undefined;
  getReportsByZona: (zona: string) => Report[];
  getReportsByWeek: (weekNumber: number) => Report[];
}

// Default values for a new report
const getDefaultReportDraft = (): ReportDraft => ({
  transcripcion_original: '',
  portada: {
    zona: '',
    semana: getWeekRange(),
    fecha: getTodayISO(),
    fabricas: [],
    responsable: 'Julián',
    objetivo: '',
  },
  foto_zona: {
    litros_mes: 0,
    fabricas_destino: '',
    peso_estrategico: '',
  },
  rutas: {
    num_rutas: 0,
    litros_medios_ruta: 0,
    distancia_media_km: 0,
    solapes: '',
    eficiencia: '',
  },
  volumenes: {
    volumen_contratado: 0,
    volumen_real: 0,
    pct_contratos_largos: 0,
    concentracion_ganaderos: '',
  },
  calidad: {
    calidad_media: '',
    incidencias: '',
    impacto_estacional: '',
  },
  riesgos: [],
  oportunidades: [],
  cierre_ejecutivo: '',
  notas_adicionales: '',
});

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [],

      addReport: (draft: ReportDraft) => {
        const now = new Date().toISOString();
        const defaults = getDefaultReportDraft();
        const newReport: Report = {
          // Merge defaults with provided draft
          ...defaults,
          ...draft,
          portada: { ...defaults.portada, ...draft.portada },
          foto_zona: { ...defaults.foto_zona, ...draft.foto_zona },
          rutas: { ...defaults.rutas, ...draft.rutas },
          volumenes: { ...defaults.volumenes, ...draft.volumenes },
          calidad: { ...defaults.calidad, ...draft.calidad },
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          reports: [newReport, ...state.reports],
        }));
        return newReport;
      },

      updateReport: (id: string, updates: Partial<Report>) => {
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === id
              ? { ...report, ...updates, updatedAt: new Date().toISOString() }
              : report
          ),
        }));
      },

      deleteReport: (id: string) => {
        set((state) => ({
          reports: state.reports.filter((report) => report.id !== id),
        }));
      },

      getReportById: (id: string) => {
        return get().reports.find((report) => report.id === id);
      },

      getReportsByZona: (zona: string) => {
        return get().reports.filter((report) =>
          report.portada.zona.toLowerCase().includes(zona.toLowerCase())
        );
      },

      getReportsByWeek: (weekNumber: number) => {
        const startDate = new Date('2025-01-27');
        const weekStart = new Date(startDate);
        weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        return get().reports.filter((report) => {
          const reportDate = new Date(report.createdAt);
          return reportDate >= weekStart && reportDate <= weekEnd;
        });
      },
    }),
    {
      name: 'julian-reports-storage',
    }
  )
);
