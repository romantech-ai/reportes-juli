import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Report, ReportDraft } from '@/types/report';
import { generateId } from '@/lib/utils';

interface ReportState {
  reports: Report[];
  addReport: (draft: ReportDraft) => Report;
  updateReport: (id: string, updates: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  getReportById: (id: string) => Report | undefined;
  getReportsByDate: (date: string) => Report[];
  getReportsByWeek: (weekNumber: number) => Report[];
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [],

      addReport: (draft: ReportDraft) => {
        const now = new Date().toISOString();
        const newReport: Report = {
          ...draft,
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

      getReportsByDate: (date: string) => {
        return get().reports.filter((report) => report.fecha === date);
      },

      getReportsByWeek: (weekNumber: number) => {
        const startDate = new Date('2025-01-27');
        const weekStart = new Date(startDate);
        weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        return get().reports.filter((report) => {
          const reportDate = new Date(report.fecha);
          return reportDate >= weekStart && reportDate <= weekEnd;
        });
      },
    }),
    {
      name: 'julian-reports-storage',
    }
  )
);
