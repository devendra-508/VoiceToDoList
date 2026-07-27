import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import todoService from "../services/todoService";
import AnalyticsCard from "../components/AnalyticsCard";

const COLORS = ["#2e86de", "#f97316", "#10b981", "#a855f7", "#ef4444", "#14b8a6", "#64748b"];

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState([]);

  useEffect(() => {
    todoService.getAnalyticsSummary().then(setSummary).catch(() => {});
    todoService.getWeeklyAnalytics().then(setWeekly).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h2 className="mb-6 text-2xl font-bold text-slate-800">Analytics</h2>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <AnalyticsCard label="Total" value={summary?.total ?? "—"} icon="📋" />
        <AnalyticsCard label="Completed" value={summary?.completed ?? "—"} icon="✅" />
        <AnalyticsCard label="Pending" value={summary?.pending ?? "—"} icon="⏳" />
        <AnalyticsCard label="Rate" value={`${summary?.completionRate ?? 0}%`} icon="📈" />
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-slate-700">Tasks completed — last 7 days</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weekly}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="completed" fill="#2e86de" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-slate-700">Tasks by category</p>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={summary?.byCategory || []}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {(summary?.byCategory || []).map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
