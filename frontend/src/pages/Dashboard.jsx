import React, { useEffect, useState } from "react";
import { useTodos } from "../context/TodoContext";
import { useAuth } from "../context/AuthContext";
import AnalyticsCard from "../components/AnalyticsCard";
import ProgressBar from "../components/ProgressBar";
import todoService from "../services/todoService";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const { todos } = useTodos();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    todoService.getAnalyticsSummary().then(setSummary).catch(() => {});
  }, [todos]);

  const upcoming = todos
    .filter((t) => !t.completed && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h2 className="mb-1 text-2xl font-bold text-slate-800">Welcome back, {user?.name} 👋</h2>
      <p className="mb-6 text-sm text-slate-500">Here's your task overview.</p>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <AnalyticsCard label="Total Tasks" value={summary?.total ?? "—"} icon="📋" />
        <AnalyticsCard label="Completed" value={summary?.completed ?? "—"} icon="✅" />
        <AnalyticsCard label="Pending" value={summary?.pending ?? "—"} icon="⏳" />
        <AnalyticsCard label="Completion" value={`${summary?.completionRate ?? 0}%`} icon="📈" />
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-slate-700">Overall Progress</p>
        <ProgressBar percent={summary?.completionRate ?? 0} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">Upcoming reminders</p>
          <Link to="/todos" className="text-xs font-medium text-brand-600 hover:underline">
            View all tasks →
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-400">No upcoming due dates. Try saying "4 baje nahana hai".</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map((t) => (
              <li key={t._id} className="flex justify-between text-sm">
                <span>{t.text}</span>
                <span className="text-slate-400">{new Date(t.dueDate).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
