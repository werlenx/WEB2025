import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Task } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TaskCard } from '@/components/TaskCard';

export default function Tasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Tasks
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get('/tasks');
      return res.data;
    },
  });

  // Fetch House Members for assignment
  const { data: houseData } = useQuery({
    queryKey: ['house'],
    queryFn: async () => {
        const res = await api.get('/house');
        return res.data;
    },
  });
  const houseMembers = houseData?.members || [];

  // Create Task Mutation
  const createTaskMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/tasks', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsModalOpen(false);
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Combine date and time
    const datePart = formData.get('datePart') as string;
    const timePart = formData.get('timePart') as string;
    const dueDate = `${datePart}T${timePart}:00`;

    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        frequency: formData.get('frequency'),
        points: Number(formData.get('points')),
        responsibleId: Number(formData.get('responsibleId')),
        dueDate: dueDate,
        canBuyOut: formData.get('canBuyOut') === 'on'
    };
    
    createTaskMutation.mutate(data);
  };

  // Sort: Pending first, then by date
  const sortedTasks = tasks?.sort((a, b) => {
    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
    if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  }) || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-gray-500">Distribuição e controle de tarefas domésticas.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" /> Nova Tarefa
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {isLoading ? (
            <p>Carregando...</p>
        ) : sortedTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-10">Nenhuma tarefa cadastrada.</p>
        ) : (
            sortedTasks.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </div>

       {/* Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg m-4">
                <h2 className="text-xl font-bold mb-4">Nova Tarefa</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Título</label>
                        <Input name="title" required placeholder="Ex: Lavar Louça" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Descrição</label>
                        <Input name="description" placeholder="Detalhes da tarefa..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Frequência</label>
                            <select name="frequency" className="w-full border rounded p-2 text-sm">
                                <option value="DAILY">Diária</option>
                                <option value="WEEKLY">Semanal</option>
                                <option value="MONTHLY">Mensal</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Pontos</label>
                            <Input name="points" type="number" defaultValue={10} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Data</label>
                            <Input name="datePart" type="date" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Hora</label>
                            <Input name="timePart" type="time" defaultValue="18:00" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Responsável</label>
                        <select name="responsibleId" className="w-full border rounded p-2 text-sm" required>
                             {houseMembers.map(m => (
                                 <option key={m.id} value={m.id}>{m.name}</option>
                             ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="canBuyOut" id="buyout" defaultChecked />
                        <label htmlFor="buyout" className="text-sm">Permitir "Compra de Folga"</label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" disabled={createTaskMutation.isPending}>Salvar</Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
