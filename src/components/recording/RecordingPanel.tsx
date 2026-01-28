import { useState } from 'react';
import { Loader2, Sparkles, AlertCircle, RotateCcw } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useClaudeAPI } from '@/hooks/useClaudeAPI';
import { useRecordingStore } from '@/stores/recordingStore';
import { RecordButton } from './RecordButton';
import { WaveformIndicator } from './WaveformIndicator';
import { LiveTranscript } from './LiveTranscript';
import { DatePicker } from '@/components/ui/DatePicker';
import { getTodayISO } from '@/lib/utils';

interface RecordingPanelProps {
  onReportCreated?: (reportId: string) => void;
}

export function RecordingPanel({ onReportCreated }: RecordingPanelProps) {
  const { isSupported, isRecording, transcript, startRecording, stopRecording, reset } = useSpeechRecognition();
  const { isProcessing, processTranscript } = useClaudeAPI();
  const { status, error, processingProgress } = useRecordingStore();
  const [selectedDate, setSelectedDate] = useState(getTodayISO());

  const handleRecordToggle = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handleProcess = async () => {
    const report = await processTranscript(transcript, selectedDate);
    if (report) {
      onReportCreated?.(report.id);
      reset();
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
        <div className="flex items-start gap-3 text-yellow-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-stone-800">Navegador no compatible</p>
            <p className="text-sm text-stone-600 mt-1">Usa Chrome o Edge para el reconocimiento de voz.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative bg-stone-50 rounded-3xl p-6 md:p-8 card-shadow border border-stone-200 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#92400e" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative flex flex-col items-center gap-6">
          {/* Date Picker */}
          <div className="w-full max-w-xs">
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              label="Fecha del reporte"
            />
          </div>

          {/* Recording */}
          <div className="flex flex-col items-center gap-5 pt-4 pb-2">
            <RecordButton isRecording={isRecording} onClick={handleRecordToggle} disabled={isProcessing} />
            <div className="h-12 flex items-center">
              <WaveformIndicator isActive={isRecording} />
            </div>
            <p className="text-sm text-stone-500 text-center max-w-[200px]">
              {isRecording ? 'Toca para detener' : 'Toca para grabar tu reporte'}
            </p>
          </div>

          <LiveTranscript transcript={transcript} isRecording={isRecording} className="w-full" />

          {/* Processing */}
          {status === 'processing' && (
            <div className="w-full space-y-4 animate-fade-up">
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <Loader2 className="h-5 w-5 animate-spin text-amber-700" />
                  <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 animate-pulse" />
                </div>
                <span className="text-sm font-medium text-stone-700">Estructurando con IA...</span>
              </div>
              <div className="progress-elegant h-2">
                <div className="progress-elegant-bar h-full" style={{ width: `${processingProgress}%` }} />
              </div>
              <p className="text-xs text-center text-stone-500">Analizando y extrayendo información</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="w-full flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl animate-fade-up">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-stone-800">Error</p>
                <p className="text-sm text-stone-600">{error}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {transcript && !isRecording && status !== 'processing' && (
            <div className="flex items-center gap-3 w-full animate-fade-up">
              <button
                onClick={reset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="font-medium text-sm">Reiniciar</span>
              </button>
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium text-sm hover:from-amber-700 hover:to-amber-800 transition-all disabled:opacity-50 card-shadow"
              >
                <Sparkles className="h-4 w-4" />
                <span>Procesar con IA</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-600/30 rounded-tl-2xl -translate-x-1 -translate-y-1" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-600/30 rounded-tr-2xl translate-x-1 -translate-y-1" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-600/30 rounded-bl-2xl -translate-x-1 translate-y-1" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-600/30 rounded-br-2xl translate-x-1 translate-y-1" />
    </div>
  );
}
