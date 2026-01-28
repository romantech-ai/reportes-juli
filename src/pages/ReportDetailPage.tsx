import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout';
import { ReportDetail } from '@/components/report';
import { ExportModal } from '@/components/export';
import { useReportStore } from '@/stores/reportStore';
import type { Report } from '@/types/report';

export function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getReportById, updateReport } = useReportStore();
  const [showExportModal, setShowExportModal] = useState(false);

  const report = id ? getReportById(id) : undefined;

  if (!report) {
    return <Navigate to="/reportes" replace />;
  }

  const handleUpdate = (updates: Partial<Report>) => {
    updateReport(report.id, updates);
  };

  return (
    <PageContainer>
      <ReportDetail
        report={report}
        onUpdate={handleUpdate}
        onExport={() => setShowExportModal(true)}
      />

      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        report={report}
      />
    </PageContainer>
  );
}
