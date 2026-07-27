# 🎙️ Voice TODO App — AI-Powered Bilingual Task Assistant

A voice-controlled TODO app that understands natural Hindi/English/Hinglish speech
(e.g. *"mujhe 4:00 baje nahana hai"*, *"roz subah exercise karna hai"*) and turns
it into real, structured tasks — with automatic category detection, due-time
extraction, recurring task detection, real-time multi-device sync, and analytics.

## ✨ What makes this different from a typical TODO app

- **True voice understanding, not just transcription** — the backend sends the
  raw speech transcript to **Gemini** to extract intent (add/delete/complete/query),
  task text, category, due time, and recurrence — all from free-form Hinglish speech.
  Falls back to a local rule-based parser (`utils/speechParser.js`) if Gemini is
  unavailable, so voice commands keep working offline.
- **Auto-categorization** — tasks are tagged Health / Study / Work / Errands /
  Home / Travel / General automatically from context, no manual tagging.
- **Recurring task detection** — "roz", "daily", "har hafte" etc. are detected
  and stored as recurring tasks.
- **Time/reminder extraction** — "4:00 baje", "5pm" etc. are parsed into an
  actual due date/time.
- **Voice queries** — ask "kitne task bache hain?" and the app speaks the answer
  back using the Web Speech Synthesis API.
- **Real-time sync** — Socket.io keeps every open tab/device for a user in sync
  instantly when a task is added/completed/deleted (including via voice).
- **Analytics dashboard** — completion rate, category breakdown, weekly trend
  charts (Recharts).
- **Calendar view** — tasks with due dates/times are plotted on a monthly calendar.

## Project structure

```
voice-todo-app/
├── frontend/    React + Vite + Tailwind
└── backend/     Node + Express + MongoDB + Socket.io + Gemini
```

## Getting started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev
```

Backend runs on `http://localhost:5000`.

Get a free Gemini API key at https://aistudio.google.com/app/apikey — but the
app also works without one (falls back to the local rule-based parser).

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # defaults already point at localhost:5000
npm run dev
```

Frontend runs on `http://localhost:5173`.

### Try it

1. Register an account, then log in.
2. Go to **Tasks**, click **Start Listening**, and say (in Hindi, English, or
   mixed): *"Naya task buy milk"*, *"4:00 baje nahana hai"*,
   *"roz subah exercise karna hai"*, *"delete task 2"*, *"mark task 1"*, or
   *"kitne task bache hain?"*
3. Check **Dashboard** for upcoming reminders, **Calendar** for due dates, and
   **Analytics** for completion stats and category breakdown.

## API overview

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/todos` | List todos (supports `search`, `category`, `completed` query params) |
| POST | `/api/todos` | Create todo |
| PUT | `/api/todos/:id` | Update todo |
| PATCH | `/api/todos/:id/toggle` | Toggle complete |
| DELETE | `/api/todos/:id` | Delete todo |
| POST | `/api/ai/parse-command` | Parse a raw voice transcript and apply the resulting action |
| GET | `/api/analytics/summary` | Totals, completion rate, category breakdown |
| GET | `/api/analytics/weekly` | Completions per day, last 7 days |

## Notes

- Both frontend `.env.example` and backend `.env.example` need to be copied to
  `.env` and filled in before running.
- Voice recognition uses the browser's Web Speech API — works best in Chrome.
- `GEMINI_API_KEY` is optional; without it, voice commands still work via the
  local rule-based parser in `backend/utils/speechParser.js`.
