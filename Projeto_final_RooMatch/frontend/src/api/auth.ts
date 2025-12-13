// src/api/auth.ts

import apiClient, { saveToken, clearToken } from './apiClient';
import type{ AuthResponse, User } from '../utils/types';

const AUTH_URL = '/auth';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

/**
 * [POST] /auth/login
 * Realiza o login, armazena o JWT e retorna os dados do usuário.
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post(`${AUTH_URL}/login`, data);

  const { token, user } = response.data as AuthResponse;
  
  // 🚨 AÇÃO REAL: Salva o token após o login bem-sucedido
  saveToken(token); 
  
  return { token, user };
};

/**
 * [POST] /auth/register
 * Cria um novo usuário.
 */
export const register = async (data: RegisterData): Promise<{ user: User }> => {
  const response = await apiClient.post(`${AUTH_URL}/register`, data);
  // Assume que o registro retorna o objeto do novo usuário
  return response.data;
};

/**
 * [GET] /users/me (Validação de Token)
 * Busca os dados do usuário logado usando o JWT no header.
 */
export const fetchCurrentUser = async (): Promise<User> => {
    // 🚨 AÇÃO REAL: O apiClient.ts injeta o JWT automaticamente
    const response = await apiClient.get<User>(`/users/me`);
    return response.data;
};

/**
 * Logout
 */
export const logout = (): void => {
  clearToken();
};