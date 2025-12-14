import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

interface Action {
    type: string;
    payload?: any;
}

interface User {
  id: number;
  nome: string;
  email: string;
  papel: "admin" | "comum" | "ADMIN" | "COMMON";
  pontuacao: number;
  avatar: string;
  houseId: number | null;
  houseStatus: string;
  starAvg: number;
  avatar_color?: string; // Backend sometimes sends this
}

interface AuthContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string, houseCode?: string, houseCreation?: { name: string, code: string }) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("roomatch_user");
    if (storedUser) {
        try {
            return JSON.parse(storedUser);
        } catch {
            return null;
        }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("roomatch_token");

    if (storedToken) {
      api.defaults.headers.Authorization = `Bearer ${storedToken}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchCurrentUser() {
    try {
      const response = await api.get("/users/me");
      const normalizedUser = adaptUser(response.data.user);
      
      setUser(normalizedUser);
      localStorage.setItem("roomatch_user", JSON.stringify(normalizedUser));
    } catch (error) {
      console.error("Erro ao validar sessão:", error);
      // Removed automatic logout here to prevent session loss on network errors.
      // 401 errors are already handled by the API interceptor in api.ts
    } finally {
      setLoading(false);
    }
  }

  // Adapter para normalizar dados do backend para o formato do frontend
  const adaptUser = (backendUser: any): User => {
    return {
      id: backendUser.id,
      nome: backendUser.name || backendUser.nome,
      email: backendUser.email,
      papel: backendUser.role?.toLowerCase() === "admin" ? "admin" : "comum",
      pontuacao: backendUser.score || 0,
      // Se vier avatarColor, usa; senão bg-gray-400. Mapeia para prop 'avatar' que o front espera como string de classe
      avatar: backendUser.avatarColor || "bg-gray-400", 
      avatar_color: backendUser.avatarColor, // Mantém backup
      houseId: backendUser.houseId,
      houseStatus: backendUser.houseStatus,
      starAvg: backendUser.starAvg ? Number(backendUser.starAvg) : 3.0,
    };
  };

  async function login(email: string, senha: string) {
    const response = await api.post("/auth/login", { email, password: senha });
    const { token, user: backendUser } = response.data;
    
    console.log("Backend User:", backendUser); // Debug

    const normalizedUser = adaptUser(backendUser);

    localStorage.setItem("roomatch_token", token);
    localStorage.setItem("roomatch_user", JSON.stringify(normalizedUser));
    
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(normalizedUser);
  }

  async function register(nome: string, email: string, senha: string, houseCode?: string, houseCreation?: { name: string, code: string }) {
     // A rota de registro retorna 201 Created, as vezes com ID. 
     // Geralmente o fluxo é Registro -> Login, ou Registro faz login auto.
     // No modelo original, faz login auto? Não, "setView('login')".
     // O backend retorna { id, name, email ... }
     
     const payload: any = { name: nome, email, password: senha };
     if (houseCode) payload.houseCode = houseCode;
     if (houseCreation) {
         payload.houseName = houseCreation.name;
         payload.newHouseCode = houseCreation.code;
     }

     await api.post("/auth/register", payload);
     // Não seta login automático para forçar o usuário a entrar
  }

  function logout() {
    localStorage.removeItem("roomatch_token");
    localStorage.removeItem("roomatch_user");
    api.defaults.headers.Authorization = "";
    setUser(null);
  }

  function updateUser(updates: Partial<User>) {
      if (!user) return;
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("roomatch_user", JSON.stringify(updatedUser));
  }

  return (
    <AuthContext.Provider
      value={{ 
          signed: !!user, 
          user, 
          loading, 
          login, 
          register, 
          logout, 
          updateUser,
          isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
