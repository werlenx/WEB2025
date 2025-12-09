export interface User {
  id: number;
  name: string;
  email: string;
  avatarColor?: string;
  role?: 'ADMIN' | 'COMMON';
  houseId?: number;
  houseStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  score: number;
  starAvg?: string; // Decimal from backend comes as string sometimes
}

export interface House {
  id: number;
  name: string;
  code: string;
  adminId: number;
  members: User[];
  pendingMembers?: User[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  points: number;
  responsibleId?: number;
  dueDate: string; // ISO Date
  status: 'PENDING' | 'AWAITING_REVIEW' | 'COMPLETED' | 'FAILED' | 'REDO' | 'BOUGHT_OUT';
  canBuyOut: boolean;
  starAverage?: string;
  responsible?: User;
}

export interface PaymentShare {
  userId: number;
  shareAmount: string; // Decimal
  isPaid: boolean;
  user: User;
}

export interface Account {
  id: number;
  name: string;
  type: 'FIXED' | 'FLOATING';
  amount: string; // Decimal
  dueDate: string; // Date or DateTime
  paidBy: User; // The creditor
  paymentShares: PaymentShare[];
}

export interface Punishment {
  id: number;
  description: string;
  pointsLost: number;
  active: boolean;
}
