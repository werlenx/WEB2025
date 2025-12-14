import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  User,
  Star,
  Users,
  ShoppingCart,
  Receipt,
  RotateCcw,
  Zap,
  Plus
} from "../../ui/Icos"; // Importando ícones do nosso arquivo centralizado
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Home } from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [houseCode, setHouseCode] = useState<string | null>(null);

  useEffect(() => {
    if (user?.houseId) {
      api.get("/house").then(res => {
        setHouseCode(res.data.code);
      }).catch(err => console.error("Erro ao buscar código da casa", err));
    }
  }, [user?.houseId]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  // Cor do avatar baseada no ID (mock simples) ou propriedade do usuário
  const avatarColor = user.avatar_color || "bg-indigo-500"; 
  const userInitial = user.nome ? user.nome[0].toUpperCase() : "?";

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      {/* Perfil do Usuário */}
      <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-100">
        <div className={`w-20 h-20 ${avatarColor} rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-md`}>
          {userInitial}
        </div>
        <h2 className="text-xl font-bold text-gray-800">{user.nome}</h2>
        <p className="text-sm text-gray-500 mb-2">{user.papel === "admin" ? "Administrador" : "Membro"}</p>
        
        {houseCode && (
           <div className="bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 font-mono text-sm mb-4 flex items-center gap-2 border border-indigo-100">
             <Home className="w-3 h-3" /> {houseCode}
           </div>
        )}

        <div className="flex items-center space-x-4 w-full justify-center mt-2">
           <div className="text-center">
             <span className="block text-xl font-bold text-indigo-600">{user.pontuacao || 0}</span>
             <span className="text-xs text-gray-400 font-bold uppercase">Pts</span>
           </div>
           
           <div className="h-8 w-px bg-gray-200"></div>

           <div className="text-center">
             <span className="flex items-center justify-center text-xl font-bold text-yellow-500">
                {user.starAvg?.toFixed(1) || "3.0"} <Star className="w-4 h-4 ml-1 fill-current" />
             </span>
             <span className="text-xs text-gray-400 font-bold uppercase">Estrelas</span>
           </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-2">
        <NavItem 
            to="/" 
            icon={<LayoutDashboard className="w-5 h-5 mr-3" />} 
            label="Dashboard" 
            active={isActive("/")} 
        />
        <NavItem 
            to="/accounts" 
            icon={<Receipt className="w-5 h-5 mr-3" />} 
            label="Contas" 
            active={isActive("/accounts")} 
        />
        <NavItem 
            to="/market" 
            icon={<ShoppingCart className="w-5 h-5 mr-3" />} 
            label="Mercado" 
            active={isActive("/market")} 
        />
        <NavItem 
            to="/members" 
            icon={<Users className="w-5 h-5 mr-3" />} 
            label="Membros" 
            active={isActive("/members")} 
        />
        <NavItem 
            to="/ranking" 
            icon={<Star className="w-5 h-5 mr-3" />} 
            label="Ranking" 
            active={isActive("/ranking")} 
        />
        <NavItem 
            to="/punishment" 
            icon={<Zap className="w-5 h-5 mr-3" />} 
            label="Punição (Roda)" 
            active={isActive("/punishment")} 
        />
        {/* Placeholder para Adicionar Tasks (Botão de ação ou página separada?) 
            O modelo original usa um modal invocado de várias partes, mas no menu lateral tinha 'Adicionar'?
            Na imagem anexada, tem 'Adicionar' como item de menu. Vamos manter.
        */}
        {(user.papel === "admin" || user.papel === "ADMIN") && (
          <NavItem 
              to="/create-task" 
              icon={<Plus className="w-5 h-5 mr-3" />} 
              label="Adicionar" 
              active={isActive("/create-task")} 
          />
        )}
        <NavItem 
            to="/history" 
            icon={<RotateCcw className="w-5 h-5 mr-3" />} 
            label="Histórico" 
            active={isActive("/history")} 
        />
      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 w-full flex items-center justify-center p-3 text-red-500 hover:bg-red-50 rounded-lg transition font-medium"
      >
        <LogOut className="w-5 h-5 mr-2" /> Sair
      </button>
    </div>
  );
}



function NavItem({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center p-3 rounded-xl font-medium transition duration-200 ${
        active
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
          : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
