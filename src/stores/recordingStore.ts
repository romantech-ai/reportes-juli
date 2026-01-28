import { create } from 'zustand';

type RecordingStatus = 'idle' | 'recording' | 'processing' | 'error';

interface RecordingState {
  status: RecordingStatus;
  transcript: string;
  error: string | null;
  processingProgress: number;
  setStatus: (status: RecordingStatus) => void;
  setTranscript: (transcript: string) => void;
  appendTranscript: (text: string) => void;
  setError: (error: string | null) => void;
  setProcessingProgress: (progress: number) => void;
  reset: () => void;
}

export const useRecordingStore = create<RecordingState>((set) => ({
  status: 'idle',
  transcript: '',
  error: null,
  processingProgress: 0,

  setStatus: (status) => set({ status }),

  setTranscript: (transcript) => set({ transcript }),

  appendTranscript: (text) =>
    set((state) => ({
      transcript: state.transcript ? `${state.transcript} ${text}` : text,
    })),

  setError: (error) => set({ error, status: error ? 'error' : 'idle' }),

  setProcessingProgress: (progress) => set({ processingProgress: progress }),

  reset: () =>
    set({
      status: 'idle',
      transcript: '',
      error: null,
      processingProgress: 0,
    }),
}));
