// Small client-side helpers for showing example commands / quick local hints.
// The real parsing intelligence lives on the backend (Gemini + fallback parser).

export const EXAMPLE_COMMANDS = [
  { text: "Naya task buy milk", desc: "Add a new task" },
  { text: "Delete task 2", desc: "Delete task by number" },
  { text: "Mark task 1", desc: "Complete a task" },
  { text: "Roz subah exercise karna hai", desc: "Add a recurring daily task" },
  { text: "4:00 baje nahana hai", desc: "Add a task with a time reminder" },
  { text: "Kitne task bache hain?", desc: "Ask how many tasks are pending" },
];

export const CATEGORY_COLORS = {
  Health: "bg-rose-100 text-rose-700",
  Study: "bg-indigo-100 text-indigo-700",
  Work: "bg-amber-100 text-amber-700",
  Errands: "bg-emerald-100 text-emerald-700",
  Home: "bg-sky-100 text-sky-700",
  Travel: "bg-purple-100 text-purple-700",
  General: "bg-slate-100 text-slate-700",
};
