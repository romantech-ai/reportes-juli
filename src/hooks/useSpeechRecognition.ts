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
  const isRecordingRef = useRef(false); // Use ref to avoid stale closure
  const { status, transcript, setStatus, appendTranscript, setError, reset } =
    useRecordingStore();

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Initialize speech recognition once
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';

    recognition.onstart = () => {
      console.log('Speech recognition service started');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('Got speech result, results count:', event.results.length);
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        const confidence = result[0].confidence;
        console.log(`Result ${i}: "${text}" (final: ${result.isFinal}, confidence: ${confidence})`);

        if (result.isFinal) {
          finalTranscript += text;
        }
      }

      if (finalTranscript) {
        console.log('Appending final transcript:', finalTranscript);
        appendTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error, event.message);

      if (event.error === 'no-speech') {
        console.log('No speech detected - this is normal during silence');
        return; // Don't show error for no-speech
      }

      const errorMessages: Record<string, string> = {
        'audio-capture': 'No se detectó micrófono. Verifica que esté conectado.',
        'not-allowed': 'Permiso de micrófono denegado. Habilítalo en configuración.',
        'network': 'Error de red. Verifica tu conexión a internet.',
        'aborted': '', // Ignore - user stopped
        'service-not-allowed': 'Servicio no disponible. Usa Chrome o Edge.',
      };

      const message = errorMessages[event.error];
      if (message) {
        setError(message);
      } else if (event.error !== 'aborted') {
        setError(`Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended, isRecordingRef:', isRecordingRef.current);
      if (isRecordingRef.current) {
        // Restart if still recording
        console.log('Restarting speech recognition...');
        try {
          recognition.start();
        } catch (e) {
          console.log('Restart failed:', e);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [isSupported, appendTranscript, setError]); // Remove status from dependencies

  const startRecording = useCallback(async () => {
    if (!recognitionRef.current) {
      setError('El reconocimiento de voz no está disponible');
      return;
    }

    // Check microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      console.log('Microphone permission granted');
    } catch (err) {
      console.error('Microphone permission error:', err);
      setError('Permiso de micrófono denegado. Habilítalo en la configuración del navegador.');
      return;
    }

    reset();
    isRecordingRef.current = true; // Set ref before starting
    setStatus('recording');

    try {
      recognitionRef.current.start();
      console.log('Speech recognition started');
    } catch (error) {
      console.error('Error starting recognition:', error);
      isRecordingRef.current = false;
      setError('No se pudo iniciar la grabación. Intenta recargar la página.');
    }
  }, [reset, setStatus, setError]);

  const stopRecording = useCallback(() => {
    console.log('Stopping recording');
    isRecordingRef.current = false; // Set ref before stopping
    setStatus('idle');
    if (recognitionRef.current) {
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
