export interface User {
  id: number; // Ou string, dependendo do seu JWT/DB
  name: string;
  email: string;
  role: 'ADMIN' | 'COMMON';
  houseId: number | null;
  houseStatus: 'APPROVED' | 'PENDING' | 'REJECTED' | 'UNREGISTERED';
  score: number;
  starAvg: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ... Outros tipos (Task, Account, Punishment)