import { Task } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Check, Star, Clock, AlertTriangle, XCircle, CheckCircle, Edit, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const isResponsible = task.responsibleId === user?.id;
  const isAdmin = user?.role === 'ADMIN';

  // Status Helpers
  const isPending = task.status === 'PENDING';
  const isAwaitingReview = task.status === 'AWAITING_REVIEW';
  const isCompleted = task.status === 'COMPLETED';
  const isFailed = task.status === 'FAILED';
  const isRedo = task.status === 'REDO';
  const isBoughtOut = task.status === 'BOUGHT_OUT';
  
  // Overdue Logic
  const isOverdue = (isPending || isAwaitingReview || isRedo) && task.dueDate && new Date(task.dueDate) < new Date();
  
  // Simple Approval Logic (Rule: < 15 points)
  const isSimpleApproval = task.points < 15;
  const alreadyReviewed = false; // TODO: Check if user already reviewed (needs array of reviewers in Task type)

  // Status Text Logic
  let approvalStatusElement;
  if (isFailed) {
      approvalStatusElement = <span className="text-red-800 font-extrabold">FALHOU!</span>;
  } else if (isRedo) {
      approvalStatusElement = <span className="text-orange-600 font-extrabold">REFAZER (0 Pts)</span>;
  } else if (isCompleted) {
      approvalStatusElement = <span className="text-green-600">CONCLUÍDA ({task.starAverage || '3.0'} Estrelas)</span>;
  } else if (isAwaitingReview) {
      // Prototype shows "AVALIANDO: X/Y Votos". We'll use a placeholder or available count if possible.
      // Assuming task.reviews count is not readily available in this simplified interface, sticking to simpler text or mocking.
      approvalStatusElement = <span className="text-red-500">AVALIANDO...</span>; 
  } else {
      approvalStatusElement = <span className="text-red-500">PENDENTE</span>;
  }

  // Formatting Date
  const formatDateTime = (isoString: string) => {
    if (!isoString) return "N/A";
    const d = new Date(isoString);
    return `${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  };

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      return api.patch(`/tasks/${task.id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async (stars: number) => {
      return api.post(`/tasks/${task.id}/review`, { stars });
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        setReviewModalOpen(false);
    },
  });

  const deleteTaskMutation = useMutation({
      mutationFn: async () => {
          return api.delete(`/tasks/${task.id}`);
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
  });


  const handleMarkDone = () => updateStatusMutation.mutate('AWAITING_REVIEW');
  const handleReviewSubmit = () => { if (rating > 0) reviewMutation.mutate(rating); };
  const handleSimpleVote = (vote: boolean) => reviewMutation.mutate(vote ? 3 : 1); // 3=OK, 1=Not OK

  const handleDeleteTask = () => {
      if(confirm('Tem certeza que deseja excluir esta tarefa?')) {
          deleteTaskMutation.mutate();
      }
  };

  return (
    <div className={cn(
        "flex items-start p-4 mb-3 rounded-xl shadow-md transition-all duration-300",
        isCompleted ? "bg-green-50 opacity-75" :
        isFailed ? "bg-red-200 border border-red-400 opacity-70" :
        isRedo ? "bg-orange-200 border border-orange-400" :
        isAwaitingReview ? "bg-yellow-50 border border-yellow-300" :
        isOverdue ? "bg-red-50 hover:shadow-lg border border-red-200" :
        "bg-white hover:shadow-lg hover:border-indigo-200 border border-gray-100"
    )}>
       {/* Avatar */}
       <div className={cn(
           "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0",
           task.responsible?.avatarColor || "bg-gray-400"
        )}>
            {task.responsible?.name?.[0] || "?"}
       </div>

       {/* Content */}
       <div className="ml-4 flex-1 min-w-0">
           <div className="flex justify-between items-center">
               <p className={cn("text-base font-semibold truncate", (isCompleted || isFailed || isRedo) ? "line-through text-gray-500" : "text-gray-800")}>
                   {task.title}
               </p>
               <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full flex-shrink-0">
                   {task.points} Pts
               </span>
           </div>
           <p className="text-sm text-gray-500 mt-1">
             Responsável: <strong>{task.responsible?.name || 'Desconhecido'}</strong>
           </p>
           
           <div className="flex justify-between items-center mt-1">
                <div className="text-xs font-medium">
                    {approvalStatusElement}
                </div>
                {task.dueDate && (
                    <div className={cn("text-xs font-bold px-2 py-0.5 rounded-full",
                        (isFailed || isRedo) ? "bg-red-700 text-white" :
                        isOverdue ? "bg-red-500 text-white" :
                        "bg-gray-100 text-gray-600"
                    )}>
                        {(isFailed || isRedo) ? "PRAZO VENCIDO" : isOverdue ? "ATRASADA" : `Limite: ${formatDateTime(task.dueDate)}`}
                    </div>
                )}
           </div>
       </div>

       {/* Buttons */}
       <div className="flex space-x-2 ml-4 flex-shrink-0">
            {(isPending || isRedo) && isResponsible && (
                <button onClick={handleMarkDone} className="p-2 text-sm font-medium rounded-full transition bg-indigo-500 text-white hover:bg-indigo-600" title="Marcar como Concluída">
                    <Check className="w-5 h-5" />
                </button>
            )}
            {isAwaitingReview && !isResponsible && (
                 <button onClick={() => setReviewModalOpen(true)} className="p-2 text-sm font-medium rounded-full transition bg-yellow-400 text-white hover:bg-yellow-500" title="Avaliar">
                    <Star className="w-5 h-5 fill-current" />
                 </button>
            )}
            {isAdmin && (
               <>
                 <button onClick={() => {}} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition" title="Editar">
                     <Edit className="w-5 h-5" />
                 </button>
                 <button onClick={handleDeleteTask} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition" title="Excluir">
                     <Trash2 className="w-5 h-5" />
                 </button>
               </>
            )}
       </div>

       {/* Review Modal (Faithful to prototype custom styling) */}
       {reviewModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
           <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center">
               <h3 className="text-2xl font-bold text-gray-900 mb-4">Avaliar Tarefa</h3>
               <p className="text-lg font-medium text-indigo-700 mb-2">{task.title}</p>
               <p className="text-sm text-gray-600 mb-6">Responsável: <strong>{task.responsible?.name}</strong></p>

               {isSimpleApproval ? (
                 <>
                   <p className="text-lg font-bold text-gray-700 mb-4">A tarefa está OK?</p>
                   <div className="flex justify-center space-x-4 mt-4">
                     <button
                       onClick={() => handleSimpleVote(true)}
                       className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                     >
                       <Check className="w-5 h-5 mr-2" /> OK! (Aprovar)
                     </button>
                     <button
                       onClick={() => handleSimpleVote(false)}
                       className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                     >
                       <X className="w-5 h-5 mr-2" /> Não OK
                     </button>
                   </div>
                 </>
               ) : (
                 <>
                    <div className="flex justify-center space-x-1 mb-2">
                        {[1, 2, 3].map((starValue) => (
                            <Star
                                key={starValue}
                                className={cn(
                                    "w-8 h-8 cursor-pointer transition hover:scale-110",
                                    starValue <= rating ? "fill-yellow-400 text-yellow-500" : "text-gray-300"
                                )}
                                onClick={() => setRating(starValue)}
                                fill={starValue <= rating ? "currentColor" : "none"}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">3 Estrelas = Excelente | 1 Estrela = Mal Feita</p>
                    <div className="mt-6 flex justify-between space-x-3">
                         <button onClick={() => setReviewModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
                             Fechar
                         </button>
                         <button onClick={handleReviewSubmit} disabled={rating === 0} className={cn("px-4 py-2 text-white font-semibold rounded-lg transition", rating === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700")}>
                             Submeter
                         </button>
                    </div>
                 </>
               )}
               
               {isSimpleApproval && (
                   <div className="mt-6 flex justify-center">
                        <button onClick={() => setReviewModalOpen(false)} className="text-sm text-gray-500 hover:text-gray-700 underline">
                             Cancelar
                        </button>
                   </div>
               )}
           </div>
        </div>
       )}
    </div>
  );
}
