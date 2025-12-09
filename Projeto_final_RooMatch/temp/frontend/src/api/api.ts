import axios from 'axios';
import { Task } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type CreateTaskData = Omit<Task, 'id' | 'status' | 'starAverage' | 'responsible'>;

// Function to get all tasks
export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>('/tasks');
  return response.data;
};

// Function to create a new task
export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
  const response = await api.post<Task>('/tasks', taskData);
  return response.data;
};

// Function to update task status
export const updateTaskStatus = async (taskId: number, status: Task['status']): Promise<Task> => {
  const response = await api.patch<Task>(`/tasks/${taskId}/status`, { status });
  return response.data;
};

// Function to review a task
export const reviewTask = async (taskId: number, stars: number): Promise<Task> => {
  const response = await api.post<Task>(`/tasks/${taskId}/review`, { stars });
  return response.data;
};