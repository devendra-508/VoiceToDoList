import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/todos", label: "Tasks", icon: "✅" },
  { to: "/calendar", label: "Calendar", icon: "📅" },
  { to: "/analytics", label: "Analytics", icon: "📊" },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white border-r border-slate-200 p-4 transform transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 text-xl font-bold text-brand-700">🎙️ Voice TODO</div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? "bg-brand-500 text-white" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
