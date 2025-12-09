import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LogOut, Home, Plus, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const createHouseSchema = z.object({
  houseName: z.string().min(3, 'Nome da casa deve ter pelo menos 3 caracteres'),
});

const joinHouseSchema = z.object({
  houseCode: z.string().min(1, 'Código da casa é obrigatório'),
});

type CreateHouseForm = z.infer<typeof createHouseSchema>;
type JoinHouseForm = z.infer<typeof joinHouseSchema>;

export default function HouseOnboarding() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('create');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const createForm = useForm<CreateHouseForm>({
    resolver: zodResolver(createHouseSchema),
  });

  const joinForm = useForm<JoinHouseForm>({
    resolver: zodResolver(joinHouseSchema),
  });

  const onCreateSubmit = async (data: CreateHouseForm) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/house', data);
      const { id } = response.data; // Assuming response has house id
      
      // Update local user state to reflect house membership
      updateUser({ houseId: id, houseStatus: 'APPROVED', role: 'ADMIN' });
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Falha ao criar casa.');
    } finally {
      setIsLoading(false);
    }
  };

  const onJoinSubmit = async (data: JoinHouseForm) => {
    setIsLoading(true);
    setError('');
    try {
      await api.post('/house/join', data);
      // Join usually sets status to PENDING
       updateUser({ houseStatus: 'PENDING' }); 
       // We might need to refresh user to get houseId if returned, 
       // but typically join request means we wait. 
       // However, to bypass the onboarding screen, we might need to set houseId locally if the API returns it?
       // Let's check the API response for /join: 
       // RESPONSE: { house: { name, code }, houseStatus, message }
       // It doesn't strictly say it returns the ID, but it probably does or we can assume we are "in" pending.
       // But if houseId is null in user object, ProtectedRoute -> Onboarding might still trigger?
       // Wait, my logic in Login was: if (user.houseId) -> /. 
       // So if I join, I still have houseId null until approved?
       // If I am PENDING, do I see dashboard? 
       // Ideally yes, but a "Pending Dashboard".
       // So I should set houseId to *something* or handle "PENDING" status in Onboarding?
       // Actually, let's assume if I send a join request, I am now associated with a house.
       // I'll update the user object with a placeholder houseId so they can proceed, or handle it properly.
       // If the backend doesn't return ID, I might need to fetch /house/.
       
       // Let's try fetching house info after join to get the ID.
       const houseResponse = await api.get('/house');
       // GET /house/ returns { id, name, ... }
       
       updateUser({ 
           houseId: houseResponse.data.id, 
           houseStatus: 'PENDING' 
       });
       navigate('/');

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Falha ao entrar na casa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Bem-vindo, {user?.name}!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Para começar, você precisa criar ou entrar em uma casa.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
            <Tabs.List className="flex border-b border-gray-200 mb-6">
              <Tabs.Trigger
                value="create"
                className={cn(
                  "flex-1 pb-2 text-sm font-medium text-center border-b-2 transition-colors focus:outline-none",
                  activeTab === 'create'
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <div className="flex items-center justify-center">
                    <Home className="mr-2 h-4 w-4" />
                    Criar Casa
                </div>
              </Tabs.Trigger>
              <Tabs.Trigger
                value="join"
                className={cn(
                  "flex-1 pb-2 text-sm font-medium text-center border-b-2 transition-colors focus:outline-none",
                  activeTab === 'join'
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                 <div className="flex items-center justify-center">
                    <Users className="mr-2 h-4 w-4" />
                    Entrar em Casa
                </div>
              </Tabs.Trigger>
            </Tabs.List>

            {error && (
                <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md">
                    {error}
                </div>
            )}

            <Tabs.Content value="create" className="space-y-6 focus:outline-none">
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="houseName" className="block text-sm font-medium text-gray-700">
                    Nome da Casa
                  </label>
                  <div className="mt-1">
                    <Input
                      id="houseName"
                      placeholder="Ex: República dos Programadores"
                      {...createForm.register('houseName')}
                      className={createForm.formState.errors.houseName ? 'border-red-500' : ''}
                    />
                     {createForm.formState.errors.houseName && (
                        <p className="mt-1 text-sm text-red-500">{createForm.formState.errors.houseName.message}</p>
                     )}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Criando...' : 'Criar Casa'}
                </Button>
              </form>
            </Tabs.Content>

            <Tabs.Content value="join" className="space-y-6 focus:outline-none">
               <form onSubmit={joinForm.handleSubmit(onJoinSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="houseCode" className="block text-sm font-medium text-gray-700">
                    Código da Casa
                  </label>
                  <div className="mt-1">
                    <Input
                      id="houseCode"
                      placeholder="Cole o código aqui"
                      {...joinForm.register('houseCode')}
                       className={joinForm.formState.errors.houseCode ? 'border-red-500' : ''}
                    />
                    {joinForm.formState.errors.houseCode && (
                        <p className="mt-1 text-sm text-red-500">{joinForm.formState.errors.houseCode.message}</p>
                     )}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                   {isLoading ? 'Entrando...' : 'Entrar na Casa'}
                </Button>
              </form>
            </Tabs.Content>
          </Tabs.Root>

          <div className="mt-6">
             <Button variant="ghost" className="w-full text-gray-500" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
