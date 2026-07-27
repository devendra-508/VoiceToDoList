import React from "react";
import { CATEGORY_COLORS } from "../utils/voiceCommands";

export default function TodoCard({ index, todo, onToggle, onDelete }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition ${
        todo.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <button
          onClick={() => onToggle(todo._id)}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
            todo.completed ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300"
          }`}
          aria-label="Toggle complete"
        >
          {todo.completed && "✓"}
        </button>
        <div className="min-w-0">
          <p className={`truncate text-sm font-medium ${todo.completed ? "line-through" : ""}`}>
            {index}. {todo.text}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                CATEGORY_COLORS[todo.category] || CATEGORY_COLORS.General
              }`}
            >
              {todo.category}
            </span>
            {todo.isRecurring && (
              <span className="rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs font-medium text-fuchsia-700">
                🔁 {todo.recurrencePattern}
              </span>
            )}
            {todo.dueDate && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                ⏰ {new Date(todo.dueDate).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => onDelete(todo._id)}
        className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  );
}
