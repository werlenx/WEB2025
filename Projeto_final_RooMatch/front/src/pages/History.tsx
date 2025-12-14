import React from "react";

export default function History() {
  // Mock history
  const history = [
      { id: 1, descricao: "Ana concluiu 'Lavar Louça' (+10pts)", tipoEvento: "tarefa_concluida", date: new Date() },
      { id: 2, descricao: "Bruno girou a roda: 'Pagar Pizza' (-100pts)", tipoEvento: "punicao_aplicada", date: new Date(Date.now() - 86400000) },
  ];

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Histórico de Eventos</h2>
        <div className="space-y-3">
        {history.length > 0 ? (
            history.map((item) => (
            <div
                key={item.id}
                className="p-4 bg-white rounded-xl shadow-sm flex justify-between items-start border-l-4 border-gray-200"
            >
                <div className="flex-1">
                <p
                    className={`font-semibold ${
                    item.tipoEvento === "punicao_aplicada" ||
                    item.tipoEvento === "tarefa_falha" ||
                    item.tipoEvento === "tarefa_refazer"
                        ? "text-red-600"
                        : item.tipoEvento === "tarefa_concluida" ||
                        item.tipoEvento === "tarefa_concluida_qualidade"
                        ? "text-green-600"
                        : "text-gray-700"
                    }`}
                >
                    {item.descricao}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    {item.date.toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                    })}
                </p>
                </div>
            </div>
            ))
        ) : (
            <p className="p-4 bg-gray-50 rounded-lg text-gray-500">
            Nenhum evento registrado ainda.
            </p>
        )}
        </div>
    </div>
  );
}
