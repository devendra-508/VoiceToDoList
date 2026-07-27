import React, { useMemo, useState } from "react";
import { useTodos } from "../context/TodoContext";
import TodoCard from "../components/TodoCard";
import VoiceButton from "../components/VoiceButton";
import SearchBar from "../components/SearchBar";
import ProgressBar from "../components/ProgressBar";

export default function Todo() {
  const { todos, toggleTodo, removeTodo, addTodo } = useTodos();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [manualText, setManualText] = useState("");

  const filtered = useMemo(() => {
    return todos.filter((t) => {
      const matchesSearch = t.text.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? t.category === category : true;
      return matchesSearch && matchesCategory;
    });
  }, [todos, search, category]);

  const completedCount = todos.filter((t) => t.completed).length;
  const percent = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;

  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    await addTodo({ text: manualText.trim() });
    setManualText("");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h2 className="mb-4 text-center text-2xl font-bold text-slate-800">Voice TODO List</h2>

      <div className="mb-6 rounded-2xl bg-brand-50 p-5">
        <VoiceButton />
      </div>

      <form onSubmit={handleManualAdd} className="mb-4 flex gap-2">
        <input
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Or type a task manually..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          Add
        </button>
      </form>

      <div className="mb-4">
        <ProgressBar percent={percent} />
      </div>

      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
        />
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">No tasks found. Try adding one!</p>
        )}
        {filtered.map((todo, i) => (
          <TodoCard
            key={todo._id}
            index={i + 1}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={removeTodo}
          />
        ))}
      </div>
    </div>
  );
}
