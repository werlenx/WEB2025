export default function NavMenu() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-40 md:absolute md:bottom-0">
      <button
        onClick={() => setView("dashboard")}
        className={`flex flex-col items-center space-y-1 ${
          view === "dashboard"
            ? "text-indigo-600"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-medium">Início</span>
      </button>
      <button
        onClick={() => setView("ranking")}
        className={`flex flex-col items-center space-y-1 ${
          view === "ranking"
            ? "text-indigo-600"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Award className="w-6 h-6" />
        <span className="text-[10px] font-medium">Ranking</span>
      </button>

      {/* FAB (Floating Action Button) for Actions */}
      <div className="relative -top-6">
        <button
          onClick={() =>
            setView(currentUser.papel === "admin" ? "taskCreation" : "wheel")
          }
          className={`w-14 h-14 rounded-full shadow-lg border-4 border-gray-100 flex items-center justify-center transition-transform hover:scale-110 ${
            currentUser.papel === "admin"
              ? "bg-indigo-600 text-white"
              : "bg-yellow-500 text-white"
          }`}
        >
          {currentUser.papel === "admin" ? (
            <Plus className="w-8 h-8" />
          ) : (
            <Zap className="w-8 h-8 fill-current" />
          )}
        </button>
      </div>

      <button
        onClick={() => setView("market")}
        className={`flex flex-col items-center space-y-1 ${
          view === "market"
            ? "text-indigo-600"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <ShoppingBag className="w-6 h-6" />
        <span className="text-[10px] font-medium">Mercado</span>
      </button>
      <button
        onClick={() => setView("adminSettings")}
        className={`flex flex-col items-center space-y-1 ${
          view === "adminSettings"
            ? "text-indigo-600"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Settings className="w-6 h-6" />
        <span className="text-[10px] font-medium">Config</span>
      </button>
    </nav>
  );
}
