import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Users, CreditCard, User, LogOut, ShoppingBag, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Tarefas', href: '/tasks', icon: CheckSquare },
  { name: 'Financeiro', href: '/finance', icon: CreditCard },
  { name: 'Mercado', href: '/market', icon: ShoppingBag },
  { name: 'Roda da Punição', href: '/punishments', icon: Zap },
  { name: 'Membros', href: '/members', icon: Users },
  { name: 'Perfil', href: '/profile', icon: User },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-16 items-center px-6 font-bold text-xl tracking-wider">
        RooMatch
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white',
                    'mr-3 h-5 w-5 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 p-4">
         <div className="flex items-center mb-4 px-2">
            <div className={`h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-medium`}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate w-32">{user?.email}</p>
            </div>
         </div>
         <Button 
            variant="destructive" 
            className="w-full justify-start" 
            onClick={logout}
            size="sm"
         >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
         </Button>
      </div>
    </div>
  );
}
