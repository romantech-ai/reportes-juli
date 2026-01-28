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

    recognitionRef.current.onstart = () => {
      console.log('Speech recognition service started');
    };

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      console.log('Got speech result, results count:', event.results.length);
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        console.log(`Result ${i}: "${transcript}" (final: ${result.isFinal}, confidence: ${confidence})`);

        if (result.isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript) {
        console.log('Appending final transcript:', finalTranscript);
        appendTranscript(finalTranscript);
      }
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error, event.message);

      // Always log for debugging
      if (event.error === 'no-speech') {
        console.log('No speech detected - this is normal during silence');
      }

      const errorMessages: Record<string, string> = {
        'no-speech': '', // Ignore - no speech detected
        'audio-capture': 'No se detectó micrófono. Verifica que esté conectado.',
        'not-allowed': 'Permiso de micrófono denegado. Habilítalo en configuración.',
        'network': 'Error de red. Verifica tu conexión a internet.',
        'aborted': '', // Ignore - user stopped
        'service-not-allowed': 'Servicio no disponible. Usa Chrome o Edge.',
      };

      const message = errorMessages[event.error];
      if (message) {
        setError(message);
      } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(`Error: ${event.error}`);
      }
    };

    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended, status:', status);
      if (status === 'recording') {
        // Restart if still recording
        console.log('Restarting speech recognition...');
        try {
          recognitionRef.current?.start();
        } catch (e) {
          console.log('Restart failed (normal if already running):', e);
        }
      }
    };

    return () => {
      recognitionRef.current?.abort();
    };
  }, [isSupported, appendTranscript, setError, status]);

  const startRecording = useCallback(async () => {
    if (!recognitionRef.current) {
      setError('El reconocimiento de voz no está disponible');
      return;
    }

    // Check microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Release immediately
      console.log('Microphone permission granted');
    } catch (err) {
      console.error('Microphone permission error:', err);
      setError('Permiso de micrófono denegado. Habilítalo en la configuración del navegador.');
      return;
    }

    reset();
    setStatus('recording');

    try {
      recognitionRef.current.start();
      console.log('Speech recognition started');
    } catch (error) {
      console.error('Error starting recognition:', error);
      setError('No se pudo iniciar la grabación. Intenta recargar la página.');
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
