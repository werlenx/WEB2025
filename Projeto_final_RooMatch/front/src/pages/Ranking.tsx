import React, { useMemo, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Star } from "../ui/Icos";
import api from "../services/api";

export default function Ranking() {
  const { user } = useAuth();
  const [house, setHouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHouse() {
      try {
        const response = await api.get("/house");
        setHouse(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados da casa para ranking", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHouse();
  }, []);

  const rankedUsers = useMemo(() => {
      if (!house || !house.members) return [];
      const members = [...house.members];
      return members.sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [house]);

  if (loading) {
      return <div className="p-8 text-center text-gray-500">Calculando ranking...</div>;
  }

  if (!house) {
      return <div className="p-8 text-center text-gray-500">Ranking indisponível (Sem casa).</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Ranking da Casa</h2>
      <div className="space-y-4">
        {rankedUsers.map((u, index) => (
          <div
            key={u.id}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border-l-4 border-yellow-400 theme-transition"
          >
            <div className="flex items-center">
              <span
                className={`text-2xl font-extrabold mr-4 ${
                  index === 0
                    ? "text-yellow-500"
                    : index === 1
                    ? "text-gray-400"
                    : index === 2
                    ? "text-amber-700"
                    : "text-gray-400"
                }`}
              >
                #{index + 1}
              </span>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0 mr-4 ${u.avatar_color || "bg-gray-400"}`}
              >
                {u.name ? u.name[0] : "?"}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {u.name} {u.id === user?.id && "(Você)"}
                </p>
                <p className="text-sm text-gray-500">
                  {u.role ? (u.role.toLowerCase() === "admin" ? "Administrador" : "Colega") : "Membro"}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-bold text-indigo-600">
                {u.score || 0} Pts
              </span>
              <span className="text-sm font-semibold text-gray-500 mt-1 flex items-center">
                {Number(u.star_avg || 3.0).toFixed(1)}{" "}
                <Star className="w-4 h-4 ml-0.5 text-yellow-500 fill-yellow-500" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
