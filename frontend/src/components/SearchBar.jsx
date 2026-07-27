import React from "react";

export default function SearchBar({ value, onChange, category, onCategoryChange }) {
  const categories = ["", "Health", "Study", "Work", "Errands", "Home", "Travel", "General"];

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks..."
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
      />
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c || "All categories"}
          </option>
        ))}
      </select>
    </div>
  );
}
