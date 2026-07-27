const fetch = require("node-fetch");
const geminiConfig = require("../config/gemini");
const { parseCommand } = require("../utils/speechParser");

const SYSTEM_INSTRUCTION = `You are a voice-command parser for a bilingual (Hindi/English/Hinglish) TODO app.
Given a raw speech transcript, extract structured intent as STRICT JSON only — no markdown, no explanation.

Return exactly this shape:
{
  "intent": "add" | "delete" | "complete" | "query" | "unknown",
  "taskIndex": number | null,
  "taskText": string,
  "category": "Health" | "Study" | "Work" | "Errands" | "Home" | "Travel" | "General",
  "priority": "low" | "medium" | "high",
  "isRecurring": boolean,
  "recurrencePattern": "none" | "daily" | "weekly" | "monthly",
  "dueTime": string | null,   // e.g. "16:00" in 24hr format, or null if no time mentioned
  "language": "en" | "hi" | "hinglish"
}

Rules:
- "naya task X" / "add task X" / "new task X" -> intent "add", taskText is X (cleaned, no filler words)
- "delete task N" / "task N delete karo" -> intent "delete", taskIndex N
- "mark task N" / "task N complete karo" / "task N done" -> intent "complete", taskIndex N
- "kitne task bache hain" / "what's pending today" -> intent "query"
- Detect category from context (nahana/exercise/gym -> Health, padhna/exam/school -> Study, office/meeting -> Work, milk/market/grocery -> Errands, ghar ki safai -> Home, jana/safar/travel -> Travel, else General)
- Detect recurrence from words like "roz", "daily", "har hafte", "weekly", "har mahine", "monthly"
- Extract time mentions like "4:00 baje", "5pm", "16:30" into 24hr "HH:MM" format in dueTime, else null
- Respond with ONLY the JSON object, nothing else.`;

async function callGemini(transcript) {
  if (!geminiConfig.apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const url = `${geminiConfig.baseUrl}/${geminiConfig.model}:generateContent?key=${geminiConfig.apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nTranscript: "${transcript}"` }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");

  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

/**
 * parseVoiceCommand: tries Gemini first for high-quality NLU (handles free-form
 * Hindi/English/Hinglish speech well). Falls back to the local rule-based parser
 * if Gemini is not configured or the call fails, so the app keeps working offline.
 */
async function parseVoiceCommand(transcript) {
  try {
    const parsed = await callGemini(transcript);
    return { ...parsed, source: "gemini" };
  } catch (err) {
    console.warn("Gemini parse failed, falling back to rule-based parser:", err.message);
    const fallback = parseCommand(transcript);
    return {
      intent: fallback.intent,
      taskIndex: fallback.taskIndex,
      taskText: fallback.taskText,
      category: fallback.category,
      priority: "medium",
      isRecurring: fallback.isRecurring,
      recurrencePattern: fallback.recurrencePattern,
      dueTime: fallback.dueDate
        ? `${String(fallback.dueDate.getHours()).padStart(2, "0")}:${String(
            fallback.dueDate.getMinutes()
          ).padStart(2, "0")}`
        : null,
      language: fallback.language,
      source: "fallback",
    };
  }
}

module.exports = { parseVoiceCommand };
