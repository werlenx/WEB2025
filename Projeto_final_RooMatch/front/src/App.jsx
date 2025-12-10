import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from './services/api';

// Ícones assumidos como disponíveis no ambiente React (lucide-react)
const CheckCircle = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
const Trash2 = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const Plus = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>;
const Users = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const HistoryIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"/><path d="M3.5 12a8.5 8.5 0 0 0 13.9 3.9 8.5 8.5 0 0 0 0-16.9 8.5 8.5 0 0 0-11.4 1.3"/><path d="M12 7v5l4 2"/></svg>;
const Award = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const Clock = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const Zap = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const ThumbsUp = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12h10l3-8V6a2 2 0 0 0-2-2h-3"/><path d="M7 10h10"/><path d="M5 2c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h2V2H5z"/></svg>;
const Settings = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2H.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2H4a2 2 0 0 0 2 2v.44a2 2 0 0 1 2 2H12a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1-2-2H18a2 2 0 0 0-2-2v-.44a2 2 0 0 1-2-2H12.22z"/><circle cx="12" cy="12" r="3"/></svg>;
const LogOut = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
const UserPlus = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const LogIn = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>;
const Home = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const Check = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const X = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const DoorOpen = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20v-2a6 6 0 0 1 6-6h4"/><path d="M15 10h.01"/><path d="M4 14v-4h2"/><path d="M4 4v16"/></svg>;
const Edit = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const Link = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.74 1.74"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const ZapOff = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.41 6.13 14 3h-2l-4 7h4l-3.37 8.35"/><line x1="2" x2="22" y1="2" y2="22"/></svg>;
const CreditCard = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const ShoppingBag = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>; // Para o mercado de preferência
const Star = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; // Para o sistema de estrelas


// --- DADOS MOCKADOS REMOVIDOS ---
// Agora os dados virão do backend via API.

// Função para formatar a data e hora (DD/MM HH:MM)
const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const d = new Date(isoString);
    try {
        const datePart = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        const timePart = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return `${datePart} ${timePart}`;
    } catch (e) {
        console.error("Erro ao formatar data:", isoString, e);
        return 'Data Inválida';
    }
};


const VIEW_TITLES = {
    dashboard: "Dashboard de Tarefas",
    ranking: "Ranking de Pontos",
    wheel: "Roda da Punição",
    history: "Histórico de Eventos",
    adminSettings: "Configurações Admin", 
    houseMembers: "Membros da Casa", 
    taskCreation: "Criar Nova Tarefa", 
    accounts: "Contas e Finanças", 
    market: "Mercado de Preferências",
    login: "Entrar no Roomatch",
    register: "Criar Conta",
    houseFlow: "Gerenciar Casa",
};

// --- COMPONENTE PRINCIPAL ---


