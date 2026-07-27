/**
 * Rule-based fallback parser for Hindi / English / Hinglish voice commands.
 * Used when Gemini is unavailable or as a fast pre-check before calling the AI.
 * This is intentionally lightweight — geminiService.js handles the "smart" cases.
 */

const CATEGORY_KEYWORDS = {
  Health: ["nahana", "nahana hai", "exercise", "gym", "doctor", "dawai", "yoga", "walk", "jog"],
  Study: ["padhna", "padhai", "exam", "school", "university", "institute", "college", "homework", "assignment"],
  Work: ["office", "meeting", "kaam", "project", "report", "call", "email"],
  Errands: ["khareedna", "milk", "kharidna", "market", "grocery", "shopping", "bazaar"],
  Home: ["ghar", "safai", "cleaning", "kitchen", "laundry"],
  Travel: ["jana hai", "safar", "travel", "trip", "station", "airport", "ticket"],
};

const RECURRING_KEYWORDS = {
  daily: ["roz", "daily", "har din", "everyday", "every day"],
  weekly: ["har hafte", "weekly", "every week"],
  monthly: ["har mahine", "monthly", "every month"],
};

function detectCategory(text) {
  const lower = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return "General";
}

function detectRecurrence(text) {
  const lower = text.toLowerCase();
  for (const [pattern, keywords] of Object.entries(RECURRING_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return { isRecurring: true, recurrencePattern: pattern };
    }
  }
  return { isRecurring: false, recurrencePattern: "none" };
}

function detectTime(text) {
  // Matches patterns like "4:00 baje", "4 baje", "16:30", "5pm"
  const bajePattern = /(\d{1,2})(:\d{2})?\s*baje/i;
  const clockPattern = /(\d{1,2}):(\d{2})\s*(am|pm)?/i;
  const meridiemPattern = /(\d{1,2})\s*(am|pm)/i;

  let match = text.match(bajePattern) || text.match(clockPattern) || text.match(meridiemPattern);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const minute = match[2] && match[2].startsWith(":") ? parseInt(match[2].slice(1), 10) : 0;
  const meridiem = (match[3] || "").toLowerCase();

  if (meridiem === "pm" && hour < 12) hour += 12;
  if (meridiem === "am" && hour === 12) hour = 0;

  const now = new Date();
  const due = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
  if (due < now) due.setDate(due.getDate() + 1); // if time already passed today, assume tomorrow
  return due;
}

function detectLanguage(text) {
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  if (hasDevanagari) return "hi";
  const hinglishWords = ["hai", "karo", "mujhe", "jana", "baje", "roz", "ghar"];
  const lower = text.toLowerCase();
  if (hinglishWords.some((w) => lower.includes(w))) return "hinglish";
  return "en";
}

function parseCommand(rawText) {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  const indexMatch = lower.match(/task\s*(\d+)/);
  const taskIndex = indexMatch ? parseInt(indexMatch[1], 10) : null;

  let intent = "add";

  if (/^(naya|new|add)\s*task/.test(lower) || /naya task/.test(lower)) {
    intent = "add";
  } else if (/delete|remove|hatao|hataao/.test(lower)) {
    intent = "delete";
  } else if (/mark|complete|done|pura|poora|complete karo/.test(lower)) {
    intent = "complete";
  } else if (/kya|what|show|list|kitne|how many/.test(lower)) {
    intent = "query";
  } else {
    intent = "add";
  }

  let taskText = text
    .replace(/^(naya|new|add)\s*task/i, "")
    .replace(/^task\s*\d+/i, "")
    .replace(/delete|remove|mark|complete|done/gi, "")
    .trim();

  if (!taskText) taskText = text;

  return {
    intent,
    taskIndex,
    taskText,
    category: detectCategory(text),
    dueDate: detectTime(text),
    language: detectLanguage(text),
    ...detectRecurrence(text),
  };
}

module.exports = { parseCommand, detectCategory, detectRecurrence, detectTime, detectLanguage };
