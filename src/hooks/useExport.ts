import { useCallback, useState } from 'react';
import { exportReportToPDF } from '@/services/pdfExport';
import { exportReportsToExcel, exportSingleReportToExcel } from '@/services/excelExport';
import type { Report } from '@/types/report';

type ExportFormat = 'pdf' | 'excel';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportReport = useCallback(
    async (report: Report, format: ExportFormat) => {
      setIsExporting(true);
      setError(null);

      try {
        if (format === 'pdf') {
          await exportReportToPDF(report);
        } else {
          exportSingleReportToExcel(report);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al exportar';
        setError(message);
        throw err;
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  const exportMultipleReports = useCallback(
    async (reports: Report[], filename?: string) => {
      setIsExporting(true);
      setError(null);

      try {
        exportReportsToExcel(reports, filename);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al exportar';
        setError(message);
        throw err;
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return {
    exportReport,
    exportMultipleReports,
    isExporting,
    error,
  };
}
