import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

interface LiveTranscriptProps {
  transcript: string;
  isRecording: boolean;
  className?: string;
}

export function LiveTranscript({ transcript, isRecording, className }: LiveTranscriptProps) {
  if (!transcript && !isRecording) return null;

  return (
    <div className={cn(
      'relative bg-stone-100/80 rounded-2xl p-5 border border-stone-200 overflow-hidden',
      className
    )}>
      <Quote className="absolute top-3 right-3 h-8 w-8 text-stone-300" strokeWidth={1} />

      <div className="flex items-center gap-2 mb-3">
        <div className={cn(
          'w-2 h-2 rounded-full transition-colors',
          isRecording ? 'bg-orange-500 animate-pulse' : 'bg-stone-400'
        )} />
        <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
          {isRecording ? 'Escuchando...' : 'Transcripción'}
        </span>
      </div>

      <div className="relative min-h-[60px]">
        {transcript ? (
          <p className="text-stone-800 leading-relaxed font-display text-[15px] italic">
            "{transcript}"
          </p>
        ) : (
          <p className="text-stone-500 text-sm italic">
            Comienza a hablar para ver tu transcripción aquí...
          </p>
        )}
        {isRecording && (
          <span className="inline-block w-0.5 h-4 bg-orange-500 ml-1 animate-pulse" />
        )}
      </div>
    </div>
  );
}
