import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Check, X, Star, Crown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Members() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'RANKING' | 'MANAGE'>('RANKING');

  const { data: houseData, isLoading } = useQuery({
    queryKey: ['house'],
    queryFn: async () => {
        const res = await api.get('/house');
        return res.data;
    },
  });

  const members: User[] = houseData?.members || [];
  const pendingMembers: User[] = houseData?.pendingMembers || [];

  const sortedMembers = [...members].sort((a, b) => b.score - a.score);

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, approved }: { userId: number, approved: boolean }) => {
        const status = approved ? 'APPROVED' : 'REJECTED';
        return api.patch(`/house/members/${userId}/status`, { status });
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['house'] });
    }
  });

  return (
    <div className="space-y-6 p-6">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Membros & Ranking</h1>
          <p className="text-gray-500">Veja quem está liderando e gerencie a casa.</p>
        </div>
        {user?.role === 'ADMIN' && (
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('RANKING')}
                    className={cn("px-4 py-2 rounded-md text-sm font-medium transition-all", activeTab === 'RANKING' ? "bg-white shadow" : "text-gray-500")}
                >
                    Ranking
                </button>
                <button 
                    onClick={() => setActiveTab('MANAGE')}
                    className={cn("px-4 py-2 rounded-md text-sm font-medium transition-all", activeTab === 'MANAGE' ? "bg-white shadow" : "text-gray-500")}
                >
                    Gerenciar ({pendingMembers.length})
                </button>
            </div>
        )}
      </div>

      {activeTab === 'RANKING' && (
        <div className="space-y-4">
            {isLoading ? <p>Carregando...</p> : sortedMembers.map((m, index) => {
                const isTop1 = index === 0;
                const isMe = m.id === user?.id;

                return (
                    <div key={m.id} className={cn(
                        "flex items-center justify-between p-4 rounded-xl shadow-sm border-l-4 bg-white transition-all hover:shadow-md",
                        isTop1 ? "border-yellow-400" : "border-gray-200"
                    )}>
                        <div className="flex items-center gap-4">
                            <div className={cn("text-2xl font-bold w-10 text-center", 
                                index === 0 ? "text-yellow-500" : 
                                index === 1 ? "text-gray-400" : 
                                index === 2 ? "text-amber-700" : "text-gray-300"
                            )}>
                                #{index + 1}
                            </div>
                            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg", m.avatarColor || "bg-gray-400")}>
                                {m.name[0]}
                            </div>
                            <div>
                                <p className="font-bold text-lg flex items-center gap-2">
                                    {m.name} {isMe && "(Você)"}
                                    {m.role === 'ADMIN' && <Shield className="w-4 h-4 text-indigo-500" />}
                                    {isTop1 && <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                                </p>
                                <p className="text-sm text-gray-500">Média: {m.starAvg || "N/A"}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-indigo-600">{m.score}</p>
                            <p className="text-xs text-gray-400">PONTOS</p>
                        </div>
                    </div>
                );
            })}
        </div>
      )}

      {activeTab === 'MANAGE' && (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Solicitações Pendentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pendingMembers.length === 0 ? (
                        <p className="text-gray-500 italic">Nenhuma solicitação pendente.</p>
                    ) : (
                        pendingMembers.map(m => (
                            <div key={m.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", m.avatarColor || "bg-gray-400")}>
                                        {m.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{m.name}</p>
                                        <p className="text-xs text-gray-500">{m.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatusMutation.mutate({ userId: m.id, approved: true })}>
                                        <Check className="w-4 h-4 mr-1" /> Aceitar
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => updateStatusMutation.mutate({ userId: m.id, approved: false })}>
                                        <X className="w-4 h-4 mr-1" /> Rejeitar
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Convite</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-sm text-gray-600 mb-2">Compartilhe o código da casa com seus amigos:</p>
                     <div className="text-3xl font-mono font-bold text-center bg-gray-100 p-4 rounded-lg tracking-widest select-all">
                        {houseData?.code}
                     </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
