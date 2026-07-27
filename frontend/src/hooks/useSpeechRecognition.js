import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Wraps the browser's SpeechRecognition API. Defaults to Hindi (hi-IN) so
 * Hinglish phrases like "mujhe ghar jana hai" transcribe reliably, but the
 * language can be switched at call time.
 */
export function useSpeechRecognition({ lang = "hi-IN" } = {}) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };
    recognition.onerror = (event) => setError(event.error);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;

    return () => recognition.abort();
  }, [lang]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    setTranscript("");
    setListening(true);
    recognitionRef.current.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, transcript, error, supported, startListening, stopListening, setTranscript };
}
