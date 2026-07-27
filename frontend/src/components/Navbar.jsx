import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden rounded-lg p-2 hover:bg-slate-100"
          aria-label="Open menu"
        >
          ☰
        </button>
        <h1 className="text-lg font-bold text-brand-700">🗣️ Voice TODO</h1>
      </div>
      <div className="flex items-center gap-3">
        {user && <span className="hidden sm:inline text-sm text-slate-600">Hi, {user.name}</span>}
        {user && (
          <button
            onClick={logout}
            className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-300"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
