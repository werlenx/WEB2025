// This file defines TypeScript types and interfaces used throughout the application, ensuring type safety.

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  points: number;
  responsibleId?: number | null;
  dueDate: string; // ISO date string
  status: 'PENDING' | 'AWAITING_REVIEW' | 'COMPLETED' | 'FAILED' | 'REDO' | 'BOUGHT_OUT';
  canBuyOut: boolean;
  starAverage?: string | null;
  responsible?: {
    id: number;
    name: string;
    avatarColor?: string | null;
  };
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ErrorResponse {
  message: string;
}