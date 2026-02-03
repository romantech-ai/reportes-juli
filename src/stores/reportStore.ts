import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Report, ReportDraft } from '@/types/report';
import { generateId, getWeekRange, getTodayISO } from '@/lib/utils';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  fetchReports,
  saveReport,
  deleteReportRemote,
  subscribeToChanges,
  unsubscribeFromChanges,
  migrateLocalReports,
  type SyncStatus,
} from '@/services/syncService';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface ReportState {
  reports: Report[];
  syncStatus: SyncStatus;
  lastSyncAt: string | null;
  isLoadingRemote: boolean;
  realtimeChannel: RealtimeChannel | null;

  // CRUD operations
  addReport: (draft: ReportDraft) => Promise<Report>;
  updateReport: (id: string, updates: Partial<Report>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  cloneReport: (id: string) => Report | undefined;

  // Queries
  getReportById: (id: string) => Report | undefined;
  getReportsByZona: (zona: string) => Report[];
  getReportsByWeek: (weekNumber: number) => Report[];

  // Sync operations
  loadFromRemote: () => Promise<void>;
  migrateLocalData: (onProgress?: (current: number, total: number) => void) => Promise<void>;
  setupRealtimeSync: () => void;
  cleanupRealtimeSync: () => void;
  setSyncStatus: (status: SyncStatus) => void;

  // Helpers
  hasLocalOnlyReports: () => boolean;
  getLocalOnlyReportsCount: () => number;
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
      syncStatus: isSupabaseConfigured() ? 'offline' : 'offline',
      lastSyncAt: null,
      isLoadingRemote: false,
      realtimeChannel: null,

      addReport: async (draft: ReportDraft) => {
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

        // Add locally first
        set((state) => ({
          reports: [newReport, ...state.reports],
        }));

        // Try to sync with Supabase
        if (isSupabaseConfigured()) {
          set({ syncStatus: 'syncing' });
          try {
            const syncedReport = await saveReport(newReport);
            // Update local report with remote_id
            set((state) => ({
              reports: state.reports.map((r) =>
                r.id === newReport.id ? { ...r, remote_id: syncedReport.remote_id } : r
              ),
              syncStatus: 'synced',
              lastSyncAt: new Date().toISOString(),
            }));
            return syncedReport;
          } catch (error) {
            console.error('Failed to sync new report:', error);
            set({ syncStatus: 'error' });
          }
        }

        return newReport;
      },

      updateReport: async (id: string, updates: Partial<Report>) => {
        const report = get().reports.find((r) => r.id === id);
        if (!report) return;

        const updatedReport = {
          ...report,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        // Update locally first
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id ? updatedReport : r
          ),
        }));

        // Try to sync with Supabase
        if (isSupabaseConfigured() && report.remote_id) {
          set({ syncStatus: 'syncing' });
          try {
            await saveReport(updatedReport);
            set({
              syncStatus: 'synced',
              lastSyncAt: new Date().toISOString(),
            });
          } catch (error) {
            console.error('Failed to sync update:', error);
            set({ syncStatus: 'error' });
          }
        }
      },

      deleteReport: async (id: string) => {
        const report = get().reports.find((r) => r.id === id);
        if (!report) return;

        // Delete locally first
        set((state) => ({
          reports: state.reports.filter((r) => r.id !== id),
        }));

        // Try to delete from Supabase
        if (isSupabaseConfigured() && report.remote_id) {
          set({ syncStatus: 'syncing' });
          try {
            await deleteReportRemote(report.remote_id);
            set({
              syncStatus: 'synced',
              lastSyncAt: new Date().toISOString(),
            });
          } catch (error) {
            console.error('Failed to sync delete:', error);
            set({ syncStatus: 'error' });
          }
        }
      },

      cloneReport: (id: string) => {
        const report = get().reports.find((r) => r.id === id);
        if (!report) return undefined;

        const now = new Date().toISOString();
        const clonedReport: Report = {
          ...report,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          remote_id: undefined, // Will be assigned when synced
          portada: {
            ...report.portada,
            zona: `${report.portada.zona} (copia)`,
          },
        };

        // Add locally
        set((state) => ({
          reports: [clonedReport, ...state.reports],
        }));

        // Sync in background
        if (isSupabaseConfigured()) {
          saveReport(clonedReport)
            .then((synced) => {
              set((state) => ({
                reports: state.reports.map((r) =>
                  r.id === clonedReport.id ? { ...r, remote_id: synced.remote_id } : r
                ),
              }));
            })
            .catch(console.error);
        }

        return clonedReport;
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

      loadFromRemote: async () => {
        if (!isSupabaseConfigured()) return;

        set({ isLoadingRemote: true, syncStatus: 'syncing' });

        try {
          const remoteReports = await fetchReports();
          const localReports = get().reports;

          // Merge: remote reports take precedence, keep local-only reports
          const remoteIds = new Set(remoteReports.map((r) => r.remote_id));
          const localOnlyReports = localReports.filter(
            (r) => !r.remote_id || !remoteIds.has(r.remote_id)
          );

          // Update local reports with remote data if they exist
          const mergedReports = [
            ...remoteReports,
            ...localOnlyReports.filter((r) => !r.remote_id),
          ].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          set({
            reports: mergedReports,
            isLoadingRemote: false,
            syncStatus: 'synced',
            lastSyncAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Failed to load from remote:', error);
          set({ isLoadingRemote: false, syncStatus: 'error' });
        }
      },

      migrateLocalData: async (onProgress) => {
        if (!isSupabaseConfigured()) return;

        const localReports = get().reports;
        const reportsToMigrate = localReports.filter((r) => !r.remote_id);

        if (reportsToMigrate.length === 0) return;

        set({ syncStatus: 'syncing' });

        try {
          const migratedReports = await migrateLocalReports(
            localReports,
            onProgress
          );

          set({
            reports: migratedReports.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ),
            syncStatus: 'synced',
            lastSyncAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Migration failed:', error);
          set({ syncStatus: 'error' });
        }
      },

      setupRealtimeSync: () => {
        if (!isSupabaseConfigured()) return;

        const channel = subscribeToChanges(
          // On insert from another device
          (report) => {
            set((state) => {
              // Check if we already have this report
              const exists = state.reports.some(
                (r) => r.remote_id === report.remote_id
              );
              if (exists) return state;

              return {
                reports: [report, ...state.reports],
                lastSyncAt: new Date().toISOString(),
              };
            });
          },
          // On update from another device
          (report) => {
            set((state) => ({
              reports: state.reports.map((r) =>
                r.remote_id === report.remote_id ? { ...r, ...report } : r
              ),
              lastSyncAt: new Date().toISOString(),
            }));
          },
          // On delete from another device
          (remoteId) => {
            set((state) => ({
              reports: state.reports.filter((r) => r.remote_id !== remoteId),
              lastSyncAt: new Date().toISOString(),
            }));
          }
        );

        set({ realtimeChannel: channel });
      },

      cleanupRealtimeSync: () => {
        const channel = get().realtimeChannel;
        if (channel) {
          unsubscribeFromChanges(channel);
          set({ realtimeChannel: null });
        }
      },

      setSyncStatus: (status: SyncStatus) => set({ syncStatus: status }),

      hasLocalOnlyReports: () => {
        return get().reports.some((r) => !r.remote_id);
      },

      getLocalOnlyReportsCount: () => {
        return get().reports.filter((r) => !r.remote_id).length;
      },
    }),
    {
      name: 'julian-reports-storage',
      partialize: (state) => ({
        reports: state.reports,
        lastSyncAt: state.lastSyncAt,
      }),
    }
  )
);
