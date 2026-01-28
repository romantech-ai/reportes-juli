import { FileText, Table, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useExport } from '@/hooks/useExport';
import type { Report } from '@/types/report';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report?: Report;
  reports?: Report[];
}

export function ExportModal({
  open,
  onOpenChange,
  report,
  reports,
}: ExportModalProps) {
  const { exportReport, exportMultipleReports, isExporting, error } = useExport();

  const handleExportPDF = async () => {
    if (report) {
      await exportReport(report, 'pdf');
      onOpenChange(false);
    }
  };

  const handleExportExcel = async () => {
    if (report) {
      await exportReport(report, 'excel');
      onOpenChange(false);
    } else if (reports && reports.length > 0) {
      await exportMultipleReports(reports);
      onOpenChange(false);
    }
  };

  const title = report
    ? 'Exportar Reporte'
    : `Exportar ${reports?.length || 0} Reportes`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Selecciona el formato de exportación
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {report && (
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-6"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="h-8 w-8 animate-spin text-danger" />
              ) : (
                <FileText className="h-8 w-8 text-danger" />
              )}
              <span className="font-medium">PDF</span>
              <span className="text-xs text-muted">Documento formateado</span>
            </Button>
          )}

          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-6"
            onClick={handleExportExcel}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-8 w-8 animate-spin text-success" />
            ) : (
              <Table className="h-8 w-8 text-success" />
            )}
            <span className="font-medium">Excel</span>
            <span className="text-xs text-muted">Hojas de cálculo</span>
          </Button>
        </div>

        {error && (
          <p className="text-sm text-danger text-center">{error}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
