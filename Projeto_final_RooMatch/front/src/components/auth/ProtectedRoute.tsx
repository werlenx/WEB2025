import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
      return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verifica se o usuário tem casa e está aprovado
  const needsHouse = !user?.houseId || (user?.houseStatus && user.houseStatus.toUpperCase() !== "APPROVED");
  const isHouseFlow = location.pathname === "/house-flow";

  if (needsHouse && !isHouseFlow) {
    return <Navigate to="/house-flow" replace />;
  }

  if (!needsHouse && isHouseFlow) {
    // Se já tem casa aprovada, não deve ver o fluxo de criação
    return <Navigate to="/" replace />;
  }

  return children;
}
