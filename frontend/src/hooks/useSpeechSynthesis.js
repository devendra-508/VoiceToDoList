import { useCallback } from "react";

/**
 * Lets the app "talk back" — e.g. answering "kitne task bache hain?" out loud.
 */
export function useSpeechSynthesis() {
  const speak = useCallback((text, lang = "hi-IN") => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  return { speak, cancel };
}
