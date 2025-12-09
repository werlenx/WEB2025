import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Task } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
export default function Market() {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Tasks
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get('/tasks');
      return res.data;
    },
  });

  // Backend currently doesn't provide a list of "top rank", so we'd need to fetch members to determine if "Champion Rest" applies.
  // For simplicity, we ignore the "Champion Rest" visual logic for now or implement it if we fetch members.
  const { data: houseData } = useQuery({
    queryKey: ['house'],
    queryFn: async () => {
        const res = await api.get('/house');
        return res.data;
    },
  });

  const members = houseData?.members || [];
  const topRankedUser = [...members].sort((a, b) => b.score - a.score)[0];
  const isTopRanked = topRankedUser?.id === user?.id;

  // Buyout Mutation
  const buyoutMutation = useMutation({
    mutationFn: async (taskId: number) => {
        // Since backend handles buyout state via status update:
        return api.patch(`/tasks/${taskId}/status`, { status: 'BOUGHT_OUT' });
    },
    onSuccess: (_, variables) => {
        const taskId = variables;
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        // Optimistically update score
        if (user && taskId) {
           const task = tasks.find(t => t.id === taskId);
           if (task) {
              const cost = getCost(task.points);
              updateUser({ score: user.score - cost });
           }
        }
    }
  });

  const availableTasks = tasks.filter(t => t.status === 'PENDING' && t.canBuyOut);
  
  // Cost calculation (110% of points)
  const getCost = (points: number) => Math.ceil(points * 1.1);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-indigo-600" />
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Mercado de Preferências</h1>
            <p className="text-gray-500">Use seus pontos para comprar folgas.</p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-indigo-50 p-6 rounded-xl border border-indigo-100">
         <div>
             <p className="text-sm font-bold text-indigo-600 uppercase">Seu Saldo</p>
             <p className="text-4xl font-extrabold text-indigo-900">{user?.score || 0} Pts</p>
         </div>
         {isTopRanked && (
             <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg text-yellow-800 border border-yellow-300">
                 <Award className="w-5 h-5" />
                 <span className="font-bold">Campeão (Folga Grátis!)</span>
             </div>
         )}
      </div>

      <div className="space-y-4">
        {isLoading ? <p>Carregando...</p> : availableTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-10">Nenhuma tarefa disponível para compra.</p>
        ) : (
            availableTasks.map(task => {
                const cost = getCost(task.points);
                const canAfford = (user?.score || 0) >= cost;

                return (
                    <Card key={task.id} className={cn("transition-all", canAfford ? "opacity-100" : "opacity-60")}>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <h3 className="font-bold text-lg">{task.title}</h3>
                                <p className="text-gray-500 text-sm">Prêmio original: {task.points} pts</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={cn("font-bold text-xl", canAfford ? "text-indigo-600" : "text-red-500")}>
                                    {cost} Pts
                                </span>
                                <Button 
                                    onClick={() => buyoutMutation.mutate(task.id)}
                                    disabled={!canAfford || buyoutMutation.isPending}
                                    variant={canAfford ? "default" : "secondary"}
                                    className={cn(canAfford && "bg-indigo-600 hover:bg-indigo-700")}
                                >
                                    Comprar Folga
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })
        )}
      </div>
    </div>
  );
}
