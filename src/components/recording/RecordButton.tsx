import { Mic, Square } from 'lucide-react';

interface RecordButtonProps {
  isRecording: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function RecordButton({ isRecording, onClick, disabled }: RecordButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-24 h-24 rounded-full flex items-center justify-center transition-all
        ${isRecording
          ? 'bg-red-500 text-white animate-pulse-ring'
          : 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-10 h-10" />}
    </button>
  );
}
