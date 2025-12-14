import React from "react";
import { LogOut, Home } from "../../ui/Icos"; // Home usado temporariamente se precisar de ícone extra
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-indigo-100 bg-white p-4 rounded-xl shadow-sm">
      <div className="mb-4 sm:mb-0">
        <Link to="/" className="text-4xl font-extrabold text-gray-900 flex items-center hover:opacity-90 transition">
          <span className="mr-3 text-indigo-600 text-5xl">⚡</span> Roomatch
        </Link>
        <p className="text-gray-600 mt-1">
          Gamificação e justiça nas tarefas domésticas.
        </p>
      </div>

      {user && (
        <div className="flex items-center space-x-4">
          <p className="text-sm font-medium text-gray-600">
            Casa:{" "}
            <span className="font-bold text-indigo-600">
              {user.houseId ? "Minha Casa" : "Sem Casa"}
            </span>
          </p>
          <button
            onClick={logout}
            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
            title="Sair (Logout)"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
}
