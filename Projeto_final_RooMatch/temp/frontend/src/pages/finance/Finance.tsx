import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Account, User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Finance() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'FIXED' | 'FLOATING'>('FIXED');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  // Fetch Accounts
  const { data: accounts, isLoading } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await api.get('/accounts');
      return res.data;
    },
  });
    // Fetch House Members (for the dropdown)
    const { data: houseData } = useQuery({
        queryKey: ['house'],
        queryFn: async () => {
            const res = await api.get('/house');
            return res.data;
        },
    });

  const houseMembers = houseData?.members || [];

  // Mutations
  const createAccountMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/accounts', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      setIsModalOpen(false);
      setEditingAccount(null);
    },
  });

  const payShareMutation = useMutation({
    mutationFn: async (accountId: number) => {
      return api.patch(`/accounts/${accountId}/pay`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Convert 'paidBy' to a generic object to force Typescript check or just pass ID if backend supports (Backend response schema implies Object, but creation usually takes ID. Let's assume backend creates with logged user if missing, or we need to pass a specific payload).
    // Reviewing backend route: createAccountHandler usually takes name, type, amount, dueDate. It divides equally relative to APPROVED members.
    // Wait, the backend Create route doesn't accept "paidBy" in the body?
    // Let's re-read backend/src/modules/accounts/account.route.js lines 60-77.
    // It requires: name, type, amount, dueDate.
    // It does NOT listed "paidBy" in properties.
    // Implicitly, the Creator is the "PaidBy" (Creditor)? Or does the system assume the house pays?
    // Usually in these systems, one person pays and others owe them.
    // If the backend doesn't take paidBy, it might assume the logged user is the payer.
    // Let's assume logged user is payer for now.

    const data = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      amount: Number(formData.get('amount')),
      dueDate: formData.get('dueDate') as string,
    };

    createAccountMutation.mutate(data);
  };

  const filteredAccounts = accounts?.filter((a) => a.type === filter) || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contas & Finanças</h1>
          <p className="text-gray-500">Gerencie as despesas da casa.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" /> Nova Conta
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setFilter('FIXED')}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all",
            filter === 'FIXED' ? "bg-white shadow text-indigo-600" : "text-gray-600 hover:text-gray-900"
          )}
        >
          Fixas
        </button>
        <button
          onClick={() => setFilter('FLOATING')}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all",
            filter === 'FLOATING' ? "bg-white shadow text-indigo-600" : "text-gray-600 hover:text-gray-900"
          )}
        >
          Variáveis
        </button>
      </div>

      {/* List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Carregando...</p>
        ) : filteredAccounts.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-10">Nenhuma conta encontrada.</p>
        ) : (
          filteredAccounts.map((account) => {
            const myShare = account.paymentShares.find(s => s.userId === user?.id);
            const isSettled = account.paymentShares.every(s => s.isPaid); // Or check logic
            
            return (
              <Card key={account.id} className={cn("border-l-4", isSettled ? "border-l-green-500" : "border-l-red-500")}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{account.name}</CardTitle>
                        <CardDescription>{new Date(account.dueDate).toLocaleDateString()}</CardDescription>
                    </div>
                    <span className={cn("text-xs font-bold px-2 py-1 rounded text-white", isSettled ? "bg-green-600" : "bg-red-500")}>
                        {isSettled ? "QUITADA" : "PENDENTE"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                   <div className="text-sm space-y-1">
                        <p>Valor Total: <span className="font-bold">R$ {Number(account.amount).toFixed(2)}</span></p>
                        <p>Credor: {account.paidBy.name}</p>
                        {myShare && (
                            <div className="mt-3 p-2 bg-gray-50 rounded border">
                                <p className="font-semibold text-gray-700">Sua Parte: R$ {Number(myShare.shareAmount).toFixed(2)}</p>
                                <p className={cn("text-xs font-bold", myShare.isPaid ? "text-green-600" : "text-red-500")}>
                                    Status: {myShare.isPaid ? "PAGO" : "A PAGAR"}
                                </p>
                            </div>
                        )}
                   </div>
                </CardContent>
                <CardFooter className="pt-2">
                    {/* Only show Pay button if I have a share, haven't paid, and I am NOT the creditor */}
                    {myShare && !myShare.isPaid && account.paidBy.id !== user?.id && (
                         <Button 
                            variant="outline" 
                            className="w-full border-green-600 text-green-600 hover:bg-green-50"
                            onClick={() => payShareMutation.mutate(account.id)}
                            disabled={payShareMutation.isPending}
                        >
                            <CreditCard className="w-4 h-4 mr-2" /> Marcar como Pago
                         </Button>
                    )}
                    {account.paidBy.id === user?.id && myShare && !myShare.isPaid && (
                         <p className="text-xs text-gray-400 italic text-center w-full">Você é o credor (já pago).</p>
                    )}
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      {/* Simplified Modal for Creation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Nova Conta</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Título</label>
                        <Input name="name" required placeholder="Ex: Aluguel" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Tipo</label>
                        <select name="type" className="w-full border rounded p-2">
                            <option value="FIXED">Fixa</option>
                            <option value="FLOATING">Variável</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Valor (R$)</label>
                        <Input name="amount" type="number" step="0.01" required placeholder="0.00" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Vencimento</label>
                        <Input name="dueDate" type="date" required />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" disabled={createAccountMutation.isPending}>Salvar</Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
