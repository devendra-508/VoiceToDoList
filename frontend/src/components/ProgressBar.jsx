import React from "react";

export default function ProgressBar({ percent = 0 }) {
  return (
    <div className="w-full">
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs text-slate-500">{percent}% complete</p>
    </div>
  );
}
