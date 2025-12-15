import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Star } from "../ui/Icos";
import api from "../services/api";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

export default function Members() {
  const { user } = useAuth();
  const [house, setHouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHouse() {
      try {
        const response = await api.get("/house");
        console.log("House Data:", response.data);
        console.log("Pending Members (Raw):", response.data.pendingMembers);
        setHouse(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados da casa", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHouse();
  }, []);

  const handleStatusUpdate = async (memberId: number, status: "APPROVED" | "REJECTED") => {
      try {
          await api.patch(`/house/members/${memberId}/status`, { status });
          // Atualiza lista localmente
          setHouse((prev: any) => {
              if (!prev) return prev;
              const pending = prev.pendingMembers.find((m: any) => m.id === memberId);
              if (!pending) return prev; // Should not happen

              const newPending = prev.pendingMembers.filter((m: any) => m.id !== memberId);
              let newMembers = [...prev.members];

              if (status === "APPROVED") {
                   newMembers.push({ ...pending, role: "COMMON", score: 0, status: "APPROVED" });
              }
              
              return { ...prev, members: newMembers, pendingMembers: newPending };
          });
      } catch (error) {
          console.error("Erro ao atualizar status", error);
          alert("Erro ao atualizar status do membro.");
      }
  };

  const handleRemoveMember = async (memberId: number, memberName: string) => {
      if (!window.confirm(`Tem certeza que deseja remover ${memberName} da casa?`)) {
          return;
      }

      try {
          await api.delete(`/house/members/${memberId}`);
          setHouse((prev: any) => {
              if (!prev) return prev;
              const newMembers = prev.members.filter((m: any) => m.id !== memberId);
              return { ...prev, members: newMembers };
          });
      } catch (error) {
          console.error("Erro ao remover membro", error);
          alert("Erro ao remover membro.");
      }
  };

  if (loading) {
      return <div className="p-8 text-center text-gray-500">Carregando membros...</div>;
  }

  if (!house) {
      return <div className="p-8 text-center text-gray-500">Você não possui uma casa ativa.</div>;
  }

  const members = house.members || [];
  const pendingMembers = house.pendingMembers || [];
  
  // Ordenar por pontos
  members.sort((a: any, b: any) => (b.score || 0) - (a.score || 0));

  const isUserAdmin = user?.papel === "admin" || user?.papel === "ADMIN";

  return (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Membros da Casa</h2>
            <div className="p-4 bg-indigo-50 rounded-xl shadow-inner border-l-4 border-indigo-500">
            <p className="font-semibold text-indigo-800">
                Casa Atual:{" "}
                <span className="font-extrabold">{house.name}</span>{" "}
                (Código: {house.code})
            </p>
            <p className="text-sm text-gray-600">
                Total de Membros Aprovados: {members.length}
            </p>
            </div>
        </div>

        {isUserAdmin && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="text-lg font-bold text-yellow-800 mb-3">Solicitações Pendentes</h3>
                
                {pendingMembers.length === 0 ? (
                     <p className="text-gray-500 text-sm">Nenhuma solicitação pendente no momento.</p>
                ) : (
                    <div className="space-y-3">
                        {pendingMembers.map((p: any) => (
                            <div key={p.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                                <div>
                                    <p className="font-semibold text-gray-900">{p.name || p.email}</p>
                                    <p className="text-xs text-gray-500">{p.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleStatusUpdate(p.id, "APPROVED")}
                                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                                        title="Aprovar"
                                    >
                                        <CheckCircle className="w-6 h-6" />
                                    </button>
                                    <button 
                                        onClick={() => handleStatusUpdate(p.id, "REJECTED")}
                                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                                        title="Rejeitar"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-700">Membros Aprovados</h3>
          {members.length === 0 && <p className="text-gray-500">Nenhum membro aprovado ainda.</p>}
          {members.map((u: any) => {
            const isAdmin = u.role === "admin" || u.role === "ADMIN";
            return (
              <div
                key={u.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border-l-4 border-gray-200"
              >
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0 mr-4 ${u.avatar_color || "bg-gray-400"}`}
                  >
                    {u.name ? u.name[0].toUpperCase() : "?"}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {u.name} {u.id === user?.id && "(Você)"}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isAdmin
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isAdmin ? "ADMIN" : "Membro Comum"}
                    </span>
                  </div>
                </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                        <span className="text-2xl font-bold text-indigo-600 block">
                            {u.score || 0} Pts
                        </span>
                        <span className="text-sm font-semibold text-gray-500 flex items-center justify-end">
                            {Number(u.star_avg || 3.0).toFixed(1)}{" "}
                            <Star className="w-4 h-4 ml-0.5 text-yellow-500 fill-yellow-500" />
                        </span>
                    </div>
                     {isUserAdmin && u.id !== user?.id && (
                        <button
                            onClick={() => handleRemoveMember(u.id, u.name)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="Remover da casa"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                  </div>
              </div>
            );
          })}
        </div>
    </div>
  );
}
