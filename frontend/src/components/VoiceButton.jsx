import React, { useEffect, useState } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import { useTodos } from "../context/TodoContext";
import { EXAMPLE_COMMANDS } from "../utils/voiceCommands";

export default function VoiceButton() {
  const { listening, transcript, error, supported, startListening } = useSpeechRecognition({
    lang: "en-IN",
  });
  const { speak } = useSpeechSynthesis();
  const { runVoiceCommand } = useTodos();
  const [status, setStatus] = useState("");
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    if (!transcript) return;

    (async () => {
      setStatus(`Heard: "${transcript}" — processing...`);
      try {
        const result = await runVoiceCommand(transcript);
        setLastResult(result);

        if (result.action === "created") {
          setStatus(`✅ Added: "${result.todo.text}"`);
          speak(`Task added: ${result.todo.text}`);
        } else if (result.action === "deleted") {
          setStatus(`🗑️ Deleted: "${result.todo.text}"`);
          speak("Task deleted");
        } else if (result.action === "completed") {
          setStatus(`✔️ Completed: "${result.todo.text}"`);
          speak("Task marked complete");
        } else if (result.action === "query") {
          setStatus(result.message);
          speak(result.message);
        } else {
          setStatus(result.message || "Sorry, could not understand that command.");
        }
      } catch (err) {
        setStatus("Something went wrong processing that command.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  if (!supported) {
    return (
      <p className="text-center text-sm text-red-500">
        Voice recognition isn't supported in this browser. Try Chrome.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={startListening}
        disabled={listening}
        className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow transition ${
          listening ? "bg-red-500 animate-pulse" : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        🎤 {listening ? "Listening..." : "Start Listening"}
      </button>

      {status && <p className="max-w-md text-center text-sm text-slate-600">{status}</p>}
      {error && <p className="text-sm text-red-500">Mic error: {error}</p>}

      <div className="mt-2 max-w-md text-center text-xs text-brand-700">
        <p className="mb-1 font-semibold">Example commands:</p>
        <ul className="space-y-0.5">
          {EXAMPLE_COMMANDS.map((c) => (
            <li key={c.text}>"{c.text}" — {c.desc}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
