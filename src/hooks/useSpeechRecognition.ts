import { useCallback, useRef, useEffect } from 'react';
import { useRecordingStore } from '@/stores/recordingStore';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useSpeechRecognition() {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { status, transcript, setStatus, appendTranscript, setError, reset } =
    useRecordingStore();

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionAPI();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'es-ES';

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        appendTranscript(finalTranscript);
      }
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech') {
        return;
      }
      console.error('Speech recognition error:', event.error);
      setError(`Error de reconocimiento: ${event.error}`);
    };

    recognitionRef.current.onend = () => {
      if (status === 'recording') {
        // Restart if still recording
        try {
          recognitionRef.current?.start();
        } catch {
          // Ignore - might already be started
        }
      }
    };

    return () => {
      recognitionRef.current?.abort();
    };
  }, [isSupported, appendTranscript, setError, status]);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) {
      setError('El reconocimiento de voz no está disponible');
      return;
    }

    reset();
    setStatus('recording');

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setError('No se pudo iniciar la grabación');
    }
  }, [reset, setStatus, setError]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      setStatus('idle');
      recognitionRef.current.stop();
    }
  }, [setStatus]);

  return {
    isSupported,
    isRecording: status === 'recording',
    transcript,
    startRecording,
    stopRecording,
    reset,
  };
}
