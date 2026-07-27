import React, { useMemo, useState } from "react";
import { useTodos } from "../context/TodoContext";

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function Calendar() {
  const { todos } = useTodos();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const cells = useMemo(() => getMonthMatrix(year, month), [year, month]);

  const todosByDay = useMemo(() => {
    const map = {};
    todos.forEach((t) => {
      if (!t.dueDate) return;
      const d = new Date(t.dueDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        map[day] = map[day] || [];
        map[day].push(t);
      }
    });
    return map;
  }, [todos, year, month]);

  const monthLabel = new Date(year, month).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const changeMonth = (delta) => {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonth(m);
    setYear(y);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => changeMonth(-1)} className="rounded-lg px-3 py-1 hover:bg-slate-200">←</button>
        <h2 className="text-xl font-bold text-slate-800">{monthLabel}</h2>
        <button onClick={() => changeMonth(1)} className="rounded-lg px-3 py-1 hover:bg-slate-200">→</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((day, i) => (
          <div
            key={i}
            className={`min-h-[80px] rounded-lg border border-slate-200 p-1 text-xs ${
              day ? "bg-white" : "bg-transparent"
            }`}
          >
            {day && (
              <>
                <p className="mb-1 font-semibold text-slate-600">{day}</p>
                {(todosByDay[day] || []).slice(0, 2).map((t) => (
                  <p
                    key={t._id}
                    className="mb-0.5 truncate rounded bg-brand-100 px-1 py-0.5 text-[10px] text-brand-700"
                    title={t.text}
                  >
                    {t.text}
                  </p>
                ))}
                {(todosByDay[day] || []).length > 2 && (
                  <p className="text-[10px] text-slate-400">+{todosByDay[day].length - 2} more</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
