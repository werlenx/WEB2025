import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { DoorOpen, Home, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HouseFlow() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [houseName, setHouseName] = useState("");
  const [newHouseCode, setNewHouseCode] = useState("");
  const [houseCode, setHouseCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/house", { houseName, code: newHouseCode });
      // Backend returns { id, name, code, message }
      // User is promoted to ADMIN and status APPROVED.
      updateUser({
        houseId: res.data.id,
        houseStatus: "APPROVED",
        papel: "admin",
      });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar casa");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/house/join", { houseCode });
      
      const newStatus = res.data.houseStatus || "PENDING";
      
      updateUser({
        houseId: res.data.house.id,
        houseStatus: newStatus,
      });
      
      if (newStatus === 'APPROVED') {
          navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao entrar na casa");
    } finally {
      setLoading(false);
    }
  };

  const clearStatus = () => {
    // Clear status locally to allow user to try again
    updateUser({ houseStatus: "unregistered", houseId: null });
  }

  // Normalização do status (case insensitive)
  const status = user.houseStatus ? user.houseStatus.toUpperCase() : "UNREGISTERED";
  const hasHouse = !!user.houseId;

  if (status === "PENDING" && hasHouse) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-yellow-50 rounded-xl shadow-lg max-w-lg mx-auto my-12 space-y-6">
        <Clock className="w-16 h-16 text-yellow-600 animate-pulse" />
        <h2 className="text-3xl font-bold text-yellow-800 text-center">
          Aguardando Aprovação
        </h2>
        <p className="text-gray-700 text-center text-lg">
          Sua solicitação foi enviada. Aguarde o Admin da casa aprovar sua entrada.
        </p>
        <button
            onClick={clearStatus} // In real app, might need to call backend to cancel request
            className="text-red-600 hover:underline"
        >
            Cancelar ou Tentar Outra
        </button>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-xl shadow-lg max-w-lg mx-auto my-12 space-y-6">
        <AlertCircle className="w-16 h-16 text-red-600" />
        <h2 className="text-3xl font-bold text-red-800 text-center">
          Solicitação Rejeitada
        </h2>
        <p className="text-gray-700 text-center text-lg">
          O Admin rejeitou sua solicitação de entrada.
        </p>
        <button
          onClick={clearStatus}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-indigo-900 flex items-center justify-center gap-3">
          <DoorOpen className="w-10 h-10" /> Bem-vindo ao RooMatch
        </h1>
        <p className="text-gray-600 text-lg">
          Para começar, você precisa criar uma nova casa ou entrar em uma existente.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Card Criar Casa */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100 flex flex-col">
          <div className="mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                <Home className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Criar Nova Casa</h3>
            <p className="text-sm text-gray-500 mt-2">Torne-se o Admin e convide seus roomies.</p>
          </div>
          
          <form onSubmit={handleCreate} className="space-y-4 flex-1 flex flex-col justify-end">
            <input
              type="text"
              placeholder="Nome da Casa (ex: Toca dos Gatos)"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              value={houseName}
              onChange={(e) => setHouseName(e.target.value)}
              required
            />
             <input
              type="text"
              placeholder="Crie um Código (Ex: MINHACASA)"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition uppercase font-mono text-indigo-700"
              value={newHouseCode}
              onChange={(e) => setNewHouseCode(e.target.value.toUpperCase().trim())}
              required
            />
            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-200"
            >
              {loading ? <Loader className="w-5 h-5 mx-auto animate-spin" /> : "Criar Casa"}
            </button>
          </form>
        </div>

        {/* Card Entrar Casa */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-100 flex flex-col">
          <div className="mb-6">
             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                <DoorOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Já tenho um convite</h3>
            <p className="text-sm text-gray-500 mt-2">Use o código compartilhado pelo Admin.</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4 flex-1 flex flex-col justify-end">
            <input
              type="text"
              placeholder="Código (ex: A1B2C3)"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition uppercase"
              value={houseCode}
              onChange={(e) => setHouseCode(e.target.value)}
              required
            />
            <button
              disabled={loading}
              className="w-full bg-green-600 text-white p-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50 shadow-lg shadow-green-200"
            >
              {loading ? <Loader className="w-5 h-5 mx-auto animate-spin" /> : "Entrar na Casa"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Loader({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
