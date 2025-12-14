import React from "react";
import { Check, Star, Edit, Trash2, Clock } from "../ui/Icos";

interface TaskProps {
  task: any; // Usando any para flexibilidade com a API, idealmente seria uma interface Task
  currentUser: any;
  onMarkDone?: (id: number) => void;
  onReview?: (task: any) => void;
  onEdit?: (task: any) => void;
  onDelete?: (id: number) => void;
}

export default function TaskCard({
  task,
  currentUser,
  onMarkDone,
  onReview,
  onEdit,
  onDelete,
}: TaskProps) {
  // Lógica de status
  const isResponsible = task.responsibleId === currentUser.id || task.responsavelId === currentUser.id;
  
  // Status normalizados (API pode retornar uppercase ou lowercase, vamos normalizar)
  const status = task.status ? task.status.toLowerCase() : "pendente";
  
  const isAwaitingReview = status === "awaiting_review" || status === "awaiting_review"; // Ajustar conforme API
  const isFailed = status === "falhou" || status === "failed";
  const isRefazer = status === "refazer" || status === "redo";
  const isConcluida = status === "concluida" || status === "completed";
  const isPendente = status === "pendente" || status === "pending";
  
  const dueDate = task.dueDate || task.dataLimite;
  const isOverdue =
    (isPendente || isAwaitingReview || isRefazer) &&
    dueDate &&
    new Date(dueDate) < new Date();

  // Avatar e Nome
  const responsibleName = task.responsible?.name || (task.responsavelId === currentUser.id ? "Você" : "Alguém");
  const responsibleInitial = responsibleName[0] || "?";
  // Cor do avatar mockada se não vier da API
  const avatarColor = task.responsible?.avatar_color || "bg-indigo-500";

  // Formatação de data
  const formatDateTime = (isoString: string) => {
    if (!isoString) return "N/A";
    const d = new Date(isoString);
    return `${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  };

  let approvalStatus;
  if (isFailed) {
    approvalStatus = "FALHOU!";
  } else if (isRefazer) {
    approvalStatus = "REFAZER (0 Pts)";
  } else if (isConcluida) {
    approvalStatus = `CONCLUÍDA (${task.starAverage || "?"} Estrelas)`;
  } else if (isAwaitingReview) {
    approvalStatus = "AGUARDANDO AVALIAÇÃO";
  } else {
    approvalStatus = "PENDENTE";
  }

  return (
    <div
      className={`flex items-start p-4 mb-3 rounded-xl shadow-md transition-all duration-300 ${
        isConcluida
          ? "bg-green-50 opacity-75"
          : isFailed
          ? "bg-red-200 border border-red-400 opacity-70"
          : isRefazer
          ? "bg-orange-200 border border-orange-400"
          : isAwaitingReview
          ? "bg-yellow-50 border border-yellow-300"
          : isOverdue
          ? "bg-red-50 hover:shadow-lg border border-red-200"
          : "bg-white hover:shadow-lg hover:border-indigo-200 border border-gray-100"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0 ${avatarColor}`}
      >
        {responsibleInitial}
      </div>

      <div className="ml-4 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p
            className={`text-base font-semibold truncate ${
              isConcluida || isFailed || isRefazer
                ? "line-through text-gray-500"
                : "text-gray-800"
            }`}
          >
            {task.title || task.titulo}
          </p>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full flex-shrink-0">
            {task.points} Pts
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Responsável: <strong>{responsibleName}</strong>
        </p>
        <div className="flex justify-between items-center mt-1">
          <div
            className={`text-xs font-medium ${
              isConcluida
                ? "text-green-600"
                : isFailed
                ? "text-red-800 font-extrabold"
                : isRefazer
                ? "text-orange-600 font-extrabold"
                : "text-red-500"
            }`}
          >
            {approvalStatus}
          </div>
          {dueDate && (
            <div
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isFailed || isRefazer
                  ? "bg-red-700 text-white"
                  : isOverdue
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isFailed || isRefazer
                ? "PRAZO VENCIDO"
                : isOverdue
                ? "ATRASADA"
                : `Limite: ${formatDateTime(dueDate)}`}
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-2 ml-4 flex-shrink-0">
        {(isPendente || isRefazer) && isResponsible && onMarkDone && (
          <button
            onClick={() => onMarkDone(task.id)}
            className="p-2 text-sm font-medium rounded-full transition bg-indigo-500 text-white hover:bg-indigo-600"
            title="Marcar como Concluída"
          >
            <Check className="w-5 h-5" />
          </button>
        )}
        
        {isAwaitingReview && !isResponsible && onReview && (
           <button
             onClick={() => onReview(task)}
             className="p-2 text-sm font-medium rounded-full transition bg-yellow-400 text-white hover:bg-yellow-500"
             title="Avaliar Tarefa"
           >
             <Star className="w-5 h-5 fill-current" />
           </button>
        )}

        {currentUser.papel === "admin" && onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition"
            title="Editar Tarefa"
          >
            <Edit className="w-5 h-5" />
          </button>
        )}
        
        {currentUser.papel === "admin" && onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition"
            title="Excluir Tarefa"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
