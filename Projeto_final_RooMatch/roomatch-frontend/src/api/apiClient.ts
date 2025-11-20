import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const BASE_URL = 'http://localhost:3333/';

const getAuthToken = (): string | null => {
  // ATENÇÃO: Em uma aplicação real Next.js, você faria:
  // 1. Verificar cookies no Server Side (para segurança)
  // 2. Usar localStorage no Client Side.
  // Por enquanto, vamos simular que o token está salvo globalmente:
  // return localStorage.getItem('authToken'); 
  return window.localStorage.getItem('authToken');
};


const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor de Requisição: Adiciona o JWT a todas as chamadas
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getAuthToken();
    
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor de Resposta: Trata erros globais, como 401 Unauthorized
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Sessão expirada ou não autorizada. Redirecionando para login.');
            // Em uma aplicação real, você forçaria o redirecionamento:
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);


export default apiClient;

/**
 * Funções auxiliares para simular o armazenamento do token no frontend.
 * Em um projeto real, estas estariam no seu AuthContext.
 */
export const saveToken = (token: string) => {
    window.localStorage.setItem('authToken', token);
};

export const clearToken = () => {
    window.localStorage.removeItem('authToken');
};