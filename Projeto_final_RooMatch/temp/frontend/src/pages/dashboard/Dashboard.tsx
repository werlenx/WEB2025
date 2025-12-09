import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { House, Task } from '@/types';
import { Clock, CheckCircle, XCircle, X } from 'lucide-react'; // XCircle/X for failure
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/TaskCard';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');

  // Queries
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get('/tasks');
      return res.data;
    },
  });

  // Derived State & Logic
  const costliestTask = tasks
       .filter(t => t.canBuyOut && t.status === 'PENDING')
       .sort((a, b) => b.points - a.points)[0];

  const targetPoints = costliestTask ? Math.ceil(costliestTask.points * 1.1) : 0;
  const progress = targetPoints > 0 ? Math.min(100, (user?.score || 0) / targetPoints * 100) : 0;

  // Filter Logic
  const filterOptions = [
    { key: 'DAILY', label: 'Dia' },
    { key: 'WEEKLY', label: 'Semana' },
    { key: 'MONTHLY', label: 'Mês' },
  ];

  const filteredTasks = tasks.filter(task => {
    if (task.status === 'COMPLETED' || task.status === 'FAILED') return true; // Always show history in their sections

    if (filter === 'DAILY') {
        return task.frequency === 'DAILY';
    }
    if (filter === 'WEEKLY') {
         return task.frequency === 'DAILY' || task.frequency === 'WEEKLY';
    }
    return true; // Monthly/All shows everything
  });

  const pending = filteredTasks
    .filter(t => ['PENDING', 'AWAITING_REVIEW', 'REDO'].includes(t.status))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const failed = filteredTasks
    .filter(t => t.status === 'FAILED')
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()); // sorting by date roughly

  const completed = filteredTasks
     .filter(t => t.status === 'COMPLETED')
     .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()); // sorting by date roughly


  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Medidor de Folga (Faithful Layout from Prototype) */}
      <div className="p-4 bg-indigo-50 rounded-xl shadow-md border border-indigo-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-indigo-700">
              Medidor de Folga (Next Cycle)
            </h3>
            <span className="text-sm font-extrabold text-indigo-800">
              {user?.score} Pts
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            {targetPoints > 0 ? (
              <>
                <p>
                  Próxima folga (Custo: <strong>{targetPoints} Pts</strong>): <strong>{costliestTask?.title}</strong>
                </p>
                {progress >= 100 ? (
                  <p className="font-bold text-green-700 mt-1">
                    🎉 Você tem pontos suficientes para a folga!
                  </p>
                ) : (
                  <p className="text-red-500">
                    Faltam {targetPoints - (user?.score || 0)} pontos.
                  </p>
                )}
              </>
            ) : (
              <p>
                Nenhuma tarefa de alto valor disponível para compra de folga.
              </p>
            )}
          </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2 p-2 bg-gray-100 rounded-xl max-w-sm mx-auto shadow-inner">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              //@ts-ignore
              onClick={() => setFilter(option.key)}
              className={cn(
                  "flex-1 p-2 rounded-lg font-semibold text-sm transition",
                  filter === option.key 
                  ? "bg-indigo-600 text-white shadow-md" 
                  : "text-gray-600 hover:bg-white"
              )}
            >
              {option.label}
            </button>
          ))}
      </div>

      {/* Main Sections (Vertical Stack) */}

      {/* Pendente */}
      <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-red-500" /> Tarefas Pendentes ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.length > 0 ? (
                pending.map(task => <TaskCard key={task.id} task={task} />)
            ) : (
                <p className="p-4 bg-lime-50 rounded-lg text-lime-700 font-medium">
                    Nenhuma tarefa pendente para o filtro "{filterOptions.find(o => o.key === filter)?.label}"!
                </p>
            )}
          </div>
      </section>

      {/* Falhou */}
      <section>
        <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8 flex items-center border-t pt-4 border-gray-100">
            <XCircle className="w-5 h-5 mr-2 text-red-700" /> Tarefas Falharam ({failed.length})
        </h3>
         <div className="space-y-3">
            {failed.length > 0 ? (
                failed.map(task => <TaskCard key={task.id} task={task} />)
            ) : (
                <p className="p-4 bg-gray-50 rounded-lg text-gray-500">
                    Nenhuma falha registrada.
                </p>
            )}
          </div>
      </section>

      {/* Concluidas */}
      <section>
        <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8 flex items-center border-t pt-4 border-gray-100">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> Tarefas Concluídas ({completed.length})
        </h3>
         <div className="space-y-3">
            {completed.length > 0 ? (
                completed.map(task => <TaskCard key={task.id} task={task} />)
            ) : (
                <p className="p-4 bg-gray-50 rounded-lg text-gray-500">
                    Nenhuma tarefa concluída ainda.
                </p>
            )}
          </div>
      </section>

    </div>
  );
}
