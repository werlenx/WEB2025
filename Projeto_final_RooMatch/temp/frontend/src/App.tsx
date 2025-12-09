import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Dashboard from '@/pages/dashboard/Dashboard';
import HouseOnboarding from '@/pages/house/HouseOnboarding';
import Tasks from '@/pages/tasks/Tasks';
import Finance from '@/pages/finance/Finance';
import Members from '@/pages/members/Members';
import Market from '@/pages/market/Market';
import Punishments from '@/pages/punishments/Punishments';
import AppLayout from '@/components/layout/AppLayout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/market" element={<Market />} />
                <Route path="/punishments" element={<Punishments />} />
                <Route path="/members" element={<Members />} />
                <Route path="/profile" element={<div className="p-4">Perfil (Em breve)</div>} />
              </Route>

              <Route path="/house/onboarding" element={
                <ProtectedRoute>
                   <HouseOnboarding />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;