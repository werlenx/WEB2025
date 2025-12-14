import { handlerLogout } from "../context/authContext";
import { LogOut } from "../ui/Icos";
import { useState } from "react";

export default function Header() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-indigo-100">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
          <span className="mr-3 text-indigo-600 text-5xl">⚡</span> Roomatch
        </h1>
        <p className="text-gray-600 mt-1">
          Gamificação e justiça nas tarefas domésticas.
        </p>
      </div>

      {/* Informação do Usuário Logado / Botão de Logout */}
      {currentUser && (
        <div className="flex items-center space-x-4">
          <p className="text-sm font-medium text-gray-600">
            Casa:{" "}
            <span className="font-bold text-indigo-600">
              {/* {getCurrentHouse()?.name || "Sem Casa"} */}
            </span>
          </p>
          <button
            //onClick={handleLogout}
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
