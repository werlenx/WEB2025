import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Award, Check } from "../ui/Icos";

export default function Market() {
  const { user } = useAuth();
  
  // Mock de dados
  const tasks = [
      { id: 101, title: "Faxina Pesada", points: 150, canBuyOut: true, status: "pending" },
      { id: 102, title: "Limpar Geladeira", points: 80, canBuyOut: true, status: "pending" },
  ];
  
  const [buyouts, setBuyouts] = useState<number[]>([]);

  // Top 1 Mock
  const topRankedUser = { id: user?.id, name: user?.nome }; 
  const isTopRanked = topRankedUser.id === user?.id;

  const availableBuyoutTasks = useMemo(
    () => tasks.filter((t) => t.canBuyOut && t.status === "pending"),
    [tasks]
  );

  const costliestTask = useMemo(
    () =>
      availableBuyoutTasks.length > 0
        ? availableBuyoutTasks.sort((a, b) => b.points - a.points)[0]
        : null,
    [availableBuyoutTasks]
  );
  
  const getBuyOutCost = (pts: number) => Math.ceil(pts * 1.1);

  const handleBuyout = (taskId: number, cost: number) => {
      if (!user) return;
      if (user.pontuacao < cost) {
          alert(`Pontos insuficientes. Você precisa de ${cost} pontos.`);
          return;
      }
      if (window.confirm(`Gastar ${cost} pontos para comprar folga desta tarefa?`)) {
          setBuyouts([...buyouts, taskId]);
          alert("Folga comprada com sucesso!");
          // Aqui chamaria API para deduzir pontos
      }
  };

  return (
    <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-800">Mercado de Preferências</h2>

        <h3 className="text-xl font-bold text-indigo-700">
          Seu Saldo: {user?.pontuacao || 0} Pontos
        </h3>

        {/* Descanso Forçado (Bônus Top 1) */}
        <div
          className={`p-5 rounded-xl shadow-lg border-l-4 ${
            isTopRanked
              ? "bg-yellow-50 border-yellow-500"
              : "bg-gray-100 border-gray-400 opacity-70"
          }`}
        >
          <h4 className="text-xl font-bold text-gray-800 flex items-center">
            <Award className="w-6 h-6 mr-2 text-yellow-600" /> Descanso de
            Campeão
          </h4>
          {isTopRanked ? (
            <p className="mt-2 text-gray-700">
              Parabéns! Por ser o <strong>Top 1</strong> do ranking, você ganha a folga
              automática da tarefa mais pesada (sem gastar pontos) no próximo
              ciclo:
              {costliestTask ? (
                <span className="font-extrabold text-indigo-600 block mt-1">
                  "{costliestTask.title}" ({costliestTask.points} pts)
                </span>
              ) : (
                <span className="text-sm block mt-1">
                  (Nenhuma tarefa de alta pontuação disponível agora)
                </span>
              )}
            </p>
          ) : (
            <p className="mt-2 text-gray-600">
              O usuário <strong>{topRankedUser?.name || "N/A"}</strong> é o atual campeão e
              ganhou a folga automática. Acumule mais pontos para ser o próximo!
            </p>
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-800 pt-4 border-t border-gray-100">
          Comprar Folga para o Próximo Ciclo
        </h3>
        <p className="text-gray-600 mb-4">
          Gaste seus pontos acumulados para garantir que você não será o
          responsável por estas tarefas na próxima rodada de distribuição.
          (Custo: 10% a mais que a pontuação da tarefa).
        </p>

        <div className="space-y-4">
          {availableBuyoutTasks.length > 0 ? (
            availableBuyoutTasks.map((task) => {
              const cost = getBuyOutCost(task.points);
              const canAfford = (user?.pontuacao || 0) >= cost;
              const isBought = buyouts.includes(task.id);

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl shadow-md flex justify-between items-center ${
                    isBought
                      ? "bg-lime-50 opacity-80"
                      : canAfford
                      ? "bg-white"
                      : "bg-red-50 opacity-70"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-gray-800 truncate">
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Valor da Tarefa: {task.points} pts
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <span
                      className={`text-lg font-extrabold ${
                        isBought ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {isBought ? "FOLGA COMPRADA" : `${cost} Pts`}
                    </span>
                    <button
                      onClick={() => handleBuyout(task.id, cost)}
                      disabled={isBought || !canAfford}
                      className={`px-4 py-2 rounded-lg font-bold transition ${
                        isBought
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : canAfford
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-400 text-gray-100 cursor-not-allowed"
                      }`}
                    >
                      {isBought ? "Comprada" : "Comprar"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
              Nenhuma tarefa disponível para compra de folga.
            </p>
          )}
        </div>
    </div>
  );
}
