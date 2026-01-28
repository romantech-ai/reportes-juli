import { useState, useCallback } from 'react';
import { processTranscriptWithClaude } from '@/services/claude';
import { useRecordingStore } from '@/stores/recordingStore';
import { useReportStore } from '@/stores/reportStore';
import type { Report } from '@/types/report';

export function useClaudeAPI() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { setStatus, setProcessingProgress, setError } = useRecordingStore();
  const { addReport } = useReportStore();

  const processTranscript = useCallback(
    async (transcript: string, fecha?: string): Promise<Report | null> => {
      if (!transcript.trim()) {
        setError('No hay transcripción para procesar');
        return null;
      }

      setIsProcessing(true);
      setStatus('processing');
      setProcessingProgress(0);

      try {
        const reportDraft = await processTranscriptWithClaude(
          transcript,
          fecha,
          setProcessingProgress
        );

        const report = addReport(reportDraft);
        setStatus('idle');
        setProcessingProgress(100);

        return report;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Error desconocido';
        setError(message);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [addReport, setStatus, setProcessingProgress, setError]
  );

  return {
    isProcessing,
    processTranscript,
  };
}
