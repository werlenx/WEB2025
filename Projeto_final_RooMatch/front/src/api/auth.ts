// src/api/auth.ts

import { apiClient, saveToken, clearToken } from "./apiClient";
import { AuthResponse, User } from "../utils/types";

const AUTH_URL = "/auth";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

/**
 * [POST] /auth/login
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await apiClient<AuthResponse>(`${AUTH_URL}/login`, {
    method: "POST",
    body: { email, password },
    // Content-Type é adicionado automaticamente pelo apiClient
  });

  // 🚨 AÇÃO REAL: Salva o token após o login bem-sucedido
  saveToken(response.token);
  return response;
};

/**
 * [POST] /auth/register
 */
export const register = async (data: RegisterData): Promise<{ user: User }> => {
  const response = await apiClient<{ user: User }>(`${AUTH_URL}/register`, {
    method: "POST",
    body: data,
  });
  return response;
};

/**
 * [GET] /users/me (Validação de Token)
 * Rota protegida para buscar os dados do usuário logado usando o JWT.
 */
export const fetchCurrentUser = async (): Promise<User> => {
  // 🚨 AÇÃO REAL: O apiClient.ts injeta o JWT automaticamente
  const response = await apiClient<User>(`/users/me`, {
    method: "GET",
  });
  return response;
};

/**
 * Logout
 */
export const logout = (): void => {
  clearToken();
};
