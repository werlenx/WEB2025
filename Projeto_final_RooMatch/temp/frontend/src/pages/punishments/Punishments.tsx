import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Punishment } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Zap, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Punishments() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<Punishment | null>(null);
  
  // Fetch Punishments
  const { data: punishments = [], isLoading } = useQuery<Punishment[]>({
    queryKey: ['punishments'],
    queryFn: async () => {
      const res = await api.get('/punishments');
      return res.data;
    },
  });

  // Admin Mutations
  const createPunishmentMutation = useMutation({
    mutationFn: async (data: Partial<Punishment>) => {
        return api.post('/punishments', data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['punishments'] })
  });

  const deletePunishmentMutation = useMutation({
    mutationFn: async (id: number) => {
        return api.delete(`/punishments/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['punishments'] })
  });
  
  // Wheel Logic
  const handleSpin = () => {
    const activePunishments = punishments.filter(p => p.active);
    if(activePunishments.length === 0) return;

    setIsSpinning(true);
    setSpinResult(null);

    // Simulate Spin delay
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * activePunishments.length);
        const result = activePunishments[randomIndex];
        setSpinResult(result);
        setIsSpinning(false);
        // Here we could call an API to register the punishment event history if needed
    }, 3000);
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createPunishmentMutation.mutate({
        description: formData.get('description') as string,
        pointsLost: Number(formData.get('pointsLost')),
        active: true
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <Zap className="text-yellow-500 fill-yellow-500" /> Roda da Punição
            </h1>
            <p className="text-gray-500">Falhou na tarefa? Gire a roda e aceite o destino.</p>
      </div>

      {/* The Wheel UI */}
      <div className="flex flex-col items-center py-10">
          <div className="relative">
              <div 
                className={cn(
                    "w-64 h-64 border-8 border-yellow-500 rounded-full flex items-center justify-center bg-yellow-100 shadow-xl transition-transform duration-300",
                    isSpinning && "animate-spin"
                )}
                style={{ animationDuration: isSpinning ? "0.5s" : "0s" }}
              >
                 <span className="text-4xl">🎲</span>
              </div>
              {/* Arrow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-red-600 z-10"></div>
          
              {spinResult && !isSpinning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 text-white p-4 rounded-xl shadow-2xl text-center animate-in zoom-in">
                        <p className="font-bold text-sm uppercase">Punição:</p>
                        <p className="text-xl font-extrabold">{spinResult.description}</p>
                        <p className="text-sm mt-1">-{spinResult.pointsLost} Pontos</p>
                    </div>
                  </div>
              )}
          </div>
          
          <Button 
            size="lg" 
            className="mt-8 bg-red-600 hover:bg-red-700 font-bold text-lg px-8"
            onClick={handleSpin}
            disabled={isSpinning || punishments.length === 0}
          >
            {isSpinning ? "GIRANDO..." : "GIRAR A RODA"}
          </Button>
      </div>

      {/* Admin Management */}
      {user?.role === 'ADMIN' && (
        <Card>
            <CardContent className="p-6 space-y-6">
                <h3 className="font-bold text-lg border-b pb-2">Gerenciar Punições</h3>
                
                {/* List */}
                <div className="space-y-2">
                    {punishments.map(p => (
                        <div key={p.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span>{p.description} <span className="text-red-500 font-bold">(-{p.pointsLost})</span></span>
                            <Button size="icon" variant="ghost" className="text-red-500" onClick={() => deletePunishmentMutation.mutate(p.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Create Form */}
                <form onSubmit={handleCreate} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="text-sm font-medium">Descrição</label>
                        <Input name="description" required placeholder="Ex: Lavar o chão" />
                    </div>
                    <div className="w-24">
                        <label className="text-sm font-medium">Pontos</label>
                        <Input name="pointsLost" type="number" required placeholder="20" />
                    </div>
                    <Button type="submit"><Plus className="w-4 h-4" /></Button>
                </form>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
