//enuns
export type HouseStatus = 'APPROVED' | 'PENDING' | 'REJECTED';
export type TaskFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type TaskStatus = 'PENDING' | 'AWAITING_REVIEW' | 'COMPLETED' | 'FAILED' | 'REDO' | 'BOUGHT_OUT';
export type AccountType  = 'FIXED' | 'FLOATING';
export type HistoryEventType = 'TASK_COMPLETED' | 'TASK_FAILED' | 'PUNISHMENT_APPLIED' | 'SCORE_ADJUSTMENT' | 'ACCOUNT_PAID';


// MODELS 
export interface Profile {
  id: number;
  name: string; // Ex: 'ADMIN', 'COMMON'
}

// Interface de Usuário
export interface User {
  id: number;
  name: string;
  email: string;
  // password_hash e reset_password_token são omitidos por segurança no frontend
  
  profile_id: number;
  // Inclui o Profile para saber a role
  profile?: Profile; 

  house_id: number | null;
  house_status: HouseStatus; 
  
  score: number;
  star_avg: number | null; // Mapeado de Decimal? (2, 1)
  avatar_color: string | null;
  created_at: string; // Mapeado de DateTime
}

// Interface de Casa (House)
export interface House {
  id: number;
  name: string;
  code: string;
  admin_id: number;
  // Admin (opcional, se fizeremos um JOIN)
  admin?: User; 
}

// Interface de Tarefas
export interface Task {
  id: number;
  house_id: number;
  title: string;
  description: string | null;
  frequency: TaskFrequency;
  points: number;
  
  responsible_id: number | null;
  responsible?: User; 
  
  due_date: string; // Mapeado de DateTime
  status: TaskStatus;
  can_buy_out: boolean;
  star_average: number | null; // Mapeado de Decimal? (2, 1)

  // Relações que podem vir junto no DTO (Data Transfer Object)
  reviews?: TaskReview[];
  buyouts?: Buyout[];
}

// Interface de Avaliação de Tarefa
export interface TaskReview {
  task_id: number;
  reviewer_id: number;
  stars: number;
  // task?: Task; // Relações podem ser omitidas para evitar recursão
  reviewer?: User;
}

// Interface de Compra de Folga
export interface Buyout {
  user_id: number;
  task_id: number;
  cycle_start_date: string; // Mapeado de DateTime
  // user?: User;
  // task?: Task;
}

// Interface de Punição (usada para a Roda da Punição e Admin)
export interface Punishment {
  id: number;
  house_id: number;
  description: string;
  penalty_points: number;
  is_active: boolean;
  created_at: string;
}

// Interface de Histórico
export interface History {
  id: number;
  house_id: number;
  user_id: number | null;
  event_type: HistoryEventType;
  description: string;
  created_at: string;
}

// Interface de Contas (Pagamentos)
export interface Account {
  id: number;
  house_id: number;
  name: string;
  type: AccountType;
  amount: number; // Mapeado de Decimal(10, 2)
  due_date: string; // Mapeado de DateTime
  paid_by_id: number;
  paid_by?: User;
  payment_shares?: PaymentShare[];
}

// Interface de Cota de Pagamento (PaymentShare)
export interface PaymentShare {
  account_id: number;
  user_id: number;
  share_amount: number; // Mapeado de Decimal(10, 2)
  is_paid: boolean;
  user?: User;
  // account?: Account;
}


// ===================================
// Tipos de Resposta de Autenticação (Adicional)
// ===================================

export interface AuthResponse {
  token: string;
  // O objeto 'user' deve ser um subconjunto de 'User' ou a interface 'User' completa, dependendo do que o backend retorna.
  user: User; 
}