const App = () => {
  // Estado de Autenticação
  const [authToken, setAuthToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Dados Mocks globais -> Substituídos por estados iniciais vazios
  const [allUsers, setAllUsers] = useState([]);
  const [houses, setHouses] = useState([]);
  const [tasks, setTasks] = useState([]); 
  const [punishments, setPunishments] = useState([]);
  const [history, setHistory] = useState([]);
  const [accounts, setAccounts] = useState([]); 
  const [buyouts, setBuyouts] = useState({}); 
  
  // Estado de Visualização
  const [view, setView] = useState('login');
  const [modal, setModal] = useState({ visible: false, title: '', message: '' });
  const [spinResult, setSpinResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [editingTask, setEditingTask] = useState(null); 
  const [editingAccount, setEditingAccount] = useState(null); 
  const [reviewingTask, setReviewingTask] = useState(null); // Novo estado para modal de avaliação
  
  // Variável para rastrear se o usuário logado JÁ foi notificado sobre as falhas atuais. (CORREÇÃO)
  const [notifiedFailedTaskIds, setNotifiedFailedTaskIds] = useState([]);
  
  // Utilidade para gerar códigos de casa
  const generateHouseCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();


  // --- EFEITO: CARREGAMENTO DE DADOS E POLLING ---
  
  const fetchDashboardData = useCallback(async () => {
      if (!currentUser || !authToken) return;
      
      try {
          // Carrega dados da casa (inclui membros)
          if (currentUser.houseId) {
             const houseRes = await api.get('/house');
             const houseData = houseRes.data;
             
             // Atualiza Houses (apenas a atual para visualização)
             setHouses([houseData]); 
             
             // Atualiza Members
             // O endpoint /house retorna members e pendingMembers.
             // Precisamos juntar e normalizar para o formato esperado pelo frontend 'allUsers'
             // Backend User: { id, name, email, score, star_avg, avatar_color, role, houseStatus }
             // Frontend User: { ..., papel, avatar... }
             
             const mappedMembers = [
                ...(houseData.members || []),
                ...(houseData.pendingMembers || [])
             ].map(u => ({
                 ...u,
                 papel: u.role === 'ADMIN' ? 'admin' : 'comum',
                 pontuacao: u.score || 0,
                 houseStatus: u.houseStatus ? u.houseStatus.toLowerCase() : 'pending',
                 avatar: u.avatar_color || 'bg-gray-400',
                 starAvg: u.star_avg,
                 houseId: houseData.id
             }));
             
             // Precisamos manter o currentUser atualizado também na lista? Sim.
             setAllUsers(mappedMembers);
          }

          // Carrega Tarefas
          if (currentUser.houseId && currentUser.houseStatus === 'approved') {
              const tasksRes = await api.get('/tasks');
              const mappedTasks = tasksRes.data.map(t => ({
                  ...t,
                  responsavelId: t.responsible_id,
                  dataLimite: t.due_date,
                  canBuyOut: t.can_buy_out,
                  starReviews: t.reviews || {}, // TODO: Backend precisa retornar isso se quisermos manter a UI de estrelas detalhada
                  status: t.status.toLowerCase(),
                  approvals: {}, // Não parece ser usado no backend da mesma forma
                  starAverage: t.star_average
              }));
              setTasks(mappedTasks);
          }

          // Carrega Punições
          const punishmentsRes = await api.get('/punishments');
          setPunishments(punishmentsRes.data.map(p => ({
              id: p.id,
              descricao: p.description,
              pontosPerdidos: p.penalty_points,
              ativo: p.is_active
          })));

          // Carrega Histórico
          const historyRes = await api.get('/history');
          setHistory(historyRes.data.map(h => ({
              id: h.id,
              usuarioId: h.user?.id,
              tipoEvento: h.eventType ? h.eventType.toLowerCase() : 'unknown',
              descricao: h.description,
              data: new Date(h.createdAt)
          })));

          // Carrega Contas
          const accountsRes = await api.get('/accounts');
          setAccounts(accountsRes.data.map(a => {
              // Mapeia paymentShares para um objeto { userId: { paid, amount } }
              const paymentsMap = {};
              a.paymentShares.forEach(share => {
                  paymentsMap[share.userId] = {
                      paid: share.isPaid,
                      amount: Number(share.shareAmount)
                  };
              });
              
              const paidById = a.paidBy?.id;

              return {
                  id: a.id,
                  name: a.name,
                  type: a.type ? a.type.toLowerCase() : 'fixa',
                  amount: Number(a.amount),
                  dueDate: a.dueDate, // Mantém string ISO ou YYYY-MM-DD
                  paidBy: paidById,
                  responsibleMembers: a.paymentShares.map(s => s.userId),
                  division: { method: 'equal', shares: {} }, // Simplificação, backend já retorna shares calculadas
                  payments: paymentsMap
              };
          }));
          
      } catch (error) {
          console.error("Erro ao buscar dados:", error);
      }
  }, [currentUser, authToken]);

  useEffect(() => {
     fetchDashboardData();
     
     // Polling a cada 10s para manter atualizado
     const interval = setInterval(fetchDashboardData, 10000);
     return () => clearInterval(interval);
  }, [fetchDashboardData]);


  // --- Funções de Autenticação e Casa ---
  
  const handleLogin = async (email, senha) => {
    try {
        const response = await api.post('/auth/login', { email, password: senha });
        const { token, user } = response.data;

        localStorage.setItem('authToken', token);
        setAuthToken(token);
        
        // Mapeia os dados do usuário para o formato esperado pelo frontend
        // Adiciona um avatar/cor padrão se não vier do backend (embora o backend tenha avatar_color, o login response pode não ter)
        const mappedUser = {
            ...user,
            papel: user.role === 'ADMIN' ? 'admin' : 'comum', // Backend: ADMIN/COMMON, Frontend: admin/comum
            pontuacao: user.score,
            houseStatus: user.houseStatus ? user.houseStatus.toLowerCase() : 'unregistered',
            avatar: 'bg-blue-400', // Padrão
        };
        
        setCurrentUser(mappedUser);
        setNotifiedFailedTaskIds([]);

        if (!mappedUser.houseId || mappedUser.houseStatus !== 'approved') {
            setView('houseFlow');
        } else {
            setView('dashboard');
        }
        setModal({ visible: true, title: 'Sucesso', message: `Bem-vindo(a), ${mappedUser.name.split(' ')[0]}!` });

    } catch (error) {
        console.error("Erro no login:", error);
        setModal({ visible: true, title: 'Erro de Login', message: error.response?.data?.message || 'Falha ao autenticar.' });
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setNotifiedFailedTaskIds([]); // Limpa ao sair
    setView('login');
    setModal({ visible: true, title: 'Logout', message: 'Você foi desconectado(a).' });
  };

  const handleRegister = async (newUser) => {
    try {
        await api.post('/auth/register', {
            name: newUser.nome,
            email: newUser.email,
            password: newUser.senha
        });
        
        setModal({ visible: true, title: 'Sucesso', message: 'Conta criada! Faça login para gerenciar sua casa.' });
        setView('login');
    } catch (error) {
        console.error("Erro no registro:", error);
        setModal({ visible: true, title: 'Erro', message: error.response?.data?.message || 'Falha ao criar conta.' });
    }
  };
  
  // Atualiza o usuário em todos os estados
  const updateCurrentUser = useCallback((updates) => {
      setCurrentUser(prev => ({ ...prev, ...updates }));
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updates } : u));
  }, [currentUser]);

  const handleCreateHouse = async (e) => {
      e.preventDefault();
      const houseName = e.target.houseName.value;

      try {
          const response = await api.post('/house', { houseName });
          const newHouse = response.data;
          
          // Atualiza estado local
          setCurrentUser(prev => ({
              ...prev,
              houseId: newHouse.id,
              houseStatus: 'approved',
              papel: 'admin'
          }));
          
          setHouses([newHouse]); // Assume que agora só temos uma casa no contexto

          setModal({ 
              visible: true, 
              title: 'Casa Criada!', 
              message: `Casa "${newHouse.name}" criada com sucesso. Seu código é **${newHouse.code}**. Você é o Admin!` 
          });
          setView('dashboard');
          
          fetchDashboardData(); // Atualiza dados
          
      } catch (error) {
          console.error("Erro ao criar casa:", error);
           setModal({ visible: true, title: 'Erro', message: error.response?.data?.message || 'Erro ao criar casa.' });
      }
  };

  const handleJoinHouse = async (e, automaticApproval = false) => {
      e.preventDefault();
      const houseCode = e.target.houseCode.value.toUpperCase();

      try {
          const response = await api.post('/house/join', { 
              houseCode, 
              automaticApproval 
          });
          
          const { house, houseStatus, message } = response.data;

          updateCurrentUser({
              houseId: house.id, // O ID pode não vir diretamente no join response se não atualizar o objeto inteiro, verificar API.
              // A resposta do Join retorna { house: { name, code }, houseStatus, message }
              // Talvez precisemos buscar os dados completos do usuário novamente.
              houseStatus: houseStatus.toLowerCase(),
              papel: 'comum'
          });
          
          // Força refresh do usuário para garantir ID da casa correto
          const meRes = await api.get('/house'); // Se entrou, deve conseguir pegar info? Ou dá 403 se pendente?
          // O hook de auth deixa passar, mas o getHouseHandler retorna detalhes da casa.
          
          setModal({ 
              visible: true, 
              title: 'Solicitação Enviada', 
              message: message 
          });
          
          if (houseStatus === 'APPROVED') {
              setView('dashboard');
              fetchDashboardData();
          } else {
              setView('houseFlow');
          }

      } catch (error) {
           setModal({ visible: true, title: 'Erro', message: error.response?.data?.message || 'Erro ao entrar na casa.' });
      }
  };
  
  const handleCopyLink = (code, autoApprove = false) => {
      // Cria o link simulado
      const type = autoApprove ? 'auto' : 'request';
      const mockLink = `https://roomatch.app/invite?code=${code}&type=${type}`;

      // Simula a cópia para a área de transferência
      document.execCommand('copy'); 

      setModal({
          visible: true,
          title: 'Link Copiado!',
          message: `O link de convite (${type}) para a casa **${code}** foi copiado para a área de transferência. Link simulado: ${mockLink}`
      });
  };

  const handleApproveRejectUser = async (userId, approvalStatus) => {
      try {
          const status = approvalStatus ? 'APPROVED' : 'REJECTED';
          await api.patch(`/house/members/${userId}/status`, { status });
          
          setModal({ 
              visible: true, 
              title: 'Membro Atualizado!', 
              message: `O status do membro foi atualizado para ${status}.` 
          });
          
          fetchDashboardData(); // Recarrega a lista
          
      } catch (error) {
          console.error("Erro ao atualizar membro:", error);
          setModal({ visible: true, title: 'Erro', message: 'Falha ao atualizar status do membro.' });
      }
  };
  
  const handleTransferAdmin = (newAdminId) => {
    if (currentUser.papel !== 'admin') return;

    // 1. Encontra os usuários
    const newAdmin = allUsers.find(u => u.id === newAdminId);
    const currentHouse = getCurrentHouse();

    if (!newAdmin || !currentHouse || newAdmin.id === currentUser.id) return;

    // Substitui window.confirm por um modal em um ambiente real
    if (window.confirm(`Tem certeza que deseja transferir a administração para ${newAdmin.nome}?`)) {
        
        // 2. Atualiza os papéis dos usuários
        setAllUsers(prevUsers => prevUsers.map(u => {
            if (u.id === currentUser.id) {
                // Admin atual volta a ser comum
                return { ...u, papel: 'comum' };
            }
            if (u.id === newAdminId) {
                // Novo Admin
                return { ...u, papel: 'admin' };
            }
            return u;
        }));

        // 3. Atualiza o AdminId da casa
        setHouses(prevHouses => prevHouses.map(h => 
            h.id === currentHouse.id ? { ...h, adminId: newAdminId } : h
        ));
        
        // 4. Atualiza o estado do usuário logado se ele era o antigo admin
        updateCurrentUser({ papel: 'comum' });

        setModal({
            visible: true,
            title: 'Transferência Concluída!',
            message: `A administração da **${currentHouse.name}** foi transferida para **${newAdmin.nome}**.`
        });
        setView('dashboard');
    }
  };


  // --- Estrutura de Dados e Utilidades ---
  const getResponsibleName = (id) => allUsers.find(u => u.id === id)?.nome || 'Desconhecido';
  const getAvatarBg = (id) => allUsers.find(u => u.id === id)?.avatar || 'bg-gray-400';
  const getCurrentHouse = () => houses.find(h => h.id === currentUser?.houseId);
  const formatCurrency = (amount) => {
    // Garante que o valor é formatado com duas casas decimais
    const roundedAmount = Math.round(amount * 100) / 100;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(roundedAmount);
  };
  const formatDate = (dateString) => {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
  };
  // Custo de compra da folga: 10% a mais que o valor da tarefa
  const getBuyOutCost = (taskPoints) => Math.ceil(taskPoints * 1.1); 
  // Retorna o Top 1 do ranking
  const getTopRankedUser = () => houseMembers.sort((a, b) => b.pontuacao - a.pontuacao)[0];

  const houseMembers = useMemo(() => {
    return allUsers.filter(u => u.houseId === currentUser?.houseId && u.houseStatus === 'approved');
  }, [allUsers, currentUser]);
  
  // Variáveis globais para o Mercado e Dashboard (CORREÇÃO DE ERRO)
  const availableBuyoutTasks = useMemo(() => 
    tasks.filter(t => t.canBuyOut && t.status === 'pendente')
  , [tasks]);

  const costliestTask = useMemo(() => 
    availableBuyoutTasks.length > 0
        ? availableBuyoutTasks.sort((a, b) => b.pontos - a.pontos)[0]
        : null
  , [availableBuyoutTasks]);


  // Calcula a média das estrelas de uma tarefa (excluindo o responsável)
  const calculateStarAverage = (task, topStarAvg = 0, topUserId = null) => {
      const reviews = Object.entries(task.starReviews || {})
          .filter(([userId]) => Number(userId) !== task.responsavelId); // Exclui o voto do responsável
      
      if (reviews.length === 0) return 0;
      
      let totalWeightedStars = 0;
      let totalWeight = 0;
      
      reviews.forEach(([userId, stars]) => {
          let weight = 1.0;
          // Regra de Ponderação: Se o avaliador é o "Padrão Ouro" (Top Star Avg)
          if (Number(userId) === topUserId) {
              weight = 1.2;
          }
          
          totalWeightedStars += stars * weight;
          totalWeight += weight;
      });
      
      return (totalWeightedStars / totalWeight).toFixed(1);
  };
  
  // Lógica para determinar o fator de multiplicação de pontos baseado na média de estrelas
  const getStarMultiplier = (average) => {
      if (average >= 2.8) return 1.0; // Média 3.0 (100%)
      if (average >= 1.8) return 0.8; // Média 2.0 (80%)
      return 0.0; // Média 1.0 (0%)
  };


  // --- Lógica de Compra de Preferência (Market) ---

  const handleBuyout = (taskId, cost) => {
      if (!currentUser || currentUser.pontuacao < cost) {
          setModal({ visible: true, title: 'Pontos Insuficientes', message: `Você precisa de ${cost} pontos para comprar esta folga.` });
          return;
      }

      // 1. Deduz pontos do usuário
      setAllUsers(prevUsers => prevUsers.map(u => 
          u.id === currentUser.id ? { ...u, pontuacao: u.pontuacao - cost } : u
      ));
      
      // 2. Registra a folga para o próximo ciclo
      setBuyouts(prev => ({
          ...prev,
          [currentUser.id]: [...(prev[currentUser.id] || []), taskId]
      }));
      
      // 3. Atualiza o estado do usuário logado
      setCurrentUser(prev => ({...prev, pontuacao: prev.pontuacao - cost}));

      // 4. Registra Histórico
      setHistory(prevHistory => [{
          id: Date.now(),
          usuarioId: currentUser.id,
          tipoEvento: 'compra_folga',
          descricao: `${currentUser.nome} comprou folga para a tarefa ID ${taskId}. (-${cost}pts)`,
          data: new Date()
      }, ...prevHistory]);

      setModal({ visible: true, title: 'Folga Comprada! (Simulação)', message: `Você gastou **${cost} pontos** para garantir que não fará esta tarefa no próximo ciclo. \n\n⚠️ Nota: Esta funcionalidade ainda não é persistida no servidor.` });
  };
  

  // --- Lógica de Conclusão, Avaliação e Pontuação ---
  
  // 1. Ação do Responsável: Marcar como Concluída (Inicia o processo de avaliação)
  // 1. Ação do Responsável: Marcar como Concluída (Inicia o processo de avaliação)
  const handleMarkDone = async (taskId) => {
      // Verificação Local Rápida
      // const task = tasks.find(t => t.id === taskId);
      // if (!task || task.responsavelId !== currentUser.id) return;

      try {
          await api.patch(`/tasks/${taskId}/status`, { status: 'AWAITING_REVIEW' });
          setModal({ visible: true, title: 'Avaliação Iniciada', message: 'Tarefa marcada como concluída! Aguardando a avaliação dos seus colegas de quarto.' });
          fetchDashboardData();
      } catch (error) {
           setModal({ visible: true, title: 'Erro', message: 'Erro ao atualizar status da tarefa.' });
      }
  };
  
  // 2. Ação dos Colegas: Avaliar a Tarefa
  // 2. Ação dos Colegas: Avaliar a Tarefa
  const handleRateTask = async (taskId, stars) => {
      try {
          // O backend calcula a média e finaliza se necessário.
          // Endpoint: POST /tasks/:taskId/review { stars }
          const res = await api.post(`/tasks/${taskId}/review`, { stars });
          
          setReviewingTask(null); 
          setModal({ visible: true, title: 'Avaliação Registrada', message: res.data.message || 'Avaliação enviada com sucesso.' });
          fetchDashboardData();

      } catch (error) {
          console.error("Erro ao avaliar:", error);
          setModal({ visible: true, title: 'Erro', message: error.response?.data?.message || 'Erro ao avaliar tarefa.' });
      }
  };
  
  // 3. Ação do Sistema: Finalizar a Tarefa (Cálculo de Pontos)
  const finalizeTask = (taskId, starReviews, isSimpleApproval = false) => {
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return;
      const taskToFinalize = tasks[taskIndex];
      const responsibleId = taskToFinalize.responsavelId;
      
      // Encontra o Padrão Ouro para ponderação de voto
      const topUser = houseMembers.sort((a, b) => b.starAvg - a.starAvg)[0];
      const topUserId = topUser ? topUser.id : null;


      let average;
      let pointsEarned;
      
      if (isSimpleApproval) {
          // Para tarefas simples, se houver consenso OK, a média é 3.0
          average = 3.0;
          pointsEarned = taskToFinalize.pontos;
      } else {
          // Para tarefas de alto valor, calcula a média ponderada
          average = calculateStarAverage({ ...taskToFinalize, starReviews }, topUser?.starAvg, topUserId);
          const multiplier = getStarMultiplier(average);
          pointsEarned = Math.round(taskToFinalize.pontos * multiplier);
      }
      
      let finalStatus = 'concluida';
      let message;

      if (pointsEarned === 0 && !isSimpleApproval) {
          finalStatus = 'refazer';
          message = `**Média de ${average} Estrelas (Ruim).** Pontos não atribuídos. ${getResponsibleName(responsibleId)} deve refazer a tarefa.`;
      } else {
          // Atribui pontos
          setAllUsers(prevUsers => prevUsers.map(u => 
              u.id === responsibleId ? { ...u, pontuacao: u.pontuacao + pointsEarned } : u
          ));
          message = isSimpleApproval 
            ? `Aprovação Rápida Concluída. Pontuação: ${pointsEarned} pontos.`
            : `**Média: ${average} Estrelas.** Pontuação Final: ${pointsEarned} pontos.`;
      }
      
      // 4. Atualiza o Status da Tarefa e Salva Média
      setTasks(prevTasks => prevTasks.map((t, index) => 
          index === taskIndex ? { ...t, status: finalStatus, starAverage: average } : t
      ));
      
      // 5. Atualiza a média de estrelas de todos os usuários (necessário para a ponderação)
      // OBS: A média real do usuário deve ser calculada no servidor com base no histórico real,
      // mas aqui, mockamos para que o 'Padrão Ouro' seja dinâmico.
      setAllUsers(prevUsers => prevUsers.map(u => {
          // Simulamos uma atualização de média simples se ele for o responsável
          if (u.id === responsibleId) {
              const newStarAvg = (u.starAvg * 0.9 + Number(average) * 0.1); // Simulação de média móvel
              return { ...u, starAvg: newStarAvg };
          }
          return u;
      }));


      // 6. Registra Histórico
      setHistory(prevHistory => [{
          id: Date.now(),
          usuarioId: responsibleId,
          tipoEvento: finalStatus === 'concluida' ? 'tarefa_concluida_qualidade' : 'tarefa_refazer',
          descricao: `${getResponsibleName(responsibleId)} obteve média ${average} em "${taskToFinalize.titulo}". (+${pointsEarned}pts)`,
          data: new Date()
      }, ...prevHistory]);

      setModal({ visible: true, title: 'Avaliação Finalizada!', message: message });
  };
  
  // Componente de Estrelas para Avaliação
  const StarRating = ({ value, onClick, disabled }) => (
      <div className="flex justify-center space-x-1">
          {[1, 2, 3].map((starValue) => (
              <Star
                  key={starValue}
                  className={`w-8 h-8 cursor-pointer transition ${
                      starValue <= value ? 'fill-yellow-400 text-yellow-500' : 'text-gray-300'
                  } ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:scale-110'}`}
                  onClick={() => !disabled && onClick(starValue)}
                  fill={starValue <= value ? 'currentColor' : 'none'}
              />
          ))}
      </div>
  );
  
  // Modal para Avaliação de Estrelas
  const ReviewModal = () => {
      const [stars, setStars] = useState(0);
      
      useEffect(() => {
          if (reviewingTask) {
              // Pre-seleciona a nota se já tiver avaliado
              setStars(reviewingTask.starReviews[currentUser.id] || 0);
          }
      }, [reviewingTask]);

      if (!reviewingTask || !currentUser) return null;
      
      const isResponsible = reviewingTask.responsavelId === currentUser.id;
      const alreadyReviewed = reviewingTask.starReviews[currentUser.id] !== undefined;
      const isSimpleApproval = reviewingTask.pontos < 15; // Regra UX: Baixo valor = aprovação simples

      let reviewContent;

      if (isResponsible) {
          reviewContent = <div className="text-center p-4 bg-yellow-50 rounded-lg text-yellow-800 font-medium">Você não pode avaliar sua própria tarefa. Aguarde seus colegas.</div>;
      } else if (isSimpleApproval) {
          // Fluxo de Aprovação Rápida (Botões OK/Não OK)
          const handleSimpleVote = (vote) => handleRateTask(reviewingTask.id, vote ? 3 : 1); // 3=OK, 1=Não OK
          
          reviewContent = (
              <>
                  <p className="text-lg font-bold text-gray-700 text-center mb-4">A tarefa está OK?</p>
                  <div className="flex justify-center space-x-4 mt-4">
                      <button 
                          onClick={() => handleSimpleVote(true)}
                          disabled={alreadyReviewed}
                          className={`flex items-center px-4 py-2 text-white font-semibold rounded-lg transition ${alreadyReviewed ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                      >
                          <Check className="w-5 h-5 mr-2" /> OK! (Aprovar)
                      </button>
                      <button 
                          onClick={() => handleSimpleVote(false)}
                          disabled={alreadyReviewed}
                          className={`flex items-center px-4 py-2 text-white font-semibold rounded-lg transition ${alreadyReviewed ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                      >
                          <X className="w-5 h-5 mr-2" /> Não OK
                      </button>
                  </div>
                  {alreadyReviewed && <p className="text-sm text-gray-500 text-center mt-3">Você já votou.</p>}
              </>
          );
      } else {
          // Fluxo de Avaliação por Estrelas (Alto valor)
          reviewContent = (
              <>
                  <StarRating 
                      value={stars} 
                      onClick={setStars} 
                      disabled={alreadyReviewed}
                  />
                  <p className="text-xs text-gray-500 text-center mt-2">3 Estrelas = Excelente | 1 Estrela = Mal Feita</p>
              
                  <div className="mt-6 flex justify-between space-x-3">
                      <button 
                          onClick={() => setReviewingTask(null)} 
                          className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
                      >
                          Fechar
                      </button>
                      <button 
                          onClick={() => handleRateTask(reviewingTask.id, stars)}
                          disabled={stars === 0 || alreadyReviewed}
                          className={`px-4 py-2 text-white font-semibold rounded-lg transition ${stars === 0 || alreadyReviewed ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                      >
                          {alreadyReviewed ? `Avaliado (${stars} Estrelas)` : 'Submeter Avaliação'}
                      </button>
                  </div>
              </>
          );
      }


      return (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Avaliar Tarefa</h3>
                  <p className="text-lg font-medium text-indigo-700 text-center mb-2">{reviewingTask.titulo}</p>
                  <p className="text-sm text-gray-600 text-center mb-6">
                      Responsável: **{getResponsibleName(reviewingTask.responsavelId)}**
                  </p>
                  
                  {reviewContent}

              </div>
          </div>
      );
  };
  
  // --- CRUD para Tarefas (Admin) ---

  const handleSaveTask = async (e, taskId = null) => {
    e.preventDefault();
    if (currentUser.papel !== 'admin' && taskId === null) {
        setModal({ visible: true, title: 'Acesso Negado', message: 'Apenas administradores podem adicionar tarefas.' });
        return;
    }
    const form = e.target;
    // ... validação de data ...
    const datePart = form.dataLimite.value; 
    const timePart = form.timeLimite.value; 

    if (!datePart || !timePart) {
         setModal({ visible: true, title: 'Erro', message: 'A data e a hora limite são obrigatórias.' });
         return;
    }
    
    const dataLimiteISO = `${datePart}T${timePart}:00`; 
    // const isNew = taskId === null; // API Atual só suporta Create
    
    if (taskId) {
        setModal({ visible: true, title: 'Não Suportado', message: 'A edição de tarefas ainda não foi implementada na API.' });
        return;
    }

    const taskData = {
        title: form.titulo.value, // Backend: title vs Frontend: titulo
        description: form.descricao.value, // Backend: description
        frequency: form.frequencia.value.toUpperCase(), // Backend: DAILY, WEEKLY, MONTHLY
        points: Number(form.pontos.value) || 10,
        responsibleId: Number(form.responsavel.value),
        dueDate: dataLimiteISO,
        canBuyOut: form.canBuyOut ? form.canBuyOut.checked : true, 
    };

    try {
        await api.post('/tasks', taskData);
        setModal({ visible: true, title: 'Sucesso', message: 'Tarefa adicionada!' });
        
        fetchDashboardData(); // Refresh

        setEditingTask(null);
        document.getElementById('task-form-modal').classList.add('hidden');
        setView('dashboard'); 
        
    } catch (error) {
         console.error("Erro ao criar tarefa:", error);
         setModal({ visible: true, title: 'Erro', message: error.response?.data?.message || 'Erro ao criar tarefa.' });
    }
  };
  
  const openTaskModalForEdit = (task) => {
      // Extrai data e hora para preencher os campos de input type="date" e "time"
      const date = new Date(task.dataLimite);
      const datePart = date.toISOString().split('T')[0];
      const timePart = date.toTimeString().split(' ')[0].substring(0, 5);
      
      setEditingTask({ ...task, datePart, timePart });
      document.getElementById('task-form-modal').classList.remove('hidden');
  };

  const closeTaskModal = () => {
      setEditingTask(null);
      document.getElementById('task-form-modal').classList.add('hidden');
  }

  const handleDeleteTask = (taskId) => {
      setModal({ visible: true, title: 'Não Suportado', message: 'A exclusão de tarefas não é suportada pela API atual.' });
  };

  // --- CRUD para Contas (Accounts) ---
  
  const handleCalculateDivision = (amount, memberIds) => {
      let shares = {};
      const totalMembers = memberIds.length;
      
      // Arredonda o valor total para garantir que a soma seja precisa
      const roundedAmount = Math.round(amount * 100) / 100;
      
      if (totalMembers === 0 || roundedAmount <= 0) return {};
      
      // Calcula a cota base e o resto, garantindo 2 casas decimais
      const baseShare = Math.floor((roundedAmount / totalMembers) * 100) / 100;
      
      // Atribui a cota base a todos os membros
      memberIds.forEach(memberId => {
          shares[memberId] = baseShare;
      });
      
      // Calcula o total calculado e a diferença restante
      const totalCalculated = memberIds.reduce((sum, memberId) => sum + shares[memberId], 0);
      const remainder = Math.round((roundedAmount - totalCalculated) * 100) / 100; // Diferença restante
      
      // Distribui o resto para o primeiro membro
      if (remainder !== 0 && memberIds.length > 0) {
          shares[memberIds[0]] = Math.round((shares[memberIds[0]] + remainder) * 100) / 100;
      }
      
      return shares;
  };

  const handleSaveAccount = async (e, accountId = null) => {
      e.preventDefault();
      if (currentUser.papel !== 'admin') {
          setModal({ visible: true, title: 'Acesso Negado', message: 'Apenas administradores podem gerenciar contas.' });
          return;
      }
      
      if (accountId) {
          setModal({ visible: true, title: 'Não Suportado', message: 'A edição de contas não é suportada pela API atual.' });
          return;
      }
      
      const form = e.target;
      const amount = Number(form.amount.value);
      const type = form.type.value.toUpperCase(); // FIXED / FLOATING
      // const paidBy = Number(form.paidBy.value); // Backend decide? Não, backend pede? Create Account schema pede apenas name, type, amount, dueDate. E divide igualmente.
      // O backend NÃO pede quem pagou no Create? Vamos checar o account.route.js
      // Body: name, type, amount, dueDate.
      // O backend assume quem pagou? Ou o "paidBy" é apenas para quem pagou ANTECIPADAMENTE (credor)?
      // Na rota de create, NÃO tem field 'paidBy'. Provavelmente assume que a conta é criada e NINGUÉM pagou ainda, ou o sistema define. 
      // Mas o frontend tem 'paidBy' (Quem é o Credor).
      // Se a API não suporta definir o Credor na criação, então isso é uma limitação da integração.
      // O mock frontend assume que alguém já pagou a conta "para o mundo" e agora os outros devem pagar a ele.
      // Vou enviar o que a API pede.
      
      const accountData = {
          name: form.name.value,
          type: type, // FIXED / FLOATING
          amount: amount,
          dueDate: form.dueDate.value,
      };

      try {
          await api.post('/accounts', accountData);
          setModal({ visible: true, title: 'Sucesso', message: `Conta '${accountData.name}' adicionada!` });
          fetchDashboardData();
          
          setEditingAccount(null);
          document.getElementById('account-form-modal').classList.add('hidden');
          
      } catch (error) {
           console.error("Erro ao criar conta:", error);
           setModal({ visible: true, title: 'Erro', message: error.response?.data?.message || 'Erro ao criar conta.' });
      }
  };

  const handleDeleteAccount = (accountId) => {
    if (currentUser.papel !== 'admin') return;
     setModal({ visible: true, title: 'Não Suportado', message: 'Exclusão de contas não suportada pela API.' });
  };
  
  const handleMarkPayment = async (accountId) => {
      // Marcamos APENAS a parte do usuário logado como paga
      try {
          await api.patch(`/accounts/${accountId}/pay`); // Endpoint PATCH /accounts/:id/pay (sem body, marca o usuario logado)
          setModal({
              visible: true,
              title: 'Pagamento Atualizado',
              message: `Você marcou sua parte como PAGA.`
          });
          fetchDashboardData();
      } catch (error) {
           setModal({ visible: true, title: 'Erro', message: error.response?.data?.message || 'Erro ao registrar pagamento.' });
      }
  };

  // --- CRUD para Punições (Admin) ---

  // --- CRUD para Punições (Admin) ---

  const handleSavePunishment = async (e, id) => {
    e.preventDefault();
    const form = e.target;
    const description = form.descricao.value;
    const penaltyPoints = Number(form.pontosPerdidos.value);
    const isActive = form.ativo.checked;

    try {
        if (id) {
            // Atualiza Punição
            await api.put(`/punishments/${id}`, { description, penaltyPoints, isActive });
            setModal({ visible: true, title: 'Sucesso', message: 'Punição atualizada!' });
        } else {
            // Adiciona Punição
            await api.post('/punishments', { description, penaltyPoints });
            setModal({ visible: true, title: 'Sucesso', message: 'Punição adicionada!' });
        }
        
        fetchDashboardData();
        document.getElementById('punishment-form-modal').classList.add('hidden');

    } catch (error) {
        console.error("Erro punição:", error);
         setModal({ visible: true, title: 'Erro', message: error.response?.data?.message || 'Erro ao salvar punição.' });
    }
  };

  const handleDeletePunishment = async (id) => {
      // Substitui window.confirm por um modal em um ambiente real
      if (window.confirm('Tem certeza que deseja excluir esta punição?')) { 
          try {
              await api.delete(`/punishments/${id}`);
              setModal({ visible: true, title: 'Sucesso', message: 'Punição excluída.' });
              fetchDashboardData();
          } catch (error) {
              setModal({ visible: true, title: 'Erro', message: 'Erro ao excluir punição.' });
          }
      }
  };

  // --- Lógica da Roda da Punição ---

  // --- Lógica da Roda da Punição ---

  const handleSpinWheel = () => {
    if (isSpinning || !currentUser || currentUser.houseStatus !== 'approved') return;

    setIsSpinning(true);
    setSpinResult(null);

    const activePunishments = punishments.filter(p => p.ativo);
    if (activePunishments.length === 0) {
        setModal({ visible: true, title: 'Erro', message: 'Nenhuma punição ativa para girar a roda!' });
        setIsSpinning(false);
        return;
    }

    // Gira a roda (animação simulada)
    setTimeout(async () => {
        // Sorteia localmente para visual
        const randomIndex = Math.floor(Math.random() * activePunishments.length);
        const punishment = activePunishments[randomIndex];
        
        try {
            // Aplica no Backend: POST /punishments/apply
            await api.post('/punishments/apply', {
                punishmentId: punishment.id,
                targetUserId: currentUser.id
            });
            
            // Note: O backend deduz pontos e guarda histórico. Nós apenas recarregamos os dados.
            setSpinResult(punishment);
            setIsSpinning(false);
            
            setModal({ 
                visible: true, 
                title: 'Punição Aplicada!', 
                message: `Sua punição é: "${punishment.descricao}". Você perdeu ${punishment.pontosPerdidos} pontos.` 
            });
            
            fetchDashboardData();

        } catch (error) {
            console.error("Erro roda:", error);
            setModal({ visible: true, title: 'Erro', message: 'Erro ao aplicar punição.' });
            setIsSpinning(false);
        }

    }, 3000); // 3 segundos de "giro"
  };

  // --- Componentes de Visualização (Views) ---

  const HouseFlowView = () => {
      if (!currentUser) return <LoginView />;

      const currentHouse = getCurrentHouse();

      // Opções Pós-Login
      if (!currentHouse || currentUser.houseStatus !== 'unregistered' || currentUser.houseStatus === 'rejected') {
          // Usuário logado sem casa: Opção de Criar ou Entrar
          return (
              <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-2xl max-w-lg mx-auto my-12 space-y-8">
                  <h2 className="text-3xl font-bold text-indigo-700 flex items-center"><DoorOpen className="w-8 h-8 mr-3" /> Gerenciar Sua Casa</h2>
                  <p className="text-gray-600 text-center">**{currentUser.nome.split(' ')[0]}**, crie uma nova casa ou junte-se a uma existente para começar!</p>

                  {/* Criar Casa (Admin) */}
                  <div className="w-full p-5 border border-indigo-200 rounded-xl bg-indigo-50">
                      <h3 className="text-xl font-bold text-indigo-700 mb-3">1. Criar Nova Casa (Tornar-se Admin)</h3>
                      <form onSubmit={handleCreateHouse} className="space-y-3">
                          <input 
                              type="text" 
                              name="houseName" 
                              placeholder="Nome da Casa (Ex: República Zen)" 
                              required 
                              className="w-full p-3 border border-indigo-300 rounded-lg"
                          />
                          <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition">
                              Criar Casa e Entrar
                          </button>
                      </form>
                  </div>
                  
                  {/* Entrar em Casa Existente */}
                  <div className="w-full p-5 border border-green-200 rounded-xl bg-green-50">
                      <h3 className="text-xl font-bold text-green-700 mb-3">2. Juntar-se a uma Casa Existente</h3>
                      <p className="text-sm text-gray-600 mb-3">Use o código de convite fornecido pelo Admin da casa.</p>
                      <form onSubmit={handleJoinHouse} className="space-y-3">
                          <input 
                              type="text" 
                              name="houseCode" 
                              placeholder="Código da Casa (Ex: ALPHA7)" 
                              required 
                              className="w-full p-3 border border-green-300 rounded-lg"
                          />
                          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition">
                              Solicitar Entrada
                          </button>
                      </form>
                  </div>
              </div>
          );
      } else if (currentUser.houseStatus === 'pending') {
          // Usuário logado e aguardando aprovação
          return (
              <div className="flex flex-col items-center justify-center p-8 bg-yellow-50 rounded-xl shadow-2xl max-w-sm mx-auto my-12 space-y-4">
                  <Clock className="w-12 h-12 text-yellow-600 animate-pulse" />
                  <h2 className="text-2xl font-bold text-yellow-800 text-center">Aguardando Aprovação</h2>
                  <p className="text-gray-700 text-center">Sua solicitação para entrar na **{currentHouse.name}** (código: **{currentHouse.code}**) foi enviada ao Admin.</p>
                  
                  {/* Opção para cancelar/mudar de casa */}
                  <button 
                      onClick={() => updateCurrentUser({ houseId: null, houseStatus: 'unregistered' })} 
                      className="mt-4 text-sm text-red-600 hover:text-red-800 font-medium transition"
                  >
                      Cancelar Solicitação
                  </button>
              </div>
          );
      } else if (currentUser.houseStatus === 'approved' && currentUser.papel === 'admin') {
          // Admin - Links de Convite
          const house = getCurrentHouse();
          return (
              <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-2xl max-w-lg mx-auto my-12 space-y-8">
                  <h2 className="text-3xl font-bold text-indigo-700 flex items-center"><Link className="w-8 h-8 mr-3" /> Convidar para {house.name}</h2>
                  <p className="text-gray-600 text-center">Use estes links para convidar novos colegas. Código da Casa: **{house.code}**</p>

                  <div className="w-full space-y-4">
                      {/* Link de Solicitação */}
                      <div className="p-4 border border-indigo-200 rounded-xl bg-indigo-50 flex items-center justify-between">
                          <div>
                              <p className="font-semibold text-indigo-700">Link de Solicitação (Padrão)</p>
                              <p className="text-sm text-gray-600">Colega deve esperar sua aprovação.</p>
                          </div>
                          <button 
                              onClick={() => handleCopyLink(house.code, false)}
                              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center"
                          >
                              Copiar Link
                          </button>
                      </div>

                      {/* Link de Aprovação Automática */}
                      <div className="p-4 border border-green-200 rounded-xl bg-green-50 flex items-center justify-between">
                          <div>
                              <p className="font-semibold text-green-700">Link de Aprovação Automática</p>
                              <p className="text-sm text-gray-600">Colega entra imediatamente como membro.</p>
                          </div>
                          <button 
                              onClick={() => handleCopyLink(house.code, true)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition flex items-center"
                          >
                              Copiar Link
                          </button>
                      </div>
                  </div>
              </div>
          );
      }
      // Se for aprovado, deve ter sido redirecionado para o dashboard pelo handleLogin.
      return <DashboardView />;
  };

  
  const LoginView = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const senha = e.target.senha.value;
        handleLogin(email, senha);
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-2xl max-w-sm mx-auto my-12">
            <h2 className="text-3xl font-bold text-indigo-700 mb-6">Bem-vindo(a) ao Roomatch</h2>
            <p className="text-gray-500 mb-6 text-center">Entre para gerenciar suas tarefas e o ranking.</p>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <input 
                    type="text" // Alterado para text pois os mocks são nomes
                    name="email" 
                    placeholder="Email (Ex: ana, bruno, carla)" 
                    required 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input 
                    type="password" 
                    name="senha" 
                    placeholder="Senha (Use: 1)" 
                    required 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center">
                    <LogIn className="w-5 h-5 mr-2" /> Entrar
                </button>
            </form>
            <div className="mt-4 flex flex-col items-center space-y-2">
                <button onClick={() => setView('register')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition">
                    Ainda não tem conta? Cadastre-se
                </button>
            </div>
            <div className="mt-6 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-xs">
                *Simulação: Use email **ana** e senha **1** para Admin.
            </div>
        </div>
    );
  };

  const RegisterView = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const newUser = {
            nome: form.nome.value,
            email: form.email.value,
            senha: form.senha.value,
        };
        handleRegister(newUser);
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-2xl max-w-sm mx-auto my-12">
            <h2 className="text-3xl font-bold text-green-700 mb-6">Criar Conta</h2>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <input type="text" name="nome" placeholder="Seu Nome" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"/>
                <input type="text" name="email" placeholder="Seu Email (Ex: david)" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"/>
                <input type="password" name="senha" placeholder="Crie uma Senha" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"/>
                <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center">
                    <UserPlus className="w-5 h-5 mr-2" /> Cadastrar
                </button>
            </form>
            <button onClick={() => setView('login')} className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition">
                Já tem conta? Voltar para o Login
            </button>
        </div>
    );
  };
  const TaskCard = ({ task }) => {
    // Nova lógica de status e consenso
    const isResponsible = task.responsavelId === currentUser.id;
    const isAwaitingReview = task.status === 'awaiting_review';
    const isFailed = task.status === 'falhou';
    const isRefazer = task.status === 'refazer';
    const isConcluida = task.status === 'concluida';
    const isPendente = task.status === 'pendente';
    const isOverdue = (isPendente || isAwaitingReview || isRefazer) && task.dataLimite && new Date(task.dataLimite) < new Date();
    
    // Status e Avaliação
    const totalReviewers = houseMembers.length - 1; // Total de pessoas que podem avaliar (excluindo o responsável)
    const reviewCount = Object.keys(task.starReviews || {}).length;
    const requiredReviews = Math.ceil(totalReviewers / 2);
    const hasReviewed = task.starReviews && task.starReviews[currentUser.id] !== undefined;

    
    let approvalStatus;
    if (isFailed) {
        approvalStatus = 'FALHOU!';
    } else if (isRefazer) {
        approvalStatus = 'REFZER (0 Pts)';
    } else if (isConcluida) {
        approvalStatus = `CONCLUÍDA (${task.starAverage} Estrelas)`;
    } else if (isAwaitingReview) {
        approvalStatus = `AVALIANDO: ${reviewCount}/${requiredReviews} Votos`;
    } else {
        approvalStatus = 'PENDENTE';
    }

        
    return (
        <div className={`flex items-start p-4 mb-3 rounded-xl shadow-md transition-all duration-300 ${isConcluida ? 'bg-green-50 opacity-75' : isFailed ? 'bg-red-200 border border-red-400 opacity-70' : isRefazer ? 'bg-orange-200 border border-orange-400' : isAwaitingReview ? 'bg-yellow-50 border border-yellow-300' : isOverdue ? 'bg-red-50 hover:shadow-lg border border-red-200' : 'bg-white hover:shadow-lg hover:border-indigo-200 border border-gray-100'}`}>
            
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0 ${getAvatarBg(task.responsavelId)}`}>
                {getResponsibleName(task.responsavelId)[0]}
            </div>

            <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <p className={`text-base font-semibold truncate ${isConcluida || isFailed || isRefazer ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.titulo}</p>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full flex-shrink-0">
                        {task.pontos} Pts
                    </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Responsável: **{getResponsibleName(task.responsavelId)}**</p>
                <div className="flex justify-between items-center mt-1">
                    <div className={`text-xs font-medium ${isConcluida ? 'text-green-600' : isFailed ? 'text-red-800 font-extrabold' : isRefazer ? 'text-orange-600 font-extrabold' : 'text-red-500'}`}>
                        {approvalStatus}
                    </div>
                    {task.dataLimite && (
                        <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${isFailed || isRefazer ? 'bg-red-700 text-white' : isOverdue ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                            {isFailed || isRefazer ? 'PRAZO VENCIDO' : isOverdue ? 'ATRASADA' : `Limite: ${formatDateTime(task.dataLimite)}`}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex space-x-2 ml-4 flex-shrink-0">
                {(isPendente || isRefazer) && isResponsible && ( // Se pendente ou precisa refazer, o responsável marca como concluída
                    <button 
                        onClick={() => handleMarkDone(task.id)}
                        className={`p-2 text-sm font-medium rounded-full transition bg-indigo-500 text-white hover:bg-indigo-600`}
                        title="Marcar como Concluída (Iniciar Avaliação)"
                    >
                        <Check className="w-5 h-5" />
                    </button>
                )}
                {isAwaitingReview && !isResponsible && ( // Se aguardando review, e não é o responsável
                    <button 
                        onClick={() => setReviewingTask(task)}
                        className={`p-2 text-sm font-medium rounded-full transition ${hasReviewed ? 'bg-green-200 text-green-700' : 'bg-yellow-400 text-white hover:bg-yellow-500'}`}
                        title={hasReviewed ? `Avaliado com ${task.starReviews[currentUser.id]} Estrelas` : 'Avaliar Qualidade (Estrelas)'}
                    >
                        <Star className="w-5 h-5 fill-current" />
                    </button>
                )}
                {currentUser.papel === 'admin' && (
                    <button 
                        onClick={() => openTaskModalForEdit(task)}
                        className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition"
                        title="Editar Tarefa"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                )}
                {currentUser.papel === 'admin' && (
                    <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-full transition"
                        title="Excluir Tarefa"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
  };

  const DashboardView = () => {
    const [timeFilter, setTimeFilter] = useState('diaria'); 
    
    const filterOptions = [
        { key: 'diaria', label: 'Dia' },
        { key: 'semanal', label: 'Semana' },
        { key: 'mensal', label: 'Mês' },
    ];

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            if (task.status === 'concluida' || task.status === 'falhou') return true;

            if (timeFilter === 'diaria') {
                return task.frequencia === 'diaria';
            }
            if (timeFilter === 'semanal') {
                return task.frequencia === 'diaria' || task.frequencia === 'semanal';
            }
            if (timeFilter === 'mensal') {
                return true; 
            }
            return false;
        });
    }, [tasks, timeFilter]);

    const pendente = filteredTasks
        .filter(t => t.status === 'pendente' || t.status === 'awaiting_review' || t.status === 'refazer')
        .sort((a, b) => new Date(a.dataLimite) - new Date(b.dataLimite)); 
        
    const falhou = filteredTasks
        .filter(t => t.status === 'falhou')
        .sort((a, b) => new Date(b.falhaEm) - new Date(a.falhaEm)); 

    const concluida = filteredTasks
        .filter(t => t.status === 'concluida')
        .sort((a, b) => b.concluidoEm - a.concluidoEm);
        
    // Lógica da Barra de Descanso (Medidor de Folga)
    const targetPoints = costliestTask ? getBuyOutCost(costliestTask.pontos) : 0;
    const currentPoints = currentUser.pontuacao;
    const progress = targetPoints > 0 ? Math.min(100, (currentPoints / targetPoints) * 100) : 0;

    return (
        <div className="space-y-8">
            
            {/* Medidor de Folga (Barra de Descanso) */}
            <div className="p-4 bg-indigo-50 rounded-xl shadow-md border border-indigo-200">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-indigo-700">Medidor de Folga (Next Cycle)</h3>
                    <span className="text-sm font-extrabold text-indigo-800">{currentPoints} Pts</span>
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
                            <p>Próxima folga (Custo: **{targetPoints} Pts**): **{costliestTask.titulo}**</p>
                            {progress >= 100 && (
                                <p className="font-bold text-green-700 mt-1">🎉 Você tem pontos suficientes para a folga!</p>
                            )}
                            {progress < 100 && (
                                <p className="text-red-500">Faltam {targetPoints - currentPoints} pontos.</p>
                            )}
                        </>
                    ) : (
                        <p>Nenhuma tarefa de alto valor disponível para compra de folga.</p>
                    )}
                </div>
            </div>

            {/* Seletor de Filtro */}
            <div className="flex space-x-2 p-2 bg-gray-100 rounded-xl max-w-sm mx-auto shadow-inner">
                {filterOptions.map(option => (
                    <button
                        key={option.key}
                        onClick={() => setTimeFilter(option.key)}
                        className={`flex-1 p-2 rounded-lg font-semibold text-sm transition ${
                            timeFilter === option.key ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-white'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <section>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-red-500" /> Tarefas Pendentes ({pendente.length})
                </h3>
                <div className="space-y-3">
                    {pendente.length > 0 ? (
                        pendente.map(task => <TaskCard key={task.id} task={task} />)
                    ) : (
                        <p className="p-4 bg-lime-50 rounded-lg text-lime-700 font-medium">Nenhuma tarefa pendente para o filtro "{filterOptions.find(o => o.key === timeFilter).label}"!</p>
                    )}
                </div>
            </section>
            
            {/* Nova seção para Tarefas Falhadas */}
            <section>
                <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8 flex items-center border-t pt-4 border-gray-100">
                    <X className="w-5 h-5 mr-2 text-red-700" /> Tarefas Falharam ({falhou.length})
                </h3>
                <div className="space-y-3">
                    {falhou.length > 0 ? (
                        falhou.map(task => <TaskCard key={task.id} task={task} />)
                    ) : (
                        <p className="p-4 bg-gray-50 rounded-lg text-gray-500">Nenhuma falha registrada.</p>
                    )}
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8 flex items-center border-t pt-4 border-gray-100">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> Tarefas Concluídas ({concluida.length})
                </h3>
                <div className="space-y-3">
                    {concluida.length > 0 ? (
                        concluida.map(task => <TaskCard key={task.id} task={task} />)
                    ) : (
                        <p className="p-4 bg-gray-50 rounded-lg text-gray-500">Nenhuma tarefa concluída ainda.</p>
                    )}
                </div>
            </section>
        </div>
    );
  };

  const RankingView = () => {
    const rankedUsers = useMemo(() => 
        [...houseMembers].sort((a, b) => b.pontuacao - a.pontuacao)
    , [houseMembers]); // Usa apenas membros aprovados da casa atual

    return (
        <div className="space-y-4">
            {rankedUsers.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border-l-4 border-yellow-400">
                    <div className="flex items-center">
                        <span className={`text-2xl font-extrabold mr-4 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-700' : 'text-gray-400'}`}>
                            #{index + 1}
                        </span>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0 mr-4 ${user.avatar}`}>
                            {user.nome[0]}
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-900">{user.nome} {user.id === currentUser.id && '(Você)'}</p>
                            <p className="text-sm text-gray-500">{user.papel === 'admin' ? 'Administrador' : 'Colega'}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold text-indigo-600">{user.pontuacao} Pts</span>
                        <span className="text-sm font-semibold text-gray-500 mt-1 flex items-center">
                            {user.starAvg?.toFixed(1)} <Star className="w-4 h-4 ml-0.5 text-yellow-500 fill-yellow-500" />
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
  };
  
  const HouseMembersView = () => {
    const currentHouse = getCurrentHouse();
    const members = houseMembers.sort((a, b) => b.pontuacao - a.pontuacao); 

    return (
        <div className="space-y-6">
            <div className="p-4 bg-indigo-50 rounded-xl shadow-inner border-l-4 border-indigo-500">
                <p className="font-semibold text-indigo-800">Casa Atual: <span className="font-extrabold">{currentHouse?.name}</span> (Código: {currentHouse?.code})</p>
                <p className="text-sm text-gray-600">Total de Membros Aprovados: {members.length}</p>
            </div>

            <div className="space-y-4">
                {members.map((user) => {
                    const isAdmin = user.papel === 'admin';
                    return (
                        <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border-l-4 border-gray-200">
                            <div className="flex items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0 mr-4 ${user.avatar}`}>
                                    {user.nome[0]}
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">{user.nome} {user.id === currentUser.id && '(Você)'}</p>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isAdmin ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {isAdmin ? 'ADMIN' : 'Membro Comum'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-bold text-indigo-600">{user.pontuacao} Pts</span>
                                <span className="text-sm font-semibold text-gray-500 mt-1 flex items-center">
                                    {user.starAvg?.toFixed(1)} <Star className="w-4 h-4 ml-0.5 text-yellow-500 fill-yellow-500" />
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };
  
  const AccountsView = () => {
    const [accountFilter, setAccountFilter] = useState('fixa'); // 'fixa' ou 'flutuante'
    const accountsInHouse = accounts.filter(a => a.type === accountFilter);
    const isAdmin = currentUser.papel === 'admin';
    
    // Abre o modal de edição/criação
    const openAccountModal = (account = null) => {
        setEditingAccount(account);
        document.getElementById('account-form-modal').classList.remove('hidden');
    };
    
    const AccountCard = ({ account }) => {
        // CORRIGIDO: Garante que myPayment não é null
        const myPayment = account.payments[currentUser.id];
        const isPaid = myPayment?.paid || false;
        const myShare = myPayment?.amount || 0;
        
        // Contadores para Regra de Autoprocessamento
        const totalResponsible = account.responsibleMembers.length;
        let paidCount = 0;
        let pendingDebts = 0;

        account.responsibleMembers.forEach(memberId => {
            const payment = account.payments[memberId];
            if (payment?.paid) {
                paidCount++;
            }
            // CORRIGIDO: Calcula débitos pendentes, excluindo o pagador (credor)
            if (memberId !== account.paidBy && payment && !payment.paid) {
                pendingDebts += payment.amount;
            }
        });

        // Autoprocessamento: 100% dos membros responsáveis pagaram suas cotas
        const isAccountSettled = paidCount === totalResponsible;
        
        // CORRIGIDO: O botão só aparece se for devedor (cota > 0) E não for o pagador
        const isDebtor = myShare > 0 && account.paidBy !== currentUser.id;
        
        let myStatusText;
        if (account.paidBy === currentUser.id) {
            myStatusText = 'VOCÊ PAGOU (CREDOR)';
        } else if (myShare > 0) {
            myStatusText = isPaid ? 'SUA COTA: PAGA' : 'SUA COTA: PENDENTE';
        } else {
            myStatusText = 'NÃO É DEVEDOR';
        }
        
        const myStatusColor = isPaid ? '#10B981' : '#EF4444'; // Verde ou Vermelho
        const globalStatusColor = isAccountSettled ? 'bg-green-600' : pendingDebts > 0 ? 'bg-red-600' : 'bg-gray-600';


        return (
            <div className={`p-4 rounded-xl shadow-md transition-all duration-300 ${isAccountSettled ? 'bg-green-50 border-l-4 border-green-500' : pendingDebts === 0 ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'bg-white border-l-4 border-red-500'}`}>
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-gray-800">{account.name}</h4>
                    <span className="text-xs font-bold text-white px-3 py-1 rounded-full flex-shrink-0" style={{backgroundColor: globalStatusColor}}>
                        {isAccountSettled ? 'QUITADA' : 'PENDENTE'}
                    </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                    <p>Vencimento: **{formatDate(account.dueDate)}**</p>
                    <p className="font-semibold">Pagador (Credor): **{getResponsibleName(account.paidBy)}**</p>
                    <p className="text-xs">Divisão: {account.division.method === 'equal' ? 'Igualitária' : 'Customizada'}</p>
                    
                    <p className={`font-semibold mt-1 ${isAccountSettled ? 'text-green-600' : 'text-red-600'}`}>
                        Débito Pendente: {formatCurrency(pendingDebts)}
                    </p>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex flex-col">
                        {myShare > 0 && <span className="text-base font-extrabold" style={{color: myStatusColor}}>
                            Sua Cota: {formatCurrency(myShare)}
                        </span>}
                        <span className="text-xs font-medium" style={{color: myStatusColor}}>
                            {myStatusText}
                        </span>
                    </div>
                    
                    <div className="flex space-x-2">
                        {/* Botão de Marcar Pagamento (visível apenas se for DEVEDOR e não o pagador) */}
                        {isDebtor && (
                            <button 
                                onClick={() => handleMarkPayment(account.id)}
                                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${isPaid ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                                title={isPaid ? 'Marcar como não pago (se houve erro)' : 'Confirme que você pagou o credor.'}
                            >
                                {isPaid ? 'Desmarcar' : 'Marcar Pago'}
                            </button>
                        )}

                        {isAdmin && (
                            <>
                                <button 
                                    onClick={() => openAccountModal(account)}
                                    className="p-1 text-blue-500 hover:bg-blue-100 rounded-full transition"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => handleDeleteAccount(account.id)}
                                    className="p-1 text-red-500 hover:bg-red-100 rounded-full transition"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex space-x-2 p-1 bg-gray-100 rounded-xl shadow-inner">
                    <button
                        onClick={() => setAccountFilter('fixa')}
                        className={`p-2 rounded-lg font-semibold text-sm transition ${accountFilter === 'fixa' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-white'}`}
                    >
                        Contas Fixas
                    </button>
                    <button
                        onClick={() => setAccountFilter('flutuante')}
                        className={`p-2 rounded-lg font-semibold text-sm transition ${accountFilter === 'flutuante' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-white'}`}
                    >
                        Contas Flutuantes
                    </button>
                </div>
                {isAdmin && (
                    <button 
                        onClick={() => openAccountModal(null)}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition flex items-center"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Adicionar Conta
                    </button>
                )}
            </div>
            
            <div className="space-y-4">
                {accountsInHouse.length > 0 ? (
                    accountsInHouse.map(account => <AccountCard key={account.id} account={account} />)
                ) : (
                    <p className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">Nenhuma conta {accountFilter} registrada.</p>
                )}
            </div>
        </div>
    );
  };
  
  const PreferenceMarketView = () => {
    const myBuyouts = buyouts[currentUser.id] || [];
    const topRankedUser = getTopRankedUser();
    
    
    const isTopRanked = topRankedUser && topRankedUser.id === currentUser.id;

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold text-indigo-700 mb-4">Seu Saldo: {currentUser.pontuacao} Pontos</h3>

            {/* Descanso Forçado (Bônus Top 1) */}
            <div className={`p-5 rounded-xl shadow-lg border-l-4 ${isTopRanked ? 'bg-yellow-50 border-yellow-500' : 'bg-gray-100 border-gray-400 opacity-70'}`}>
                <h4 className="text-xl font-bold text-gray-800 flex items-center">
                    <Award className="w-6 h-6 mr-2 text-yellow-600" /> Descanso de Campeão
                </h4>
                {isTopRanked ? (
                    <p className="mt-2 text-gray-700">Parabéns! Por ser o **Top 1** do ranking, você ganha a folga automática da tarefa mais pesada (sem gastar pontos) no próximo ciclo:
                        {costliestTask ? (
                            <span className="font-extrabold text-indigo-600 block mt-1">"{costliestTask.titulo}" ({costliestTask.pontos} pts)</span>
                        ) : (
                            <span className="text-sm block mt-1">(Nenhuma tarefa de alta pontuação disponível agora)</span>
                        )}
                    </p>
                ) : (
                    <p className="mt-2 text-gray-600">O usuário **{topRankedUser?.nome || 'N/A'}** é o atual campeão e ganhou a folga automática. Acumule mais pontos para ser o próximo!</p>
                )}
            </div>

            <h3 className="text-2xl font-bold text-gray-800 pt-4 border-t border-gray-100">Comprar Folga para o Próximo Ciclo</h3>
            <p className="text-gray-600 mb-4">Gaste seus pontos acumulados para garantir que você não será o responsável por estas tarefas na próxima rodada de distribuição. (Custo: 10% a mais que a pontuação da tarefa).</p>

            <div className="space-y-4">
                {availableBuyoutTasks.length > 0 ? (
                    availableBuyoutTasks.map(task => {
                        const cost = getBuyOutCost(task.pontos);
                        const canAfford = currentUser.pontuacao >= cost;
                        const isBought = myBuyouts.includes(task.id);
                        
                        return (
                            <div key={task.id} className={`p-4 rounded-xl shadow-md flex justify-between items-center ${isBought ? 'bg-lime-50 opacity-80' : canAfford ? 'bg-white' : 'bg-red-50 opacity-70'}`}>
                                <div className="flex-1 min-w-0">
                                    <p className="text-lg font-semibold text-gray-800 truncate">{task.titulo}</p>
                                    <p className="text-sm text-gray-500">Valor da Tarefa: {task.pontos} pts</p>
                                </div>
                                
                                <div className="flex items-center space-x-3 flex-shrink-0">
                                    <span className={`text-lg font-extrabold ${isBought ? 'text-green-600' : 'text-red-500'}`}>
                                        {isBought ? 'FOLGA COMPRADA' : `${cost} Pts`}
                                    </span>
                                    <button 
                                        onClick={() => handleBuyout(task.id, cost)}
                                        disabled={isBought || !canAfford}
                                        className={`px-4 py-2 rounded-lg font-bold transition ${isBought ? 'bg-green-500 text-white cursor-not-allowed' : canAfford ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-400 text-gray-100 cursor-not-allowed'}`}
                                        title={isBought ? 'Folga Garantida' : !canAfford ? 'Pontos Insuficientes' : 'Comprar Folga'}
                                    >
                                        {isBought ? 'Comprada' : 'Comprar'}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">Nenhuma tarefa marcada para compra de folga.</p>
                )}
            </div>
        </div>
    );
  };
  
  const WheelView = () => (
    <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 rounded-xl shadow-inner">
        <h3 className="text-2xl font-extrabold text-yellow-800 mb-4 flex items-center">
            <Zap className="w-6 h-6 mr-2 fill-yellow-500 text-yellow-800" /> Roda da Punição!
        </h3>
        <p className="text-center text-gray-700 mb-6">Gire a roda para aplicar uma punição a si mesmo(a) e perder pontos no ranking!</p>
        
        {/* Simulação da Roda */}
        <div className="relative mb-6">
            <div className={`w-64 h-64 border-8 border-yellow-600 rounded-full flex items-center justify-center transition-transform duration-300 ${isSpinning ? 'animate-spin' : ''}`}
                 style={{ 
                     transform: `rotate(${isSpinning ? 360 * 5 + 90 : 0}deg)`,
                     animationDuration: isSpinning ? '3s' : '0s'
                 }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex flex-col items-center justify-center p-4">
                    <span className="text-4xl" role="img" aria-label="Wheel">🎯</span>
                    {!isSpinning && (
                        <span className="text-sm font-semibold text-yellow-900 mt-2">Pronto para girar</span>
                    )}
                </div>
                <div className="absolute top-0 right-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-red-600 transform translate-x-1/2 -translate-y-full"></div>
            </div>
            
            {spinResult && !isSpinning && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="p-3 bg-red-600 text-white rounded-xl shadow-xl transform scale-110 border-4 border-red-800">
                        <p className="text-lg font-bold text-center">PUNIÇÃO SORTEADA:</p>
                        <p className="text-xl font-extrabold text-center">{spinResult.descricao}</p>
                    </div>
                </div>
            )}
        </div>

        <button 
            onClick={handleSpinWheel}
            disabled={isSpinning || !currentUser}
            className={`px-8 py-3 text-lg font-bold rounded-xl shadow-xl transition duration-300 flex items-center justify-center ${isSpinning ? 'opacity-50 cursor-not-allowed bg-gray-500 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
        >
            {isSpinning ? 'GIRANDO...' : 'GIRAR A RODA!'}
        </button>
    </div>
  );

  const HistoryView = () => (
    <div className="space-y-3">
        {history.length > 0 ? (
            history.map(item => (
                <div key={item.id} className="p-4 bg-white rounded-xl shadow-sm flex justify-between items-start border-l-4 border-gray-200">
                    <div className="flex-1">
                        <p className={`font-semibold ${item.tipoEvento === 'punicao_aplicada' || item.tipoEvento === 'tarefa_falha' || item.tipoEvento === 'tarefa_refazer' ? 'text-red-600' : item.tipoEvento === 'tarefa_concluida' || item.tipoEvento === 'tarefa_concluida_qualidade' ? 'text-green-600' : 'text-gray-700'}`}>
                            {item.descricao}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {new Date(item.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                    </div>
                </div>
            ))
        ) : (
            <p className="p-4 bg-gray-50 rounded-lg text-gray-500">Nenhum evento registrado ainda.</p>
        )}
    </div>
  );
  const TaskCreationView = () => (
    <div className="p-6 bg-indigo-50 rounded-xl shadow-lg h-fit max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Adicionar Nova Tarefa ao Dashboard</h2>
        <form onSubmit={(e) => handleSaveTask(e, null)}>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input type="text" name="titulo" required className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea name="descricao" rows="2" className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequência</label>
                    <select name="frequencia" required className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition bg-white">
                        <option value="diaria">Diária</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensal">Mensal</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pontos</label>
                    <input type="number" name="pontos" defaultValue="10" min="1" required className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" />
                </div>
                {/* Campos de Data e Hora Limite */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora Limite</label>
                    <div className="flex space-x-2">
                        <input type="date" name="dataLimite" required className="w-1/2 p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" />
                        <input type="time" name="timeLimite" required defaultValue="18:00" className="w-1/2 p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" />
                    </div>
                    
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsável Inicial</label>
                    <select name="responsavel" required className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition bg-white">
                        {houseMembers.map(user => (
                            <option key={user.id} value={user.id}>{user.nome}</option>
                        ))}
                    </select>
                </div>
                {/* Checkbox para Compra de Folga */}
                <div className="col-span-2 flex items-center pt-8">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <input type="checkbox" name="canBuyOut" className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" defaultChecked={false} />
                        <span>Disponível para "Compra de Folga"</span>
                    </label>
                </div>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" /> Criar Tarefa
            </button>
        </form>
    </div>
  );
  
  const AdminSettingsView = () => {
    const [editingPunishment, setEditingPunishment] = useState(null); 
    const [managementView, setManagementView] = useState('punishments'); // 'punishments', 'approvals' ou 'transfer'

    const pendingApprovals = allUsers.filter(u => u.houseId === currentUser.houseId && u.houseStatus === 'pending');
    const potentialAdmins = houseMembers.filter(u => u.id !== currentUser.id && u.papel !== 'admin'); // Exclui o admin atual

    // Abre o modal de edição/criação de punição
    const openPunishmentModal = (punishment = null) => {
        setEditingPunishment(punishment);
        document.getElementById('punishment-form-modal').classList.remove('hidden');
    };

    const closePunishmentModal = () => {
        setEditingPunishment(null);
        document.getElementById('punishment-form-modal').classList.add('hidden');
    };
    
    const handleAdminTransferSubmit = (e) => {
        e.preventDefault();
        const newAdminId = Number(e.target.newAdminId.value);
        if (newAdminId) {
            handleTransferAdmin(newAdminId);
        }
    }
    
    return (
        <div>
            {/* Abas de Gerenciamento */}
            <div className="flex mb-6 bg-gray-100 rounded-xl p-1 shadow-inner">
                <button
                    onClick={() => setManagementView('punishments')}
                    className={`flex-1 p-3 font-semibold rounded-lg transition ${managementView === 'punishments' ? 'bg-red-500 text-white shadow-md' : 'text-gray-700 hover:bg-white'}`}
                >
                    Gerenciar Punições
                </button>
                <button
                    onClick={() => setManagementView('approvals')}
                    className={`flex-1 p-3 font-semibold rounded-lg transition ${managementView === 'approvals' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-700 hover:bg-white'}`}
                >
                    Aprovar Membros ({pendingApprovals.length})
                </button>
                <button
                    onClick={() => setManagementView('transfer')}
                    className={`flex-1 p-3 font-semibold rounded-lg transition ${managementView === 'transfer' ? 'bg-yellow-500 text-white shadow-md' : 'text-gray-700 hover:bg-white'}`}
                >
                    Transferir Admin
                </button>
            </div>
            
            {managementView === 'punishments' && (
                <div>
                    <div className="flex justify-end mb-6">
                        <button 
                            onClick={() => openPunishmentModal(null)}
                            className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Nova Punição
                        </button>
                    </div>

                    <div className="space-y-4">
                        {punishments.length > 0 ? (
                            punishments.map(p => (
                                <div key={p.id} className={`p-4 bg-white rounded-xl shadow-md flex justify-between items-center transition duration-300 ${p.ativo ? 'border-l-4 border-red-500' : 'border-l-4 border-gray-400 opacity-60'}`}>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lg font-semibold text-gray-800 truncate">{p.descricao}</p>
                                        <div className="text-sm flex items-center space-x-3 mt-1">
                                            <span className="text-indigo-600 font-medium">{p.pontosPerdidos} Pts Perdidos</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {p.ativo ? 'Ativa' : 'Inativa'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 flex-shrink-0">
                                        <button 
                                            onClick={() => openPunishmentModal(p)}
                                            className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition"
                                            title="Editar"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeletePunishment(p.id)}
                                            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition"
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">Nenhuma punição cadastrada.</p>
                        )}
                    </div>
                </div>
            )}

            {managementView === 'approvals' && (
                <div className="space-y-4">
                    <p className="text-gray-600 font-medium">Usuários solicitando entrada na **{getCurrentHouse()?.name || 'sua casa'}**:</p>
                    {pendingApprovals.length > 0 ? (
                        pendingApprovals.map(user => (
                            <div key={user.id} className="p-4 bg-yellow-50 rounded-xl shadow-md flex justify-between items-center border-l-4 border-yellow-500">
                                <div className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm mr-4 ${user.avatar}`}>
                                        {user.nome[0]}
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">{user.nome}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={() => handleApproveRejectUser(user.id, true)}
                                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                                        title="Aceitar"
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleApproveRejectUser(user.id, false)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                        title="Rejeitar"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="p-4 bg-lime-50 rounded-lg text-lime-700 font-medium">Nenhuma solicitação pendente.</p>
                    )}
                </div>
            )}
            
            {managementView === 'transfer' && (
                <div className="p-6 bg-yellow-50 rounded-xl shadow-inner border border-yellow-300">
                    <h3 className="text-xl font-bold text-yellow-800 mb-3 flex items-center">
                        <ZapOff className="w-6 h-6 mr-2" /> Transferência de Administração
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">Atenção! Ao transferir, você perderá seus privilégios de Admin. Esta ação é irreversível.</p>

                    {potentialAdmins.length > 0 ? (
                        <form onSubmit={handleAdminTransferSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="newAdminId" className="block text-sm font-medium text-gray-700 mb-1">Novo Administrador</label>
                                <select 
                                    id="newAdminId"
                                    name="newAdminId" 
                                    required 
                                    className="w-full p-3 border border-yellow-400 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition bg-white"
                                >
                                    <option value="">Selecione um colega</option>
                                    {potentialAdmins.map(user => (
                                        <option key={user.id} value={user.id}>{user.nome} ({user.pontuacao} Pts)</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700 transition">
                                Transferir Administração
                            </button>
                        </form>
                    ) : (
                        <p className="p-4 bg-red-100 text-red-800 rounded-lg font-medium">Adicione outro membro à casa antes de transferir a administração.</p>
                    )}
                </div>
            )}


            {/* Modal de Edição/Criação de Punição (Mantido) */}
            <div id="punishment-form-modal" className="hidden fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
                <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full transform transition-transform duration-300 scale-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{editingPunishment ? 'Editar Punição' : 'Criar Nova Punição'}</h3>
                    <form onSubmit={(e) => handleSavePunishment(e, editingPunishment?.id)}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição da Punição</label>
                            <textarea 
                                name="descricao" 
                                rows="3" 
                                defaultValue={editingPunishment?.descricao || ''}
                                required 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pontos Perdidos</label>
                                <input 
                                    type="number" 
                                    name="pontosPerdidos" 
                                    defaultValue={editingPunishment?.pontosPerdidos || 10} 
                                    min="1" 
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition" 
                                />
                            </div>
                            <div className="flex items-end justify-start">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                    <input 
                                        type="checkbox" 
                                        name="ativo" 
                                        defaultChecked={editingPunishment ? editingPunishment.ativo : true} 
                                        className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500" 
                                    />
                                    <span>Ativa (Pode ser sorteada)</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={closePunishmentModal} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
                                Cancelar
                            </button>
                            <button type="submit" className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition">
                                Salvar Punição
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
  };
  
  // Modal de Criação/Edição de Tarefas
  const TaskFormModal = () => (
      <div id="task-form-modal" className={`fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 ${editingTask ? '' : 'hidden'}`}>
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full transform transition-transform duration-300 scale-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{editingTask ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}</h3>
              <form onSubmit={(e) => handleSaveTask(e, editingTask?.id)}>
                  <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                      <input type="text" name="titulo" required defaultValue={editingTask?.titulo || ''} className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" />
                  </div>
                  <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                      <textarea name="descricao" rows="2" defaultValue={editingTask?.descricao || ''} className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Frequência</label>
                          <select name="frequencia" required defaultValue={editingTask?.frequencia || 'diaria'} className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition bg-white">
                              <option value="diaria">Diária</option>
                              <option value="semanal">Semanal</option>
                              <option value="mensal">Mensal</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pontos</label>
                          <input type="number" name="pontos" defaultValue={editingTask?.pontos || 10} min="1" required className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" />
                      </div>
                      {/* Campos de Data e Hora Limite */}
                      <div className="col-span-1 md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora Limite</label>
                          <div className="flex space-x-2">
                              <input type="date" name="dataLimite" required defaultValue={editingTask?.datePart || ''} className="w-1/2 p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" />
                              <input type="time" name="timeLimite" required defaultValue={editingTask?.timePart || '18:00'} className="w-1/2 p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" />
                          </div>
                          
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                          <select name="responsavel" required defaultValue={editingTask?.responsavelId || currentUser?.id} className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition bg-white">
                              {houseMembers.map(user => (
                                  <option key={user.id} value={user.id}>{user.nome}</option>
                              ))}
                          </select>
                      </div>
                      {/* Checkbox para Compra de Folga (Adicionado) */}
                      <div className="col-span-2 flex items-center pt-2">
                          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                              <input type="checkbox" name="canBuyOut" className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" defaultChecked={editingTask?.canBuyOut || false} />
                              <span>Disponível para "Compra de Folga"</span>
                          </label>
                      </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                      <button type="button" onClick={closeTaskModal} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
                          Cancelar
                      </button>
                      <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                          Salvar Alterações
                      </button>
                  </div>
              </form>
          </div>
      </div>
  );
  
  // Modal de Criação/Edição de Contas
  const AccountFormModal = () => (
      <div id="account-form-modal" className={`fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 ${editingAccount ? '' : 'hidden'}`}>
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full transform transition-transform duration-300 scale-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{editingAccount ? 'Editar Conta' : 'Adicionar Nova Conta'}</h3>
              <form onSubmit={(e) => handleSaveAccount(e, editingAccount?.id)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Conta</label>
                          <input type="text" name="name" required defaultValue={editingAccount?.name || ''} className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total (R$)</label>
                          <input type="number" name="amount" required defaultValue={editingAccount?.amount || 0} step="0.01" min="0.01" className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                          <select name="type" required defaultValue={editingAccount?.type || 'fixa'} className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition bg-white">
                              <option value="fixa">Fixa (Ex: Aluguel)</option>
                              <option value="flutuante">Flutuante (Ex: Supermercado)</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                          <input type="date" name="dueDate" required defaultValue={editingAccount?.dueDate || ''} className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quem Pagou</label>
                          <select name="paidBy" required defaultValue={editingAccount?.paidBy || currentUser?.id} className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition bg-white">
                              {houseMembers.map(user => (
                                  <option key={user.id} value={user.id}>{user.nome}</option>
                              ))}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Método de Divisão</label>
                          <select name="divisionMethod" required defaultValue={editingAccount?.division?.method || 'equal'} className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition bg-white">
                              <option value="equal">Igualitária (Padrão)</option>
                              <option value="custom">Customizada</option>
                          </select>
                      </div>
                  </div>
                  
                  {/* Seção de Divisão Customizada (Aviso) */}
                  <div className="bg-gray-100 p-4 rounded-lg mt-4">
                      <p className="text-sm font-medium text-gray-700">
                          **Divisão Atual:** {editingAccount?.division?.method === 'equal' ? 'Igualitária' : 'Customizada'}
                      </p>
                      {editingAccount?.division?.method === 'equal' && (
                          <p className="text-xs text-gray-500 mt-1">Cota-parte individual (divisão igualitária): {currentUser ? formatCurrency(handleCalculateDivision(editingAccount?.amount || 0, houseMembers.map(m => m.id))[currentUser.id] || 0) : '—'}</p>
                      )}
                      {editingAccount?.division?.method === 'custom' && (
                          <p className="text-xs text-red-500 mt-1">Ao editar, a divisão customizada será preservada. Use a opção 'Igualitária' para recalcular.</p>
                      )}
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                      <button type="button" onClick={() => { setEditingAccount(null); document.getElementById('account-form-modal').classList.add('hidden'); }} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
                          Cancelar
                      </button>
                      <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                          Salvar Conta
                      </button>
                  </div>
              </form>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20 md:pb-0">
      
      {/* Modals */}
      {modal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
             <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200">
                <h3 className="text-xl font-bold mb-2 text-gray-900">{modal.title}</h3>
                <p className="mb-6 text-gray-600">{modal.message}</p>
                <button 
                    onClick={() => setModal({ ...modal, visible: false })}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
                >
                    Entendido
                </button>
             </div>
        </div>
      )}

      <ReviewModal />
      <TaskFormModal />
      <AccountFormModal />

      {/* Main Layout */}
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl overflow-hidden flex flex-col relative">
           
           {/* Header (Only if logged in and in a main view) */}
           {authToken && currentUser?.houseStatus === 'approved' && !['login', 'register', 'houseFlow'].includes(view) && (
               <header className="bg-indigo-700 text-white p-4 shadow-md flex justify-between items-center z-10 sticky top-0">
                   <div>
                       <h1 className="text-xl font-extrabold tracking-tight">Roomatch</h1>
                       <p className="text-xs text-indigo-200">{getCurrentHouse()?.name}</p>
                   </div>
                   <div className="flex items-center space-x-3">
                       <div className="text-right">
                           <p className="text-xs font-semibold text-indigo-100">{currentUser.nome.split(' ')[0]}</p>
                           <p className="text-xs font-bold text-yellow-300">{currentUser.pontuacao} Pts</p>
                       </div>
                       <button onClick={handleLogout} className="p-2 bg-indigo-800 rounded-full hover:bg-indigo-900 transition" title="Sair">
                           <LogOut className="w-4 h-4" />
                       </button>
                   </div>
               </header>
           )}

           {/* Content Area */}
           <main className={`flex-1 overflow-y-auto ${!authToken ? 'bg-indigo-50' : ''}`}>
               <div className="p-4 pb-24 md:pb-4">
                   {view === 'login' && <LoginView />}
                   {view === 'register' && <RegisterView />}
                   {view === 'houseFlow' && <HouseFlowView />}
                   {view === 'dashboard' && <DashboardView />}
                   {view === 'ranking' && <RankingView />}
                   {view === 'wheel' && <WheelView />}
                   {view === 'market' && <PreferenceMarketView />}
                   {view === 'accounts' && <AccountsView />}
                   {view === 'history' && <HistoryView />}
                   {view === 'houseMembers' && <HouseMembersView />}
                   {view === 'adminSettings' && <AdminSettingsView />}
                   {view === 'taskCreation' && <TaskCreationView />}
               </div>
           </main>

           {/* Bottom Navigation (Mobile Style) */}
           {authToken && currentUser?.houseStatus === 'approved' && !['login', 'register', 'houseFlow'].includes(view) && (
               <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-40 md:absolute md:bottom-0">
                   <button onClick={() => setView('dashboard')} className={`flex flex-col items-center space-y-1 ${view === 'dashboard' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>
                       <Home className="w-6 h-6" />
                       <span className="text-[10px] font-medium">Início</span>
                   </button>
                   <button onClick={() => setView('ranking')} className={`flex flex-col items-center space-y-1 ${view === 'ranking' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>
                       <Award className="w-6 h-6" />
                       <span className="text-[10px] font-medium">Ranking</span>
                   </button>
                   
                   {/* FAB (Floating Action Button) for Actions */}
                   <div className="relative -top-6">
                        <button 
                            onClick={() => setView(currentUser.papel === 'admin' ? 'taskCreation' : 'wheel')}
                            className={`w-14 h-14 rounded-full shadow-lg border-4 border-gray-100 flex items-center justify-center transition-transform hover:scale-110 ${currentUser.papel === 'admin' ? 'bg-indigo-600 text-white' : 'bg-yellow-500 text-white'}`}
                        >
                            {currentUser.papel === 'admin' ? <Plus className="w-8 h-8" /> : <Zap className="w-8 h-8 fill-current" />}
                        </button>
                   </div>

                   <button onClick={() => setView('market')} className={`flex flex-col items-center space-y-1 ${view === 'market' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>
                       <ShoppingBag className="w-6 h-6" />
                       <span className="text-[10px] font-medium">Mercado</span>
                   </button>
                   <button onClick={() => setView('adminSettings')} className={`flex flex-col items-center space-y-1 ${view === 'adminSettings' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>
                       <Settings className="w-6 h-6" />
                       <span className="text-[10px] font-medium">Config</span>
                   </button>
               </nav>
           )}
      </div>
    </div>
  );
};

export default App;
